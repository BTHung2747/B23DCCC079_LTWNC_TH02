# Nhịp Tập - LTWNC TH02

Bài thực hành cá nhân của B23DCCC079: kho 10.000 bài tập, đồng hồ buổi tập, bài đã lưu và giáo án cá nhân.

## Chạy project

Yêu cầu Node.js 22.12 trở lên (22 hoặc 24 LTS).

```bash
npm ci --legacy-peer-deps
npm run dev
```

`react-window` được giữ ở phiên bản 1 theo đề; cờ `--legacy-peer-deps` xử lý khai báo peer dependency của thư viện này khi dùng React 19.

## Kiểm tra

```bash
npm run build
npm test
npm run coverage
```

Tên file tự đặt dùng tiếng Việt không dấu; thư mục và định danh trong mã dùng tiếng Anh. File kiểm thử nằm cạnh file nguồn.
