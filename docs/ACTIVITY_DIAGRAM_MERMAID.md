# Activity Diagrams - Bookverse Platform (Mermaid Format)

## 1. User Registration and Login Flow

```mermaid
flowchart TD
    Start([User accesses registration page]) --> FillForm[Fill registration form]
    FillForm --> SubmitForm[Submit form]
    SubmitForm --> CheckValid{Form valid?}
    
    CheckValid -->|No| ShowErrors[Show validation errors]
    ShowErrors --> End1([End])
    
    CheckValid -->|Yes| CheckEmail{Email exists?}
    CheckEmail -->|Yes| ShowEmailError[Show error: Email already exists]
    ShowEmailError --> End2([End])
    
    CheckEmail -->|No| HashPassword[Hash password]
    HashPassword --> CreateAccount[Create user account]
    CreateAccount --> SendEmail[Send verification email]
    SendEmail --> ShowSuccess[Show success message]
    ShowSuccess --> RedirectLogin[Redirect to login page]
    
    RedirectLogin --> LoginPage[User accesses login page]
    LoginPage --> EnterCreds[Enter email and password]
    EnterCreds --> SubmitLogin[Submit login form]
    SubmitLogin --> CheckCreds{Credentials valid?}
    
    CheckCreds -->|No| ShowLoginError[Show error: Invalid credentials]
    ShowLoginError --> End3([End])
    
    CheckCreds -->|Yes| GenerateToken[Generate JWT token]
    GenerateToken --> UpdateLogin[Update last login]
    UpdateLogin --> SetSession[Set session]
    SetSession --> RedirectDash[Redirect to dashboard]
    RedirectDash --> End4([End])
```

## 2. Purchase Flow

```mermaid
flowchart TD
    Start([Customer browses products]) --> AddCart[Add product to cart]
    AddCart --> ViewCart[View cart]
    ViewCart --> Checkout[Proceed to checkout]
    Checkout --> CheckLogin{User logged in?}
    
    CheckLogin -->|No| RedirectLogin[Redirect to login]
    RedirectLogin --> End1([End])
    
    CheckLogin -->|Yes| EnterAddress[Enter shipping address]
    EnterAddress --> SelectPayment[Select payment method]
    SelectPayment --> ReviewOrder[Review order]
    ReviewOrder --> ConfirmOrder[Confirm order]
    ConfirmOrder --> CheckPaymentType{Payment method is SePay?}
    
    CheckPaymentType -->|Yes| CreateSePay[Create SePay payment]
    CreateSePay --> GenerateQR[Generate QR code]
    GenerateQR --> DisplayQR[Display QR code]
    DisplayQR --> WaitPayment[Wait for payment]
    WaitPayment --> CheckPayment{Payment confirmed?}
    
    CheckPayment -->|No| ShowFailed[Show payment failed]
    ShowFailed --> End2([End])
    
    CheckPayment -->|Yes| UpdatePaid[Update order status to paid]
    UpdatePaid --> NotifySeller[Notify seller]
    NotifySeller --> ReduceStock[Reduce product stock]
    ReduceStock --> CreateTransaction[Create transaction record]
    CreateTransaction --> ShowSuccess[Show success page]
    ShowSuccess --> End3([End])
    
    CheckPaymentType -->|No - Bank transfer| CreatePending[Create order with pending payment]
    CreatePending --> ShowConfirmation[Show order confirmation]
    ShowConfirmation --> WaitApproval[Wait for admin approval]
    WaitApproval --> CheckApproval{Payment approved?}
    
    CheckApproval -->|No| CancelOrder[Cancel order]
    CancelOrder --> End4([End])
    
    CheckApproval -->|Yes| UpdateStatus[Update order status]
    UpdateStatus --> NotifySeller2[Notify seller]
    NotifySeller2 --> ReduceStock2[Reduce product stock]
    ReduceStock2 --> End5([End])
```

## 3. Seller Product Management

