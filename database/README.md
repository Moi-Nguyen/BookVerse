# Bookverse Database ERD

Sơ đồ ERD (Entity Relationship Diagram) cho hệ thống Bookverse - nền tảng thương mại điện tử sách.

## Cách sử dụng

### Với dbdiagram.io

1. Truy cập https://dbdiagram.io/
2. Tạo tài khoản hoặc đăng nhập (miễn phí)
3. Click "New Project" hoặc "Create New Diagram"
4. Copy toàn bộ nội dung file `erd.dbml`
5. Paste vào editor của dbdiagram.io
6. Sơ đồ sẽ tự động được render

### Cấu trúc Database

Hệ thống bao gồm 7 bảng chính:

#### 1. **users** - Người dùng
- Quản lý người dùng, người bán (seller), và quản trị viên (admin)
- Bao gồm thông tin profile, seller profile, và wallet
- Hỗ trợ xác thực email và reset password với OTP

#### 2. **categories** - Danh mục sản phẩm
- Cấu trúc phân cấp (hierarchical) cho danh mục
- Hỗ trợ nhiều cấp danh mục con
- SEO fields và analytics

#### 3. **products** - Sản phẩm/Sách
- Thông tin chi tiết về sách (tác giả, ISBN, nhà xuất bản, v.v.)
- Liên kết với seller và category
- Trạng thái phê duyệt (pending, approved, rejected)
- Rating và analytics

#### 4. **orders** - Đơn hàng
- Quản lý đơn hàng với nhiều sản phẩm từ nhiều seller
- Thông tin giao hàng và thanh toán
- Theo dõi trạng thái đơn hàng (status history)
- Hỗ trợ hủy đơn và trả hàng

#### 5. **reviews** - Đánh giá sản phẩm
- Đánh giá từ khách hàng đã mua hàng
- Rating chi tiết (quality, value, shipping, communication)
- Phản hồi từ seller
- Moderation và verification

#### 6. **payments** - Thanh toán
- Ghi nhận các giao dịch: deposit, withdrawal, commission, refund
- Liên kết với order và seller
- Quản lý hoa hồng (commission) 2%

#### 7. **transactions** - Lịch sử giao dịch ví
- Theo dõi tất cả giao dịch ví của người dùng
- Tính toán balance tự động
- Liên kết với payments và orders

## Mối quan hệ (Relationships)

- **users** ↔ **products**: Một seller có nhiều products
- **categories** ↔ **products**: Một category có nhiều products
- **users** ↔ **orders**: Một customer có nhiều orders
- **products** ↔ **reviews**: Một product có nhiều reviews
- **orders** ↔ **reviews**: Một order có thể có review
- **users** ↔ **payments**: Một user có nhiều payments
- **orders** ↔ **payments**: Một order có thể có payment
- **users** ↔ **transactions**: Một user có nhiều transactions
- **categories** ↔ **categories**: Self-referencing (parent-child)

## Lưu ý

- Database sử dụng MongoDB (NoSQL)
- Các trường `json` trong ERD đại diện cho embedded documents hoặc arrays trong MongoDB
- Timestamps (`createdAt`, `updatedAt`) được tự động quản lý bởi Mongoose
- ObjectId là kiểu dữ liệu chính cho primary keys và foreign keys trong MongoDB

## Export Options

Từ dbdiagram.io, bạn có thể:
- Export thành PDF
- Export thành PNG/SVG
- Export SQL schema (nếu cần migrate sang SQL database)
- Share link công khai hoặc private

## Cập nhật ERD

Khi có thay đổi trong models, cập nhật file `erd.dbml` và sync lại với dbdiagram.io.

