# Sequence Diagrams - Bookverse Platform (Mermaid Format)

## 1. User Registration Sequence

```mermaid
sequenceDiagram
    participant User
    participant FE as Frontend
    participant API as Backend API
    participant UserModel
    participant DB as MongoDB
    participant Email as Email Service

    User->>FE: Fill registration form
    User->>FE: Submit form
    FE->>API: POST /api/auth/register
    API->>UserModel: Validate input
    UserModel->>DB: Check if email exists
    
    alt Email exists
        DB-->>UserModel: Email found
        UserModel-->>API: Error Email exists
        API-->>FE: 400 Bad Request
        FE-->>User: Show error message
    else
        DB-->>UserModel: Email not found
        UserModel->>UserModel: Hash password
        UserModel->>DB: Create user document
        DB-->>UserModel: User created
        UserModel->>UserModel: Generate OTP
        UserModel->>DB: Save OTP
        UserModel-->>API: User created successfully
        API->>Email: Send verification email
        Email-->>User: Verification email sent
        API-->>FE: 201 Created
        FE-->>User: Show success message
    end
```

## 2. Product Purchase Sequence

```mermaid
sequenceDiagram
    participant Customer
    participant FE as Frontend
    participant API as Backend API
    participant OrderCtrl as Order Controller
    participant ProductModel
    participant OrderModel
    participant PaymentModel
    participant DB as MongoDB
    participant SePay

    Customer->>FE: Add products to cart
    Customer->>FE: Click checkout
    FE->>API: POST /api/orders/checkout
    API->>OrderCtrl: Process checkout
        OrderCtrl->>ProductModel: Validate products and Check stock
    ProductModel->>DB: Query products
    
    alt Stock insufficient
        DB-->>ProductModel: Stock < quantity
        ProductModel-->>OrderCtrl: Error Insufficient stock
        OrderCtrl-->>API: 400 Bad Request
        API-->>FE: Show error
        FE-->>Customer: Error message
    else Stock sufficient
        DB-->>ProductModel: Stock OK
        ProductModel-->>OrderCtrl: Products validated
        OrderCtrl->>OrderModel: Calculate totals
        OrderModel->>OrderModel: Create order
        OrderModel->>DB: Save order pending
        DB-->>OrderModel: Order created
        
        OrderCtrl->>PaymentModel: Create payment
        PaymentModel->>SePay: Create payment request
        SePay-->>PaymentModel: Payment URL + QR code
        PaymentModel->>DB: Save payment pending
        DB-->>PaymentModel: Payment created
        PaymentModel-->>OrderCtrl: Payment info
        OrderCtrl-->>API: Order and Payment created
        API-->>FE: 201 Created order paymentUrl qrCode
        FE-->>Customer: Show QR code
        
        Customer->>SePay: Complete payment
        SePay->>API: Webhook: Payment confirmed
        API->>PaymentModel: Update payment status
        PaymentModel->>DB: Update payment completed
        API->>OrderModel: Update order status
        OrderModel->>DB: Update order paid
        API->>ProductModel: Reduce stock
        ProductModel->>DB: Update product stock
        API-->>FE: Payment confirmed
        FE-->>Customer: Show success page
    end
```

## 3. Seller Adds Product Sequence

```mermaid
sequenceDiagram
    participant Seller
    participant FE as Frontend
    participant API as Backend API
    participant ProductCtrl as Product Controller
    participant ProductModel
    participant UserModel
    participant DB as MongoDB
    participant Admin

    Seller->>FE: Navigate to Add Product
    FE->>API: GET /api/auth/me
    API->>UserModel: Verify JWT token
    UserModel->>DB: Get user info
    DB-->>UserModel: User data
    UserModel-->>API: User info
    API-->>FE: User data
    
    alt User is not approved seller
        FE-->>Seller: Show error Not approved
    else User is approved seller
        Seller->>FE: Fill product form
        Seller->>FE: Upload images
        Seller->>FE: Submit product
        FE->>API: POST /api/products
        API->>ProductCtrl: Validate product data
        ProductCtrl->>UserModel: Verify seller status
        UserModel->>DB: Check seller approval
        DB-->>UserModel: Seller approved
        UserModel-->>ProductCtrl: Seller verified
        ProductCtrl->>ProductModel: Create product
        ProductModel->>DB: Save product pending
        DB-->>ProductModel: Product created
        ProductModel-->>ProductCtrl: Product saved
        ProductCtrl-->>API: Product created
        API-->>FE: 201 Created
        FE-->>Seller: Show success pending approval
        
        Admin->>API: GET /api/admin/products?status=pending
        API->>ProductModel: Get pending products
        ProductModel->>DB: Query products
        DB-->>ProductModel: Pending products
        ProductModel-->>API: Products list
        API-->>Admin: Pending products
        
        Admin->>API: PUT /api/admin/products/:id/approve
        API->>ProductModel: Update product status
        ProductModel->>DB: Update product approved
        DB-->>ProductModel: Product updated
        ProductModel-->>API: Product approved
        API-->>Admin: Success
        API->>Seller: Notification: Product approved
    end
```