```mermaid
flowchart TD
    Start([Seller accesses dashboard]) --> CheckApproved{User is approved seller?}
    
    CheckApproved -->|No| ShowNotApproved[Show message: Not approved]
    ShowNotApproved --> End1([End])
    
    CheckApproved -->|Yes| NavigateProducts[Navigate to products]
    
    NavigateProducts --> AddProduct[Click Add Product]
    NavigateProducts --> EditProduct[Select product to edit]
    NavigateProducts --> DeleteProduct[Select product to delete]
    
    AddProduct --> FillForm[Fill product form]
    FillForm --> UploadImages[Upload images]
    UploadImages --> SetPrice[Set price and stock]
    SetPrice --> SubmitProduct[Submit product]
    SubmitProduct --> StatusPending[Product status: Pending]
    StatusPending --> WaitAdmin[Wait for admin approval]
    WaitAdmin --> CheckAdminApproval{Admin approves?}
    
    CheckAdminApproval -->|Yes| StatusApproved[Product status: Approved]
    StatusApproved --> Visible[Product visible to customers]
    Visible --> End2([End])
    
    CheckAdminApproval -->|No| StatusRejected[Product status: Rejected]
    StatusRejected --> ShowReason[Show rejection reason]
    ShowReason --> End3([End])
    
    EditProduct --> EditDetails[Edit product details]
    EditDetails --> SaveChanges[Save changes]
    SaveChanges --> CheckMajorChanges{Major changes?}
    
    CheckMajorChanges -->|Yes| StatusPending2[Status: Pending approval]
    StatusPending2 --> End4([End])
    
    CheckMajorChanges -->|No| StatusApproved2[Status: Approved unchanged]
    StatusApproved2 --> End5([End])
    
    DeleteProduct --> ConfirmDelete[Confirm deletion]
    ConfirmDelete --> RemoveProduct[Remove product]
    RemoveProduct --> End6([End])
```

## 4. Order Fulfillment

```mermaid
flowchart TD
    Start([Seller receives order notification]) --> ViewOrder[View order details]
    ViewOrder --> CheckAvailability{Product available?}
    
    CheckAvailability -->|No| CancelOrder[Cancel order]
    CancelOrder --> Refund[Refund customer]
    Refund --> End1([End])
    
    CheckAvailability -->|Yes| PrepareOrder[Prepare order]
    PrepareOrder --> UpdateProcessing[Update order status: Processing]
    UpdateProcessing --> Package[Package product]
    Package --> UpdateShipped[Update order status: Shipped]
    UpdateShipped --> AddTracking[Add tracking number]
    AddTracking --> NotifyCustomer[Notify customer]
    NotifyCustomer --> ReceivePackage[Customer receives package]
    ReceivePackage --> UpdateDelivered[Update order status: Delivered]
    UpdateDelivered --> CheckSatisfied{Customer satisfied?}
    
    CheckSatisfied -->|Yes| LeaveReview[Customer can leave review]
    LeaveReview --> CalculateCommission[Calculate seller commission]
    CalculateCommission --> TransferPayment[Transfer payment to seller]
    TransferPayment --> UpdateWallet[Update seller wallet]
    UpdateWallet --> End2([End])
    
    CheckSatisfied -->|No| RequestReturn[Customer requests return]
    RequestReturn --> ProcessReturn[Process return]
    ProcessReturn --> Refund2[Refund customer]
    Refund2 --> End3([End])
```

## 5. Withdrawal Process

```mermaid
flowchart TD
    Start([Seller accesses withdrawal page]) --> CheckBalance[Check wallet balance]
    CheckBalance --> CheckSufficient{Balance sufficient?}
    
    CheckSufficient -->|No| ShowError[Show error: Insufficient balance]
    ShowError --> End1([End])
    
    CheckSufficient -->|Yes| EnterAmount[Enter withdrawal amount]
    EnterAmount --> SelectBank[Select bank account]
    SelectBank --> SubmitRequest[Submit withdrawal request]
    SubmitRequest --> CreatePayment[Create payment record pending]
    CreatePayment --> NotifyAdmin[Notify admin]
    NotifyAdmin --> AdminReview[Admin reviews request]
    AdminReview --> CheckApproval{Admin approves?}
    
    CheckApproval -->|No| UpdateRejected[Update payment status: Rejected]
    UpdateRejected --> AddNotes[Add rejection notes]
    AddNotes --> NotifySeller[Notify seller]
    NotifySeller --> End2([End])
    
    CheckApproval -->|Yes| UpdateCompleted[Update payment status: Completed]
    UpdateCompleted --> DeductWallet[Deduct from seller wallet]
    DeductWallet --> TransferBank[Transfer to bank account]
    TransferBank --> CreateTransaction[Create transaction record]
    CreateTransaction --> NotifySeller2[Notify seller]
    NotifySeller2 --> End3([End])
```

