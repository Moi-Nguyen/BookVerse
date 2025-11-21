# Use Case Diagram - Bookverse Platform (Mermaid Format)

## Sơ đồ Use Case Diagram

```mermaid
graph TB
    subgraph "Bookverse Platform"
        subgraph "Chức năng công khai"
            UC1[Xem danh sách sản phẩm]
            UC2[Tìm kiếm sản phẩm]
            UC3[Xem chi tiết sản phẩm]
            UC4[Xem danh sách người bán]
            UC5[Xem cửa hàng người bán]
            UC6[Xem forum]
            UC7[Đăng ký tài khoản]
            UC8[Đăng nhập]
            UC9[Quên mật khẩu]
            UC10[Đặt lại mật khẩu]
        end
        
        subgraph "Chức năng khách hàng"
            UC11[Thêm vào giỏ hàng]
            UC12[Xem giỏ hàng]
            UC13[Cập nhật giỏ hàng]
            UC14[Thanh toán đơn hàng]
            UC15[Xem lịch sử đơn hàng]
            UC16[Theo dõi đơn hàng]
            UC17[Quản lý tài khoản]
            UC18[Quản lý wishlist]
            UC19[Thêm/xóa wishlist]
            UC20[Gửi tin nhắn]
            UC21[Nhận tin nhắn]
            UC22[Đánh giá sản phẩm]
            UC23[Đăng bài forum]
            UC24[Comment bài viết]
            UC25[Like bài viết]
            UC26[Nạp tiền vào ví]
            UC27[Xem số dư ví]
            UC28[Đăng ký làm người bán]
        end
        
        subgraph "Chức năng người bán"
            UC29[Quản lý sản phẩm]
            UC30[Thêm sản phẩm]
            UC31[Sửa sản phẩm]
            UC32[Xóa sản phẩm]
            UC33[Quản lý đơn hàng cửa hàng]
            UC34[Cập nhật trạng thái đơn hàng]
            UC35[Thêm mã vận đơn]
            UC36[Xem thống kê bán hàng]
            UC37[Xem doanh thu]
            UC38[Quản lý thông tin cửa hàng]
            UC39[Rút tiền]
            UC40[Quản lý tài khoản ngân hàng]
            UC41[Xem lịch sử thanh toán]
            UC42[Nhắn tin với khách hàng]
        end
        
        subgraph "Chức năng quản trị"
            UC43[Quản lý người dùng]
            UC44[Xem danh sách người dùng]
            UC45[Thêm/sửa/xóa người dùng]
            UC46[Khóa/mở khóa tài khoản]
            UC47[Duyệt đăng ký người bán]
            UC48[Quản lý sản phẩm hệ thống]
            UC49[Duyệt sản phẩm]
            UC50[Từ chối sản phẩm]
            UC51[Quản lý đơn hàng hệ thống]
            UC52[Quản lý danh mục]
            UC53[Thêm/sửa/xóa danh mục]
            UC54[Quản lý thanh toán]
            UC55[Duyệt rút tiền]
            UC56[Duyệt nạp tiền]
            UC57[Xem thống kê hệ thống]
            UC58[Xem doanh thu hệ thống]
            UC59[Quản lý cài đặt hệ thống]
            UC60[Xem nhật ký hoạt động]
        end
    end
    
    Guest[Khách vãng lai] --> UC1
    Guest --> UC2
    Guest --> UC3
    Guest --> UC4
    Guest --> UC5
    Guest --> UC6
    Guest --> UC7
    Guest --> UC8
    Guest --> UC9
    Guest --> UC10
    
    Customer[Khách hàng] --> UC1
    Customer --> UC2
    Customer --> UC3
    Customer --> UC4
    Customer --> UC5
    Customer --> UC6
    Customer --> UC11
    Customer --> UC12
    Customer --> UC13
    Customer --> UC14
    Customer --> UC15
    Customer --> UC16
    Customer --> UC17
    Customer --> UC18
    Customer --> UC19
    Customer --> UC20
    Customer --> UC21
    Customer --> UC22
    Customer --> UC23
    Customer --> UC24
    Customer --> UC25
    Customer --> UC26
    Customer --> UC27
    Customer --> UC28
    
    Seller[Người bán] --> UC11
    Seller --> UC12
    Seller --> UC13
    Seller --> UC14
    Seller --> UC15
    Seller --> UC16
    Seller --> UC17
    Seller --> UC18
    Seller --> UC19
    Seller --> UC20
    Seller --> UC21
    Seller --> UC22
    Seller --> UC23
    Seller --> UC24
    Seller --> UC25
    Seller --> UC26
    Seller --> UC27
    Seller --> UC29
    Seller --> UC30
    Seller --> UC31
    Seller --> UC32
    Seller --> UC33
    Seller --> UC34
    Seller --> UC35
    Seller --> UC36
    Seller --> UC37
    Seller --> UC38
    Seller --> UC39
    Seller --> UC40
    Seller --> UC41
    Seller --> UC42
    
    Admin[Quản trị viên] --> UC43
    Admin --> UC44
    Admin --> UC45
    Admin --> UC46
    Admin --> UC47
    Admin --> UC48
    Admin --> UC49
    Admin --> UC50
    Admin --> UC51
    Admin --> UC52
    Admin --> UC53
    Admin --> UC54
    Admin --> UC55
    Admin --> UC56
    Admin --> UC57
    Admin --> UC58
    Admin --> UC59
    Admin --> UC60
    
    Customer -.->|extends| Guest
    Seller -.->|extends| Customer
```

## Mô tả các Actor

### 1. Khách vãng lai (Guest)
- Người dùng chưa đăng nhập
- Chỉ có thể xem thông tin công khai và đăng ký/đăng nhập

### 2. Khách hàng (Customer)
- Người dùng đã đăng ký và đăng nhập
- Có thể mua sắm, quản lý đơn hàng, tương tác với hệ thống

### 3. Người bán (Seller)
- Khách hàng đã đăng ký làm người bán và được duyệt
- Có thể quản lý sản phẩm, đơn hàng, doanh thu

### 4. Quản trị viên (Admin)
- Quản lý toàn bộ hệ thống
- Duyệt sản phẩm, người bán, thanh toán

## Mô tả các Use Case chính

### Chức năng công khai (UC1-UC10)
- **UC1-UC6**: Xem thông tin sản phẩm, người bán, forum
- **UC7-UC10**: Đăng ký, đăng nhập, khôi phục mật khẩu

### Chức năng khách hàng (UC11-UC28)
- **UC11-UC16**: Quản lý giỏ hàng và đơn hàng
- **UC17-UC19**: Quản lý tài khoản và wishlist
- **UC20-UC22**: Tương tác (tin nhắn, đánh giá)
- **UC23-UC25**: Tham gia forum
- **UC26-UC28**: Quản lý ví và đăng ký người bán

### Chức năng người bán (UC29-UC42)
- **UC29-UC32**: Quản lý sản phẩm
- **UC33-UC35**: Quản lý đơn hàng
- **UC36-UC37**: Thống kê và doanh thu
- **UC38-UC42**: Quản lý cửa hàng và thanh toán

### Chức năng quản trị (UC43-UC60)
- **UC43-UC47**: Quản lý người dùng và người bán
- **UC48-UC50**: Quản lý sản phẩm hệ thống
- **UC51-UC53**: Quản lý đơn hàng và danh mục
- **UC54-UC60**: Quản lý thanh toán, thống kê, cài đặt

## Mối quan hệ kế thừa
- **Customer extends Guest**: Khách hàng có tất cả quyền của khách vãng lai
- **Seller extends Customer**: Người bán có tất cả quyền của khách hàng

