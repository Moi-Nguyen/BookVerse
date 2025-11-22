<div align="center">

# Sàn Thương Mại Mua Bán Sách - Bookverse

**Nền tảng thương mại điện tử hiện đại cho sách - Nơi sách gặp gỡ công nghệ**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4%2B-green.svg)](https://www.mongodb.com/)
[![PHP](https://img.shields.io/badge/PHP-7.4%2B-blue.svg)](https://www.php.net/)
[![Express.js](https://img.shields.io/badge/Express-4.18-black.svg)](https://expressjs.com/)

[Features](#-tính-năng) • [Installation](#-cài-đặt) • [Documentation](#-tài-liệu) • [Contributing](#-đóng-góp) • [License](#-giấy-phép)

</div>

---

## 📖 Giới thiệu

**Bookverse** là một nền tảng marketplace toàn diện được thiết kế đặc biệt cho việc mua bán sách trực tuyến. Dự án kết hợp sức mạnh của **Node.js/Express** backend với **PHP** frontend, tạo ra một giải pháp thương mại điện tử hiện đại, mạnh mẽ và dễ sử dụng.

### ✨ Điểm nổi bật

- 🎯 **Marketplace đa người bán** - Cho phép nhiều người bán tạo cửa hàng riêng
- 🔐 **Bảo mật cao** - JWT authentication, bcrypt encryption, rate limiting
- 📱 **Responsive Design** - Tối ưu cho mọi thiết bị từ mobile đến desktop
- ⚡ **Hiệu suất cao** - Tối ưu database, caching, lazy loading
- 🎨 **UI/UX hiện đại** - Giao diện đẹp mắt, trải nghiệm người dùng mượt mà
- 🛠️ **Dễ mở rộng** - Kiến trúc modular, dễ dàng thêm tính năng mới

---

## 🚀 Tính năng

### 👥 Người dùng

- ✅ **Đăng ký & Đăng nhập** - Hỗ trợ email/password và Google OAuth
- ✅ **Quản lý hồ sơ** - Cập nhật thông tin cá nhân, địa chỉ giao hàng
- ✅ **Theo dõi đơn hàng** - Xem chi tiết và trạng thái đơn hàng real-time
- ✅ **Danh sách yêu thích** - Lưu sách yêu thích để mua sau
- ✅ **Ví điện tử** - Nạp tiền, thanh toán, lịch sử giao dịch
- ✅ **Đặt lại mật khẩu** - Xác thực OTP qua email
- ✅ **Tin nhắn** - Chat trực tiếp với người bán

### 🏪 Người bán

- ✅ **Đăng ký người bán** - Tạo cửa hàng với thông tin kinh doanh
- ✅ **Quản lý sản phẩm** - CRUD đầy đủ, upload nhiều hình ảnh
- ✅ **Quản lý đơn hàng** - Xử lý đơn hàng, cập nhật trạng thái
- ✅ **Dashboard phân tích** - Thống kê doanh thu, đơn hàng, sản phẩm
- ✅ **Tài khoản ngân hàng** - Thiết lập thông tin nhận thanh toán
- ✅ **Rút tiền** - Yêu cầu rút tiền từ tài khoản
- ✅ **Quản lý kho** - Theo dõi số lượng tồn kho

### 👨‍💼 Quản trị viên

- ✅ **Dashboard tổng quan** - Thống kê toàn hệ thống
- ✅ **Quản lý người dùng** - Xem, chỉnh sửa, khóa tài khoản
- ✅ **Quản lý sản phẩm** - Phê duyệt, từ chối, chỉnh sửa sản phẩm
- ✅ **Quản lý đơn hàng** - Theo dõi tất cả đơn hàng
- ✅ **Quản lý thanh toán** - Xử lý yêu cầu rút tiền, giao dịch
- ✅ **Quản lý danh mục** - CRUD danh mục sách
- ✅ **Cài đặt hệ thống** - Cấu hình website, email, thanh toán
- ✅ **Phân tích nâng cao** - Báo cáo chi tiết với biểu đồ

### 🛒 Mua sắm

- ✅ **Tìm kiếm thông minh** - Tìm kiếm theo tên, tác giả, ISBN
- ✅ **Bộ lọc nâng cao** - Lọc theo danh mục, giá, đánh giá
- ✅ **Giỏ hàng** - Thêm/xóa sản phẩm, cập nhật số lượng
- ✅ **Thanh toán** - Hỗ trợ ví điện tử và SePay
- ✅ **Đánh giá & Nhận xét** - Xem và viết đánh giá sản phẩm
- ✅ **Gợi ý sản phẩm** - Sản phẩm liên quan, sản phẩm nổi bật

---

## 🛠️ Công nghệ sử dụng

### Backend

| Công nghệ | Mô tả | Version |
|-----------|-------|---------|
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white) | Runtime environment | ≥14.0.0 |
| ![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white) | Web framework | 4.18.2 |
| ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white) | Database | ≥4.4 |
| ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat-square&logo=mongoose&logoColor=white) | ODM | 8.0.3 |
| ![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white) | Authentication | 9.0.2 |
| ![bcrypt](https://img.shields.io/badge/bcrypt-000000?style=flat-square) | Password hashing | 2.4.3 |
| ![Multer](https://img.shields.io/badge/Multer-000000?style=flat-square) | File upload | 2.0.2 |
| ![Nodemailer](https://img.shields.io/badge/Nodemailer-000000?style=flat-square) | Email service | 7.0.10 |

### Frontend

| Công nghệ | Mô tả |
|-----------|-------|
| ![PHP](https://img.shields.io/badge/PHP-777BB4?style=flat-square&logo=php&logoColor=white) | Server-side rendering | ≥7.4 |
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) | Markup language |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) | Styling |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | Client-side scripting | ES6+ |
| ![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat-square&logo=chart.js&logoColor=white) | Data visualization |

### DevOps & Tools

- 🐳 **Docker** - Containerization
- 🔄 **Docker Compose** - Multi-container orchestration
- 🌐 **Nginx** - Reverse proxy & load balancing
- 📦 **Git** - Version control
- 🔍 **ESLint** - Code linting
- 🧪 **Jest** - Testing framework

---

## 📦 Cài đặt

### Yêu cầu hệ thống

- **Node.js** ≥14.0.0
- **MongoDB** ≥4.4.0
- **PHP** ≥7.4.0
- **XAMPP** hoặc web server tương tự (cho development)
- **Git** (để clone repository)

### Cài đặt nhanh với Docker (Khuyến nghị)

```bash
# Clone repository
git clone https://github.com/moi-nguyen/BookVerse.git
cd BookVerse

# Khởi động tất cả services
docker-compose up -d

# Seed database (tùy chọn)
docker-compose --profile seed run seed

# Truy cập ứng dụng
# Frontend: http://localhost:8000
# Backend API: http://localhost:3000
# MongoDB: localhost:27017
```

### Cài đặt thủ công

#### 1. Clone repository

```bash
git clone https://github.com/moi-nguyen/BookVerse.git
cd BookVerse
```

#### 2. Thiết lập Backend

```bash
cd backend

# Cài đặt dependencies
npm install

# Tạo file .env từ template
cp env.example .env

# Chỉnh sửa .env với thông tin của bạn
nano .env
```

**Cấu hình `.env`:**

```env
# Database
MONGODB_URI=mongodb://localhost:27017/bookverse

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:8000
BACKEND_URL=http://localhost:5000

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

```bash
# Chạy server (development)
npm run dev

# Hoặc chạy production
npm start
```

#### 3. Thiết lập Frontend

```bash
# Di chuyển thư mục frontend vào web server
# Ví dụ với XAMPP:
# Copy thư mục frontend vào C:\xampp\htdocs\

# Hoặc sử dụng PHP built-in server
cd frontend
php -S localhost:8000
```

#### 4. Seed Database

```bash
cd backend
npm run seed
```

#### 5. Truy cập ứng dụng

- **Frontend**: http://localhost:8000
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:8000/pages/admin/login.php

---

## 📁 Cấu trúc dự án

```
Bookverse/
├── 📂 backend/                 # Backend API (Node.js/Express)
│   ├── 📂 config/              # Cấu hình database, environment
│   ├── 📂 middlewares/         # Authentication, validation, security
│   ├── 📂 models/              # Mongoose models
│   ├── 📂 routes/              # API routes
│   ├── 📂 services/            # Business logic services
│   ├── 📂 scripts/             # Utility scripts (seed, etc.)
│   ├── 📂 uploads/             # Uploaded files
│   ├── 📂 utils/               # Helper functions
│   ├── 📄 server.js            # Entry point
│   └── 📄 package.json         # Dependencies
│
├── 📂 frontend/                # Frontend (PHP)
│   ├── 📂 assets/              # Static assets
│   │   ├── 📂 css/             # Stylesheets (modular CSS)
│   │   ├── 📂 js/              # JavaScript files
│   │   │   ├── 📂 pages/       # Page-specific scripts
│   │   │   └── *.js            # Core scripts
│   │   └── 📂 images/          # Images, logos
│   ├── 📂 includes/            # PHP includes (header, footer, etc.)
│   ├── 📂 pages/               # Page templates
│   │   ├── 📂 admin/           # Admin pages
│   │   ├── 📂 auth/            # Authentication pages
│   │   ├── 📂 seller/          # Seller dashboard pages
│   │   ├── 📂 account/         # User account pages
│   │   ├── 📂 products/        # Product pages
│   │   └── 📂 checkout/        # Checkout pages
│   └── 📄 index.php            # Homepage
│
├── 📂 database/                # Database schemas, migrations
├── 📂 docs/                    # Documentation
├── 📂 nginx/                   # Nginx configuration
├── 📂 k8s/                     # Kubernetes manifests
├── 🐳 docker-compose.yml       # Docker Compose config
├── 🐳 Dockerfile               # Docker image definition
└── 📄 README.md                # This file
```

---

## 📚 Tài liệu

### API Documentation

Xem chi tiết tại [API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md)

#### Endpoints chính

**Authentication**
```
POST   /api/auth/register          # Đăng ký
POST   /api/auth/login             # Đăng nhập
POST   /api/auth/forgot-password   # Quên mật khẩu
POST   /api/auth/reset-password    # Đặt lại mật khẩu
POST   /api/auth/google            # Google OAuth
```

**Products**
```
GET    /api/products               # Danh sách sản phẩm
GET    /api/products/:id           # Chi tiết sản phẩm
POST   /api/products               # Tạo sản phẩm (Seller)
PUT    /api/products/:id           # Cập nhật sản phẩm
DELETE /api/products/:id           # Xóa sản phẩm
```

**Orders**
```
GET    /api/orders                 # Danh sách đơn hàng
GET    /api/orders/:id             # Chi tiết đơn hàng
POST   /api/orders                 # Tạo đơn hàng
PUT    /api/orders/:id/status      # Cập nhật trạng thái
```

**Admin**
```
GET    /api/admin/dashboard        # Dashboard data
GET    /api/admin/users            # Quản lý người dùng
GET    /api/admin/products         # Quản lý sản phẩm
GET    /api/admin/orders           # Quản lý đơn hàng
GET    /api/admin/payments         # Quản lý thanh toán
```

### Development Guides

- [Quick Start Guide](QUICK_START.md)
- [Development Guide](DEVELOPMENT_GUIDE.md)
- [Progress Report](PROGRESS_REPORT.md)

---

## 🎨 Hệ thống thiết kế

### Color Palette

```css
--primary: #3B82F6      /* Blue - Primary actions */
--success: #10B981      /* Green - Success states */
--warning: #F59E0B      /* Orange - Warnings */
--danger: #EF4444       /* Red - Errors, delete */
--gray-50: #F9FAFB      /* Background */
--gray-900: #111827     /* Text */
```

### Typography

- **Font Family**: Inter, system-ui, -apple-system, sans-serif
- **Headings**: 700 weight
- **Body**: 400 weight
- **Code**: 'Fira Code', 'Monaco', monospace

### Components

- ✅ Modular CSS architecture
- ✅ Reusable component classes
- ✅ Responsive grid system
- ✅ Consistent spacing scale
- ✅ Accessible form elements

---

## 🔐 Bảo mật

- 🔒 **JWT Authentication** - Secure token-based auth
- 🔐 **Password Hashing** - bcrypt với salt rounds
- 🛡️ **Helmet.js** - Security headers
- 🚦 **Rate Limiting** - Prevent abuse
- ✅ **Input Validation** - express-validator
- 🔒 **CORS Configuration** - Controlled cross-origin requests
- 🛡️ **XSS Protection** - Input sanitization
- 🔐 **SQL Injection Prevention** - Parameterized queries

---

## 🧪 Testing

```bash
# Chạy tests
cd backend
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

---

## 🚀 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure MongoDB Atlas
- [ ] Set up SSL certificates
- [ ] Configure environment variables
- [ ] Enable rate limiting
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Set up CDN for assets

### Docker Deployment

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f
```

### Manual Deployment

Xem hướng dẫn chi tiết trong [DEPLOYMENT.md](docs/DEPLOYMENT.md)

---

## 🤝 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng làm theo các bước sau:

1. **Fork** repository
2. **Tạo branch** mới (`git checkout -b feature/amazing-feature`)
3. **Commit** thay đổi (`git commit -m 'Add amazing feature'`)
4. **Push** lên branch (`git push origin feature/amazing-feature`)
5. **Mở Pull Request**

### Code Style

- Tuân theo ESLint configuration
- Viết commit message có ý nghĩa
- Thêm comments cho logic phức tạp
- Viết tests cho tính năng mới
- Cập nhật documentation

### Reporting Issues

Khi báo lỗi, vui lòng bao gồm:
- Mô tả vấn đề
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (nếu có)
- Environment info

---

## 📄 Giấy phép

Dự án này được cấp phép dưới **MIT License** - xem file [LICENSE](LICENSE) để biết chi tiết.

---

## 👥 Đội ngũ phát triển

<table>
<tr>
<td align="center">
<a href="https://github.com/phucdevz">
<img src="https://sf-static.upanhlaylink.com/img/image_202511089b5b2e799534e4f134f145b24f3a5c9c.jpg" width="100px;" alt=""/>
<br />
<sub><b>Nguyễn Trường Phục</b></sub>
</a>
<br />
Trưởng Dự Án & Full-Stack Developer
</td>
<td align="center">
<a href="https://github.com/moi-nguyen">
<img src="https://sf-static.upanhlaylink.com/img/image_20251108375114e21252134cc88d460fae885669.jpg" width="100px;" alt=""/>
<br />
<sub><b>Nguyễn Đức Lượng</b></sub>
</a>
<br />
Backend Developer & API Specialist
</td>
<td align="center">
<a href="https://github.com/DuwcsAnh1710">
<img src="https://sf-static.upanhlaylink.com/img/image_202511084dc4b589b7aa2cece2daf1d9368d487c.jpg" width="100px;" alt=""/>
<br />
<sub><b>Lê Đức Anh</b></sub>
</a>
<br />
Frontend Developer & UI/UX Designer
</td>
<td align="center">
<a href="https://github.com/MinHuy_nnn">
<img src="https://sf-static.upanhlaylink.com/img/image_202511082f3364753177a94e5833f8abf85a30d8.jpg" width="100px;" alt=""/>
<br />
<sub><b>Nguyễn Minh Huy</b></sub>
</a>
<br />
Database Architect & DevOps Engineer
</td>
<td align="center">
<a href="https://github.com/PhuocNguyencoder">
<img src="https://sf-static.upanhlaylink.com/img/image_2025110833276bdc67229523a24c42edd7575ab1.jpg" width="100px;" alt=""/>
<br />
<sub><b>Nguyễn Phạm Thiên Phước</b></sub>
</a>
<br />
QA Specialist & Tester
</td>
</tr>
</table>

---

## 📞 Liên hệ & Hỗ trợ

- 📧 **Email**: support@bookverse.com
- 🌐 **Website**: https://bookversevn.store
- 💬 **Discord**: [Join our community](https://discord.gg/bookverse)
- 📱 **GitHub Issues**: [Report a bug](https://github.com/yourusername/bookverse/issues)

---

## 🗺️ Lộ trình phát triển

### ✅ Giai đoạn 1 - MVP (Hoàn thành)

- [x] Authentication & Authorization
- [x] User Management
- [x] Product Management
- [x] Order Management
- [x] Seller Dashboard
- [x] Admin Panel
- [x] Payment Integration
- [x] Search & Filter

### 🔄 Giai đoạn 2 - Nâng cao (Đang phát triển)

- [ ] Advanced Analytics
- [ ] Mobile App (React Native)
- [ ] Real-time Notifications
- [ ] AI-powered Search
- [ ] Multi-language Support
- [ ] Advanced Reporting
- [ ] Email Marketing

### 🔮 Giai đoạn 3 - Tương lai

- [ ] Blockchain Integration
- [ ] AR/VR Book Preview
- [ ] Social Features
- [ ] Subscription Model
- [ ] Marketplace API
- [ ] White-label Solution

---

## ⭐ Star History

Nếu dự án này hữu ích, hãy cho chúng tôi một ⭐ trên GitHub!

---

<div align="center">

**Made with ❤️ by Bookverse Team**

*Nơi sách gặp gỡ công nghệ*

[⬆ Back to Top](#-bookverse)

</div>
