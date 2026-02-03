# PronaFlow Technical Documentation

**Dự án**: PronaFlow - Hệ thống Quản trị Dự án và Cộng tác Thông minh Đa nền tảng  
**Kiến trúc**: Microservices (Backend) & SPA/Desktop Hybrid (Frontend)  
**Trạng thái**: Đang cập nhật  
**Last Updated**: 2026-02-03

---

## 📚 Tổng quan

Đây là bộ tài liệu kỹ thuật đầy đủ cho dự án PronaFlow, được tổ chức theo cấu trúc chuẩn phát triển phần mềm từ yêu cầu đến triển khai.

## 📂 Cấu trúc tài liệu

### 00. General - Tổng quan & Nền tảng
Thông tin định hướng chiến lược và nền tảng công nghệ.

**Nội dung:**
- Overview - Tổng quan dự án
- Technology Stack - Kiến trúc công nghệ
- Glossary - Thuật ngữ viết tắt

**Files:**
- `Overview.md`
- `Technology-Stack.md`
- `Glossary.md`

### 01. Requirements - Đặc tả Yêu cầu
Yêu cầu chức năng được chia thành 16 phân hệ theo Domain-Driven Design (DDD).

**Modules:**
1. Identity & Access Management
2. Multi-Tenancy & Workspace
3. Project Lifecycle Management
4. Task Execution & Orchestration
5. Temporal Planning & Scheduling
6. Unified Collaboration Hub
7. Event-Driven Notification
8. Data Archiving & Compliance
9. User Experience & Personalization
10. Intelligent Decision Support
11. Advanced Analytics & Reporting
12-16. (Xem thêm trong thư mục)

**Files:**
- `System-Functional-Modules.md`
- `Functional-Modules/` - Chi tiết từng module

### 02. Architecture - Kiến trúc Hệ thống
Thiết kế kiến trúc tổng thể và các thành phần.

**Nội dung:**
- System Architecture
- Database Design (ERD)
- API Design
- Microservices Structure
- Data Flow

**Note:** Folder có lỗi chính tả "Architeture" → Nên rename thành "Architecture"

### 03. UI/UX Design
Thiết kế giao diện và trải nghiệm người dùng.

**Nội dung:**
- Wireframes
- Mockups
- Design System
- User Flows
- Prototypes

### 04. AI Specifications
Đặc tả các tính năng AI/ML trong hệ thống.

**Nội dung:**
- AI Models
- Training Data
- Inference Pipeline
- Integration Points

### 05. Deployment & Operations
Hướng dẫn triển khai và vận hành.

**Nội dung:**
- Deployment Guides
- Infrastructure Setup
- Monitoring & Logging
- Backup & Recovery

### 06. Quality Assurance
Chiến lược và quy trình đảm bảo chất lượng.

**Nội dung:**
- Testing Strategy
- Test Cases
- QA Processes
- Bug Tracking

### 07. References
Tài liệu tham khảo và nguồn học.

**Nội dung:**
- External Documentation
- API References
- Learning Resources
- Best Practices

## 📋 Các file hỗ trợ

- **[Check list - Docs & Templates.md](Check%20list%20-%20Docs%20&%20Templates.md)** - Checklist và templates
- **[Contents.base](Contents.base)** - Base content structure
- **[HEADER DOCUMENT](HEADER%20DOCUMENT%20-%20Hệ%20thống%20Tài%20liệu%20Kỹ%20thuật%20PronaFlow.md)** - Hệ thống tài liệu kỹ thuật
- **[Lộ trình xây dựng](Lộ%20trình%20xây%20dựng%20Tài%20liệu%20Kỹ%20thuật%20Dự%20án%20PronaFlow.md)** - Roadmap phát triển tài liệu

## 🎯 Hướng dẫn sử dụng

### Cho Business Analyst / Product Owner
1. Bắt đầu với [00-General/Overview.md](00-General/)
2. Xem [01-Requirements/](01-Requirements/) cho functional modules
3. Tham khảo [03-UI-UX-Design/](03-UI-UX-Design/)

### Cho Backend Developer
1. Xem [00-General/Technology-Stack.md](00-General/)
2. Nghiên cứu [02-Architeture/](02-Architeture/)
3. Tham khảo [01-Requirements/](01-Requirements/)

### Cho Frontend Developer
1. Xem [00-General/Technology-Stack.md](00-General/)
2. Tham khảo [03-UI-UX-Design/](03-UI-UX-Design/)
3. Xem [../frontend/](../frontend/) cho frontend-specific docs

### Cho DevOps Engineer
1. Xem [05-Deployment-Operations/](05-Deployment-Operations/)
2. Tham khảo [00-General/Technology-Stack.md](00-General/)

### Cho QA Engineer
1. Xem [06-Quality-Assurance/](06-Quality-Assurance/)
2. Tham khảo [01-Requirements/](01-Requirements/)

## 🔧 Lưu ý

1. **Lỗi chính tả**: Thư mục `02-Architeture/` nên được rename thành `02-Architecture/`
2. **Assets**: Thư mục `assets/` chứa hình ảnh và tài nguyên hỗ trợ
3. **Obsidian**: File config `.obsidian/` đã được di chuyển vào `/draft`

## 📝 Conventions

- Folders: `00-Folder Name/` với số thứ tự
- Files: `PascalCase.md` hoặc `kebab-case.md`
- Internal links: Sử dụng relative paths
- Images: Lưu trong `assets/`

## 🔗 Related Documentation

- [Frontend Technical Docs](../frontend/) - Chi tiết về frontend
- [Main README](../../README.md) - Project overview
- [Documentation Index](../INDEX.md) - Full documentation index

---

**Maintained by:** PronaFlow Technical Team  
**Last Review:** 2026-02-03
