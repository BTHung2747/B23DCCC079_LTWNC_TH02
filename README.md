# Nhịp Tập - LTWNC TH02

Bài thực hành cá nhân của B23DCCC079: kho 10.000 bài tập, đồng hồ buổi tập, bài đã lưu và giáo án cá nhân.

## Chạy project

Yêu cầu Node.js 22.12 trở lên (22 hoặc 24 LTS).

```bash
npm ci
npm run dev
```

`react-window` được giữ ở phiên bản 1 theo đề. File `.npmrc` bật `legacy-peer-deps` để cài cùng React 19, vì khai báo peer dependency của phiên bản cũ chưa liệt kê React 19.

## Kiểm tra

```bash
npm run build
npm test
npm run coverage
```

Tên file tự đặt dùng tiếng Việt không dấu; thư mục và định danh trong mã dùng tiếng Anh. File kiểm thử nằm cạnh file nguồn.

## Các trang

| URL | Chức năng |
| --- | --- |
| `/` | Kho bài tập, tìm kiếm, lọc, sắp xếp, thêm vào buổi tập/giáo án |
| `/saved` | Bài đã lưu và tập tất cả |
| `/routines` | Tạo, kiểm tra tên trùng và xóa giáo án |
| `/routines/:id` | Xem, đổi tên, bỏ bài, tổng thời lượng và tập cả giáo án |

Thanh đồng hồ luôn nằm ở đáy màn hình. Giao diện có chế độ sáng/tối và bố cục thích ứng màn hình nhỏ.

Sau khi tạm dừng một buổi tập đã bắt đầu, nút điều khiển hiển thị **Tiếp tục** và chạy tiếp từ thời gian đang dở.

## Giáo án mẫu và phản hồi thao tác

- Có sẵn 3 mẫu: **Thân trên cơ bản** (4 bài), **Ngày chân** (3 bài), **Toàn thân** (5 bài).
- Khi cập nhật, mẫu được bổ sung một lần vào dữ liệu đã lưu, giữ nguyên giáo án cá nhân và tránh tên trùng. Mẫu đã xóa không tự xuất hiện lại sau F5.
- Nút **Giáo án** chuyển màu và có dấu **✓** nếu bài nằm trong giáo án đang chọn; đổi giáo án sẽ cập nhật trạng thái theo đúng giáo án đó.
- Nút **Buổi tập** chuyển màu và có dấu **✓** cho các bài được bấm thêm thủ công. Bấm **Bắt đầu** vẫn khởi tạo cả danh sách đang hiển thị theo đề, và đặt lại dấu thêm thủ công cho buổi mới.
- Thêm bài hoặc bấm thêm bài đã có sẽ hiện thông báo tại góc màn hình; thông báo tự ẩn sau 4 giây hoặc đóng bằng nút ×.

Ở khung xem hẹp, thông tin HLV/nhóm cơ/thời lượng được gom dưới tên bài để toàn bộ nút thao tác luôn hiện trong dòng. Danh sách ảo hóa vẫn giữ chiều cao 560px và mỗi dòng 56px. Đã kiểm tra vị trí nút tại 390px, 768px và 1440px.

## Quản lý state và hiệu năng

- `features/session/khoBuoiTap.ts`: Zustand với selector riêng, lưu queue/index/trạng thái chạy/elapsed. Bắt đầu tại kho sử dụng bản chụp danh sách đã lọc và sắp xếp.
- `features/session/ThanhDemNguoc.tsx`: chỉ phần đếm ngược đọc `elapsed`. Danh sách và các nút điều khiển không đăng ký thay đổi số giây.
- `features/saved/khoBaiTapDaLuu.ts`: Zustand persist, key `workout-saved`.
- `features/routines/NguCanhGiaoAn.tsx`: Context state/dispatch tách riêng; reducer bất biến; khôi phục và lưu `workout-routines`.
- `contexts/NguCanhGiaoDien.tsx`: Context riêng với value được memo hóa.
- Kho chỉ sinh 10.000 bài một lần; `FixedSizeList` cao 560px, mỗi dòng 56px, key theo ID; dòng được memo hóa, dữ liệu/callback ổn định; debounce 300ms.
- Form tạo giáo án chỉ dùng dispatch Context. Callback kiểm tra tên ổn định đọc qua ref, nên form không nhận cập nhật từ state Context.
- Ba trang phụ được tải qua `React.lazy`, tạo ba chunk trang riêng khi build.

## Kiểm thử

64 test kiểm tra dữ liệu, định dạng, debounce, reducer, store, interval/cleanup, các trang, thao tác người dùng, giáo án mẫu, phản hồi sau khi thêm bài và việc tránh cập nhật component thừa. Các test hiệu năng dùng React Profiler để đo riêng kho bài tập, phần điều khiển, phần đếm ngược và form chỉ đọc dispatch. Test Context xác nhận lỗi khi hook được dùng ngoài Provider; test logger xác nhận log chỉ có ở DEV và kết quả reducer được giữ nguyên. Chạy `npm run coverage` để xem số liệu mới nhất; báo cáo HTML tại `coverage/index.html`. Ngưỡng Lines 70% được bật trong cấu hình cho `src/features` và `src/utils`.

Ảnh `coverage.png` chụp bảng báo cáo coverage thực tế.

## Đối chiếu tên với đề

| Tên trong đề | File sử dụng |
| --- | --- |
| `types.ts` | `src/kieuDuLieu.ts` |
| `data/exercises.ts` | `src/data/baiTap.ts` |
| `utils/format.ts` | `src/utils/dinhDangThoiGian.ts` |
| `hooks/useDebounce.ts` | `src/hooks/useTriHoan.ts` |
| `LibraryPage.tsx`, `ExerciseRow.tsx` | `TrangKhoBaiTap.tsx`, `DongBaiTap.tsx` |
| `useSessionStore.ts` | `features/session/khoBuoiTap.ts` |
| `SessionBar.tsx`, `CountdownBar.tsx` | `ThanhBuoiTap.tsx`, `ThanhDemNguoc.tsx` |
| `useSavedStore.ts`, `SavedPage.tsx` | `khoBaiTapDaLuu.ts`, `TrangBaiTapDaLuu.tsx` |
| `routineReducer.ts`, `withLogger.ts` | `capNhatGiaoAn.ts`, `ghiNhatKy.ts` |
| `RoutineContext.tsx` | `NguCanhGiaoAn.tsx` |
| `RoutinesPage.tsx`, `RoutineDetailPage.tsx` | `TrangGiaoAn.tsx`, `TrangChiTietGiaoAn.tsx` |

Các tên export, action, URL và key localStorage vẫn theo đề; chỉ tên file tự đặt được Việt hóa theo yêu cầu.