## 4. Order Fulfillment Sequence

```mermaid
sequenceDiagram
    participant Seller
    participant FE as Frontend
    participant API as Backend API
    participant OrderCtrl as Order Controller
    participant OrderModel
    participant ProductModel
    participant DB as MongoDB
    participant Customer

    Customer->>API: Complete payment
    API->>OrderModel: Update order paid
    OrderModel->>DB: Update order
    API->>Seller: Notification: New order

    Seller->>FE: View orders
    FE->>API: GET /api/orders/seller/my-orders
    API->>OrderCtrl: Get seller orders
    OrderCtrl->>OrderModel: Query orders by seller
    OrderModel->>DB: Get orders
    DB-->>OrderModel: Orders list
    OrderModel-->>OrderCtrl: Orders
    OrderCtrl-->>API: Orders
    API-->>FE: Orders list
    FE-->>Seller: Display orders

    Seller->>FE: View order details
    FE->>API: GET /api/orders/id
    API->>OrderModel: Get order
    OrderModel->>DB: Query order
    DB-->>OrderModel: Order details
    OrderModel-->>API: Order
    API-->>FE: Order details
    FE-->>Seller: Show order

    Seller->>FE: Update status: Processing
    FE->>API: PUT /api/orders/id/status
    API->>OrderModel: Update order status
    OrderModel->>DB: Update order
    DB-->>OrderModel: Order updated
    OrderModel-->>API: Success
    API->>Customer: Notification: Order processing
    API-->>FE: Status updated
    FE-->>Seller: Show updated status

    Seller->>FE: Add tracking number
    FE->>API: POST /api/orders/id/tracking
    API->>OrderModel: Add tracking
    OrderModel->>DB: Update order
    OrderModel->>OrderModel: Update status: Shipped
    OrderModel->>DB: Update order
    DB-->>OrderModel: Order updated
    OrderModel-->>API: Success
    API->>Customer: Notification: Order shipped
    API-->>FE: Tracking added
    FE-->>Seller: Show tracking info

    Customer->>FE: Receive package
    Customer->>FE: Confirm delivery
    FE->>API: PUT /api/orders/id/status delivered
    API->>OrderModel: Update order status
    OrderModel->>DB: Update order
    DB-->>OrderModel: Order updated
    OrderModel-->>API: Success
    API->>Seller: Notification: Order delivered
    API->>OrderModel: Calculate commission
    OrderModel->>PaymentModel: Create seller payment
    PaymentModel->>DB: Create payment
    API-->>FE: Order delivered
    FE-->>Customer: Show delivery confirmation
```

## 5. Withdrawal Request Sequence

```mermaid
sequenceDiagram
    participant Seller
    participant FE as Frontend
    participant API as Backend API
    participant PaymentCtrl as Payment Controller
    participant PaymentModel
    participant UserModel
    participant DB as MongoDB
    participant Admin

    Seller->>FE: Access withdrawal page
    FE->>API: GET /api/payments/balance
    API->>UserModel: Get seller wallet
    UserModel->>DB: Get user wallet
    DB-->>UserModel: Wallet balance
    UserModel-->>API: Balance
    API-->>FE: Balance info
    FE-->>Seller: Show balance

    Seller->>FE: Enter withdrawal amount
    Seller->>FE: Select bank account
    Seller->>FE: Submit withdrawal
    FE->>API: POST /api/payments/withdrawal
    API->>PaymentCtrl: Validate withdrawal
    PaymentCtrl->>UserModel: Check balance
    UserModel->>DB: Get wallet
    DB-->>UserModel: Current balance
    
    alt Insufficient balance
        UserModel-->>PaymentCtrl: Error Insufficient
        PaymentCtrl-->>API: 400 Bad Request
        API-->>FE: Error message
        FE-->>Seller: Show error
    else Sufficient balance
        UserModel-->>PaymentCtrl: Balance OK
        PaymentCtrl->>PaymentModel: Create withdrawal
        PaymentModel->>DB: Save payment pending
        DB-->>PaymentModel: Payment created
        PaymentModel-->>API: Withdrawal created
        API->>Admin: Notification: New withdrawal request
        API-->>FE: 201 Created
        FE-->>Seller: Show success pending approval
        
        Admin->>FE: View pending withdrawals
        FE->>API: GET /api/admin/payments/withdrawals?status=pending
        API->>PaymentModel: Get pending withdrawals
        PaymentModel->>DB: Query payments
        DB-->>PaymentModel: Pending payments
        PaymentModel-->>API: Payments list
        API-->>FE: Pending withdrawals
        FE-->>Admin: Display withdrawals
        
        Admin->>FE: Approve withdrawal
        FE->>API: POST /api/admin/approve-withdrawal/id
        API->>PaymentModel: Update payment status
        PaymentModel->>UserModel: Deduct from wallet
        UserModel->>DB: Update wallet balance
        PaymentModel->>DB: Update payment completed
        DB-->>PaymentModel: Payment updated
        PaymentModel-->>API: Withdrawal approved
        API->>Seller: Notification: Withdrawal approved
        API-->>FE: Success
        FE-->>Admin: Show success
    end
```

