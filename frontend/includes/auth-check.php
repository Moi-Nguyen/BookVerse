<?php
/**
 * Authentication and Authorization Check Middleware
 * Handles login verification and role-based access control
 */

class AuthChecker {
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
    
    public function requireAuth($redirectUrl = null) {
        if (!$this->isAuthenticated()) {
            $this->redirectToLogin($redirectUrl);
        }
    }
    
    public function requireRole($requiredRole, $redirectUrl = null) {
        $this->requireAuth($redirectUrl);
        
        if ($this->getUserRole() !== $requiredRole) {
            $this->redirectToUnauthorized($redirectUrl);
        }
    }
    
    public function requireAnyRole($roles, $redirectUrl = null) {
        $this->requireAuth($redirectUrl);
        
        if (!in_array($this->getUserRole(), $roles)) {
            $this->redirectToUnauthorized($redirectUrl);
        }
    }
    
    public function allowGuest() {
        // Allow guest access - no authentication required
        return true;
    }
    
    public function allowAuthenticated() {
        // Allow any authenticated user
        return $this->isAuthenticated();
    }
    
    public function allowRole($role) {
        return $this->isAuthenticated() && $this->getUserRole() === $role;
    }
    
    public function allowAnyRole($roles) {
        return $this->isAuthenticated() && in_array($this->getUserRole(), $roles);
    }
    
    private function redirectToLogin($redirectUrl = null) {
        // Calculate correct path based on current location
        $currentPath = $_SERVER['REQUEST_URI'];
        $loginUrl = $this->getLoginUrl($currentPath);
        
        if ($redirectUrl) {
            $loginUrl .= '?redirect=' . urlencode($redirectUrl);
        }
        
        header('Location: ' . $loginUrl);
        exit();
    }
    
    private function getLoginUrl($currentPath) {
        // Determine the correct path to login based on current page
        if (strpos($currentPath, '/pages/') !== false) {
            // We're in a subdirectory, need to go up
            if (strpos($currentPath, '/pages/cart/') !== false) {
                return '../../pages/auth/login.php';
            } elseif (strpos($currentPath, '/pages/account/') !== false) {
                return '../../pages/auth/login.php';
            } elseif (strpos($currentPath, '/pages/seller/') !== false) {
                return '../../pages/auth/login.php';
            } elseif (strpos($currentPath, '/pages/admin/') !== false) {
                return '../../pages/auth/login.php';
            } elseif (strpos($currentPath, '/pages/products/') !== false) {
                return '../../pages/auth/login.php';
            } else {
                return '../../pages/auth/login.php';
            }
        } else {
            // We're in root directory
            return 'pages/auth/login.php';
        }
    }
    
    private function redirectToUnauthorized($redirectUrl = null) {
        // Redirect to appropriate dashboard based on user role
        $userRole = $this->getUserRole();
        $dashboardUrl = $this->getDashboardUrl($userRole);
        
        if ($redirectUrl) {
            $dashboardUrl .= '?unauthorized=true';
        }
        
        header('Location: ' . $dashboardUrl);
        exit();
    }
    
    private function getDashboardUrl($role) {
        switch ($role) {
            case 'admin':
                return 'pages/admin/dashboard.php';
            case 'seller':
                return 'pages/seller/dashboard.php';
            case 'user':
            default:
                return 'index.php';
        }
    }
    
    public function clearAuth() {
        $this->token = null;
        $this->user = null;
        $this->isAuthenticated = false;
        
        // Clear session
        unset($_SESSION['bookverse_token']);
        
        // Clear cookie
        setcookie('bookverse_token', '', time() - 3600, '/');
    }
    
    public function setAuth($token, $user) {
        $this->token = $token;
        $this->user = $user;
        $this->isAuthenticated = true;
        
        // Store in session
        $_SESSION['bookverse_token'] = $token;
        
        // Store in cookie (24 hours)
        setcookie('bookverse_token', $token, time() + (24 * 60 * 60), '/');
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

// Global functions for easy use
function requireAuth($redirectUrl = null) {
    AuthChecker::getInstance()->requireAuth($redirectUrl);
}

function requireRole($role, $redirectUrl = null) {
    AuthChecker::getInstance()->requireRole($role, $redirectUrl);
}

function requireAnyRole($roles, $redirectUrl = null) {
    AuthChecker::getInstance()->requireAnyRole($roles, $redirectUrl);
}

function isAuthenticated() {
    return AuthChecker::getInstance()->isAuthenticated();
}

function getCurrentUser() {
    return AuthChecker::getInstance()->getUser();
}

function getCurrentUserRole() {
    return AuthChecker::getInstance()->getUserRole();
}

function getCurrentUserId() {
    return AuthChecker::getInstance()->getUserId();
}

function allowGuest() {
    return AuthChecker::getInstance()->allowGuest();
}

function allowAuthenticated() {
    return AuthChecker::getInstance()->allowAuthenticated();
}

function allowRole($role) {
    return AuthChecker::getInstance()->allowRole($role);
}

function allowAnyRole($roles) {
    return AuthChecker::getInstance()->allowAnyRole($roles);
}

// Initialize session if not started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>
