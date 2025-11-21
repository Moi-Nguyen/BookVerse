# Bookverse - System Diagrams

Tài liệu này chứa các sơ đồ UML cho hệ thống Bookverse, có thể mở trên **diagrams.net (draw.io)**.

## 📋 Danh sách các sơ đồ

### 1. Use Case Diagram
- **File**: `USE_CASE_DIAGRAM.puml`
- **Mô tả**: Mô tả các actors và use cases của hệ thống
- **Cách mở**: 
  - Import vào diagrams.net: File → Import from → PlantUML
  - Hoặc xem file `USE_CASE_DIAGRAM_MERMAID.md` trên GitHub

### 2. Class Diagram
- **File PlantUML**: `CLASS_DIAGRAM.puml`
- **File Mermaid**: `CLASS_DIAGRAM_MERMAID.md` ⭐ (Khuyến nghị)
- **Mô tả**: Mô tả cấu trúc các models và mối quan hệ giữa chúng
- **Cách mở**: 
  - **Mermaid**: Mở file `.md`, copy code và paste vào https://mermaid.live/
  - **PlantUML**: Copy code và paste vào http://www.plantuml.com/plantuml/uml/

### 3. Activity Diagram
- **File PlantUML**: `ACTIVITY_DIAGRAM.puml`
- **File Mermaid**: `ACTIVITY_DIAGRAM_MERMAID.md` ⭐ (Khuyến nghị)
- **Mô tả**: Mô tả các luồng hoạt động chính:
  - User Registration and Login
  - Purchase Flow
  - Seller Product Management
  - Order Fulfillment
  - Withdrawal Process
- **Cách mở**: Mở file `.md`, copy code Mermaid và paste vào https://mermaid.live/

### 4. Sequence Diagram
- **File PlantUML**: `SEQUENCE_DIAGRAM.puml`
- **File Mermaid**: `SEQUENCE_DIAGRAM_MERMAID.md` ⭐ (Khuyến nghị)
- **Mô tả**: Mô tả tương tác giữa các thành phần:
  - User Registration
  - Product Purchase
  - Seller Adds Product
  - Order Fulfillment
  - Withdrawal Request
- **Cách mở**: Mở file `.md`, copy code Mermaid và paste vào https://mermaid.live/

## 🚀 Cách sử dụng với diagrams.net

### ⚠️ QUAN TRỌNG: diagrams.net KHÔNG hỗ trợ import trực tiếp PlantUML

### Phương pháp khuyến nghị: Sử dụng Mermaid

1. **Mở file Mermaid**:
   - `USE_CASE_DIAGRAM_MERMAID.md`
   - `ACTIVITY_DIAGRAM_MERMAID.md`
   - `SEQUENCE_DIAGRAM_MERMAID.md`

2. **Render Mermaid**:
   - Copy code Mermaid (trong ```mermaid ... ```)
   - Truy cập: https://mermaid.live/
   - Paste và render
   - Export sang PNG/SVG

3. **Import vào diagrams.net**:
   - Mở: https://app.diagrams.net/
   - **File** → **Import from** → **Device**
   - Chọn file PNG/SVG đã export
   - Chỉnh sửa và lưu

### Phương pháp thay thế: PlantUML cho Class Diagram

1. Mở `CLASS_DIAGRAM.puml`
2. Copy nội dung
3. Truy cập: http://www.plantuml.com/plantuml/uml/
4. Paste và render
5. Export sang PNG/SVG
6. Import vào diagrams.net

## 📝 Lưu ý

- Tất cả các file `.puml` sử dụng PlantUML syntax
- Có thể render trực tiếp trên: http://www.plantuml.com/plantuml/uml/
- Diagrams.net hỗ trợ import PlantUML nhưng có thể cần cài đặt plugin
- Nếu không import được, có thể copy nội dung và paste vào PlantUML online editor

## 🔧 Cài đặt PlantUML cho diagrams.net

1. Mở diagrams.net
2. Click **Extras** → **Plugins**
3. Thêm plugin PlantUML (nếu có)
4. Hoặc sử dụng PlantUML online editor và export sang định dạng mà diagrams.net hỗ trợ

## 📚 Tài liệu tham khảo

- [PlantUML Documentation](https://plantuml.com/)
- [diagrams.net Documentation](https://www.diagrams.net/doc/)
- [PlantUML Online Editor](http://www.plantuml.com/plantuml/uml/)

