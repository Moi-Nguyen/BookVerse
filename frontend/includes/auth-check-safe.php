<?php
/**
 * Safe Authentication Check for Navigation
 * Does not redirect, only checks authentication status
 */

class SafeAuthChecker {
    private static $instance = null;
    private $token = null;
    private $user = null;
    private $isAuthenticated = false;
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        $this->initializeAuth();
    }
    
    private function initializeAuth() {
        // Get token from session or cookie
        $this->token = $this->getStoredToken();
        
        if ($this->token) {
            $this->validateToken();
        }
    }
    
    private function getStoredToken() {
        // Check session first
        if (isset($_SESSION['bookverse_token'])) {
            return $_SESSION['bookverse_token'];
        }
        
        // Check cookie
        if (isset($_COOKIE['bookverse_token'])) {
            return $_COOKIE['bookverse_token'];
        }
        
        return null;
    }
    
    private function validateToken() {
        try {
            // Decode JWT token
            $payload = $this->decodeJWT($this->token);
            
            // Check if token is expired
            if (isset($payload['exp']) && $payload['exp'] < time()) {
                $this->clearAuth();
                return;
            }
            
            // Set user data
            $this->user = $payload;
            $this->isAuthenticated = true;
            
        } catch (Exception $e) {
            $this->clearAuth();
        }
    }
    
    private function decodeJWT($token) {
        // Simple JWT decode (in production, use a proper JWT library)
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            throw new Exception('Invalid token format');
        }
        
        $payload = json_decode(base64_decode($parts[1]), true);
        if (!$payload) {
            throw new Exception('Invalid token payload');
        }
        
        return $payload;
    }
    
    public function isAuthenticated() {
        return $this->isAuthenticated;
    }
    
    public function getUser() {
        return $this->user;
    }
    
    public function getUserId() {
        return $this->user['user_id'] ?? null;
    }
    
    public function getUserRole() {
        return $this->user['role'] ?? null;
    }
    
    public function clearAuth() {
        $this->token = null;
        $this->user = null;
        $this->isAuthenticated = false;
    }
    
    public function getAuthStatus() {
        return [
            'isAuthenticated' => $this->isAuthenticated,
            'user' => $this->user,
            'role' => $this->getUserRole(),
            'userId' => $this->getUserId()
        ];
    }
}

// Global functions for easy use (safe versions - no redirects)
function isAuthenticatedSafe() {
    return SafeAuthChecker::getInstance()->isAuthenticated();
}

function getCurrentUserSafe() {
    return SafeAuthChecker::getInstance()->getUser();
}

function getCurrentUserRoleSafe() {
    return SafeAuthChecker::getInstance()->getUserRole();
}

function getCurrentUserIdSafe() {
    return SafeAuthChecker::getInstance()->getUserId();
}

// Initialize session if not started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>
