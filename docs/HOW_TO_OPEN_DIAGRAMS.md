# Hướng dẫn mở các sơ đồ trên diagrams.net (draw.io)

## ⚠️ LƯU Ý QUAN TRỌNG

**diagrams.net KHÔNG hỗ trợ import trực tiếp file PlantUML (.puml)**. File PlantUML sẽ báo lỗi "Start tag expected" vì diagrams.net đang cố parse như XML.

## 📌 Phương pháp 1: Sử dụng Mermaid Diagrams (KHUYẾN NGHỊ cho diagrams.net)

### Các file Mermaid đã có sẵn:
- ✅ `USE_CASE_DIAGRAM_MERMAID.md` - Use Case Diagram
- ✅ `ACTIVITY_DIAGRAM_MERMAID.md` - Activity Diagrams
- ✅ `SEQUENCE_DIAGRAM_MERMAID.md` - Sequence Diagrams

### Cách sử dụng:
1. Mở file `.md` chứa Mermaid code
2. Copy code Mermaid (nằm trong ```mermaid ... ```)
3. Truy cập: https://mermaid.live/
4. Paste code vào editor
5. Export sang PNG/SVG
6. Import vào diagrams.net nếu cần chỉnh sửa

## 📌 Phương pháp 2: Sử dụng PlantUML Online (Cho Class Diagram)

### Bước 1: Truy cập PlantUML Online
- Mở trình duyệt và vào: http://www.plantuml.com/plantuml/uml/

### Bước 2: Copy nội dung file .puml
- Mở file `.puml` trong thư mục `docs/`
- Copy toàn bộ nội dung

### Bước 3: Paste vào PlantUML Editor
- Paste nội dung vào editor
- Diagram sẽ tự động render

### Bước 4: Export sang định dạng khác
- Click nút **PNG** hoặc **SVG** để tải về
- Hoặc click **AsciiMath** → **SVG** để lấy link SVG

### Bước 5: Import vào diagrams.net (nếu cần chỉnh sửa)
1. Mở diagrams.net: https://app.diagrams.net/
2. Click **File** → **Import from** → **Device**
3. Chọn file PNG/SVG đã tải về
4. Chỉnh sửa và lưu lại

## 📌 Phương pháp 3: Sử dụng VS Code với PlantUML Extension

### Bước 1: Cài đặt extension
1. Mở VS Code
2. Vào Extensions (Ctrl+Shift+X)
3. Tìm "PlantUML" và cài đặt

### Bước 2: Mở file .puml
- Mở file `.puml` trong VS Code
- Nhấn `Alt+D` để preview diagram

### Bước 3: Export
- Click chuột phải vào preview
- Chọn **Export Current Diagram**
- Chọn định dạng (PNG, SVG, PDF)

## 📌 Phương pháp 4: Sử dụng PlantUML Server API

### Tạo link trực tiếp từ code PlantUML:

1. **Encode PlantUML code**:
   - Truy cập: http://www.plantuml.com/plantuml/uml/
   - Paste code và lấy encoded URL

2. **Tạo link hình ảnh**:
   ```
   http://www.plantuml.com/plantuml/png/[encoded_code]
   ```

3. **Embed vào HTML/Markdown**:
   ```html
   <img src="http://www.plantuml.com/plantuml/png/[encoded_code]" />
   ```

## 📌 Phương pháp 5: Import vào diagrams.net từ file đã export

Sau khi đã render diagram bằng PlantUML hoặc Mermaid và export sang PNG/SVG:

1. Mở diagrams.net: https://app.diagrams.net/
2. Click **File** → **Import from** → **Device**
3. Chọn file PNG/SVG đã export
4. Chỉnh sửa và lưu lại

## 📌 Phương pháp 6: Sử dụng Mermaid trong diagrams.net (nếu có plugin)

Nếu muốn hiển thị trên GitHub, có thể convert sang Mermaid format:
- Mermaid được GitHub hỗ trợ native
- Xem file `USE_CASE_DIAGRAM_MERMAID.md` để tham khảo

## 📌 Danh sách các file diagram

### 1. Use Case Diagram
- **File**: `USE_CASE_DIAGRAM.puml`
- **Mô tả**: Actors và Use Cases
- **Preview**: Copy nội dung và paste vào PlantUML online

### 2. Class Diagram
- **File**: `CLASS_DIAGRAM.puml`
- **Mô tả**: Models và relationships
- **Preview**: Copy nội dung và paste vào PlantUML online

### 3. Activity Diagram
- **File**: `ACTIVITY_DIAGRAM.puml`
- **Mô tả**: 5 luồng hoạt động chính
- **Lưu ý**: File này chứa nhiều diagram, mỗi diagram bắt đầu bằng `@startuml [name]`
- **Preview**: Copy từng diagram riêng lẻ

### 4. Sequence Diagram
- **File**: `SEQUENCE_DIAGRAM.puml`
- **Mô tả**: 5 sequence diagrams
- **Lưu ý**: File này chứa nhiều diagram, mỗi diagram bắt đầu bằng `@startuml [name]`
- **Preview**: Copy từng diagram riêng lẻ

## 🔧 Troubleshooting

### Vấn đề: diagrams.net không import được PlantUML
**Giải pháp**: 
- Sử dụng PlantUML online để render trước
- Export sang PNG/SVG
- Import file PNG/SVG vào diagrams.net

### Vấn đề: Diagram quá lớn, khó xem
**Giải pháp**:
- Zoom in/out trong PlantUML online
- Export với resolution cao hơn
- Chia nhỏ diagram thành nhiều file

### Vấn đề: Một số ký tự không hiển thị đúng
**Giải pháp**:
- Kiểm tra encoding của file (phải là UTF-8)
- Sử dụng PlantUML online để test trước

## 📚 Tài liệu tham khảo

- [PlantUML Documentation](https://plantuml.com/)
- [PlantUML Online Editor](http://www.plantuml.com/plantuml/uml/)
- [diagrams.net Documentation](https://www.diagrams.net/doc/)
- [PlantUML VS Code Extension](https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml)

