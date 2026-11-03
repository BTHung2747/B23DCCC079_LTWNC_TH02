# Checklist kiểm thử LTWNC TH02

Đối chiếu 4 phần bắt buộc của đề với bản đã triển khai. Tên file tự đặt dùng tiếng Việt không dấu; thư mục và định danh trong mã dùng tiếng Anh theo quy ước đã thống nhất.

## Chuẩn bị

- Mở `http://localhost:5173/` và giữ cùng địa chỉ này trong toàn bộ quá trình kiểm thử. `localhost` và `127.0.0.1` có vùng localStorage riêng.
- Nếu ứng dụng chưa chạy: mở terminal tại thư mục project, chạy `npm ci`, rồi `npm run dev`. Theo địa chỉ được Vite in ra và dùng nhất quán địa chỉ đó.
- Các bước tìm kiếm bên dưới dùng từ khóa có dấu. Trước mỗi nhóm test tại Kho bài tập, xóa từ khóa, chọn Nhóm cơ = Tất cả, Sắp xếp = Mặc định và chờ ít nhất 300ms.
- Dùng tên giáo án mới, ví dụ `Buổi kiểm tra`, để không đụng giáo án đã có. Nếu đã dùng tên đó, thay bằng tên khác trong toàn bộ các bước tương ứng.
- Các nút thao tác đã được kiểm tra trong khung 390px, 768px và 1440px. Dòng `Buổi tập: N bài` ở thanh đáy hiện cả trong khung xem hẹp để đối chiếu số lượng buổi tập.
- Chỉ xóa giáo án bạn vừa tạo để test. Không cần xóa dữ liệu cá nhân để chạy checklist.

## Phần 1 - Kho 10.000 bài tập

### Đề yêu cầu và phần đã làm

- React Router v6 với 4 route: `/`, `/saved`, `/routines`, `/routines/:id`; menu dùng NavLink và đánh dấu trang hiện tại.
- Dữ liệu sinh một lần theo đúng công thức của đề, gồm 10.000 bài, mã duy nhất, thời lượng từ 30 đến 120 giây.
- Danh sách ảo hóa bằng FixedSizeList: cao 560px, mỗi dòng 56px, key theo mã bài tập.
- Mỗi dòng có thứ tự, tên bài, HLV, nhóm cơ, thời lượng và các nút thao tác. Trên màn hình hẹp, thông tin được gom dưới tên bài để các nút vẫn nhìn thấy.
- Tìm theo tên bài hoặc HLV, không phân biệt hoa thường; useDebounce generic với độ trễ 300ms.
- Lọc nhóm cơ; sắp xếp mặc định, tên A-Z theo locale tiếng Việt, thời lượng tăng dần; hiển thị số kết quả và trạng thái rỗng.
- useMemo cho lọc/sắp xếp, memo cho dòng, callback và dữ liệu truyền xuống danh sách ổn định; sắp xếp trên bản sao mảng.

### Bấm thử

| Mã | Thao tác | Kết quả mong đợi |
| --- | --- | --- |
| 1.1 | Mở Kho bài tập, bỏ toàn bộ bộ lọc | Tìm thấy 10000 bài tập; cuộn danh sách được |
| 1.2 | Gõ `đẩy`, ngừng gõ ít nhất 300ms | 1250 bài tập |
| 1.3 | Giữ `đẩy`, chọn nhóm `Vai` | 250 bài tập |
| 1.4 | Chọn Tất cả, thay từ khóa bằng `đức anh` | 1000 bài tập; tìm được theo HLV Đức Anh |
| 1.5 | Thay bằng `ĐỨC ANH` | Vẫn 1000 bài tập |
| 1.6 | Gõ `xyz` | Hiện Không tìm thấy bài tập nào |
| 1.7 | Xóa tìm kiếm, chọn Tất cả, sắp xếp Tên A-Z | Dòng đầu là Bật chậm 1 |
| 1.8 | Sắp xếp Thời lượng tăng dần | Đầu danh sách là các bài 0:30; thời lượng không giảm khi cuộn xuống |
| 1.9 | Trong DevTools Elements, xem các phần tử role=listitem của kho | Chỉ khoảng 10-15 dòng được dựng, không có 10.000 dòng DOM |
| 1.10 | Nếu có React DevTools, bật Highlight updates rồi gõ liên tục | Dòng bài tập không cập nhật theo mỗi ký tự; danh sách đổi sau khi ngừng gõ 300ms |

## Phần 2 - Đồng hồ buổi tập và bài đã lưu

### Đề yêu cầu và phần đã làm

- Session store bằng Zustand: queue, currentIndex, isRunning, elapsed; đủ startSession, toggleRun, next, prev, addToSession và tick.
- Bắt đầu từ một dòng sử dụng danh sách đang được lọc và sắp xếp, bắt đầu đúng vị trí dòng đó.
- Đồng hồ mỗi giây, tự chuyển bài khi hết thời lượng; dừng tại cuối buổi tập; quy tắc nút Trước tại mốc 3 giây; bỏ qua bài thêm trùng.
- Thanh đồng hồ cố định ở đáy và giữ buổi tập khi chuyển route. Trạng thái buổi tập hiện tại không được persist sau F5, đúng phạm vi đề.
- Phần đếm ngược/tiến trình đọc elapsed riêng; các phần khác đọc selector phù hợp. Interval chỉ chạy khi đang tập và được cleanup.
- Saved store riêng bằng Zustand persist, key workout-saved; nút sao đổi trạng thái; trang Đã lưu có danh sách, trạng thái rỗng và Tập tất cả.

### Bấm thử

| Mã | Thao tác | Kết quả mong đợi |
| --- | --- | --- |
| 2.1 | Kho không lọc, sắp xếp mặc định. Bấm Bắt đầu tại Kéo tạ đơn 1 (dòng 2, e2) | Thanh đáy hiện bài Kéo tạ đơn 1, HLV Phương Anh, ban đầu còn 1:07 |
| 2.2 | Đợi khoảng 5 giây | Còn khoảng 1:02, thanh tiến trình tăng |
| 2.3 | Bấm Tạm dừng, ghi lại thời gian rồi chờ 3 giây | Thời gian giữ nguyên; nút đổi thành Tiếp tục. Bấm Tiếp tục để chạy tiếp |
| 2.4 | Tại e2 đang tạm dừng, bấm Sau | Sang Gập tạ đơn 1 (e3), HLV Đức Anh, còn 1:44 |
| 2.5 | Sau bước 2.4, bấm Trước ngay khi bài mới vẫn ở giây 0 | Trở về e2, còn 1:07 |
| 2.6 | Bắt đầu e2, tập hơn 3 giây, tạm dừng rồi bấm Trước | Vẫn e2, thời gian đặt lại thành 1:07 |
| 2.7 | Bắt đầu Đẩy tạ đơn 1 (e1), chờ quá 30 giây | Tự sang e2; tên bài và thời lượng đổi đúng |
| 2.8 | Tìm `đẩy`, bấm Bắt đầu ở một dòng rồi bấm Sau | Bài tiếp theo vẫn có tên bắt đầu bằng Đẩy; queue dựa trên danh sách đã lọc |
| 2.9 | Tìm `đức anh`, Bắt đầu bài đầu tiên; xóa từ khóa rồi bấm + Buổi tập tại e1 | Số bài trong buổi tập từ 1000 thành 1001 |
| 2.10 | Bấm + Buổi tập tại e1 lần nữa | Số bài vẫn 1001, không thêm trùng |
| 2.10a | Sau khi bắt đầu một danh sách, xem các nút Buổi tập rồi chỉ bấm + Buổi tập tại một dòng | Bắt đầu không tô màu toàn bộ nút. Chỉ dòng bấm thêm thủ công có dấu ✓ và chuyển màu; thêm lần nữa có thông báo bài đã có |
| 2.11 | Khi đang tập, chuyển qua Đã lưu và Giáo án bằng menu | Thanh đáy vẫn hiện bài đang tập và đồng hồ tiếp tục chạy |
| 2.12 | Đảm bảo e1 và e3 đang có sao đặc ★, mở Đã lưu rồi F5 | Cả hai vẫn có trong danh sách. Nếu trước đó còn lưu bài khác, tổng số bài có thể lớn hơn 2 |
| 2.13 | Bấm Bỏ lưu tại một bài, rồi F5 | Bài đó không còn trong Đã lưu; có thể lưu lại từ kho |
| 2.14 | Tại Đã lưu, bấm Tập tất cả | Buổi tập gồm các bài đã lưu, bắt đầu từ bài đầu tiên |
| 2.15 | Trong DevTools Application > Local Storage, xem workout-saved | Có các ID bài đang được lưu |
| 2.16 | Nếu có Highlight updates, xem trong lúc cùng một bài đang chạy | Phần thời gian/tiến trình cập nhật mỗi giây; danh sách và nút điều khiển không cập nhật theo mỗi tick |

Ca dừng ở bài cuối được kiểm tra thuận tiện với giáo án chỉ có 2 bài, ở bước 3.8 bên dưới.

## Phần 3 - Giáo án, Context, giao diện và lazy loading

### Đề yêu cầu và phần đã làm

- Routine và RoutineAction có kiểu rõ ràng; đủ create, rename, remove, addExercise, removeExercise.
- Reducer thuần, cập nhật bất biến, không thêm trùng bài.
- withLogger ghi tên action và state trước/sau trong DEV; build production bỏ log này.
- Hai Context riêng cho state và dispatch; hai hook báo lỗi khi dùng ngoài Provider. Form tạo chỉ nhận dispatch và callback kiểm tra tên ổn định.
- Giáo án được khôi phục và lưu với localStorage key workout-routines.
- Tạo/xóa giáo án, kiểm tra tên trống/trùng không phân biệt hoa thường; chọn giáo án tại kho và thêm bài vào giáo án được chọn.
- Chi tiết có tên, danh sách bài, Bỏ, tổng thời lượng tính bằng reduce, Tập tất cả và trạng thái không tìm thấy. Có thêm giao diện Đổi tên để sử dụng action rename.
- ThemeContext riêng, value dùng useMemo, nút sáng/tối trên menu.
- Ba trang phụ dùng React.lazy, export default, bọc Suspense; build tạo ba chunk trang riêng.

### Bấm thử theo thứ tự

| Mã | Thao tác | Kết quả mong đợi |
| --- | --- | --- |
| 3.1 | Vào Giáo án, để tên trống rồi bấm Tạo | Tên giáo án không được để trống |
| 3.2 | Tạo giáo án mới tên `Buổi kiểm tra` | Xuất hiện giáo án đó, ban đầu 0 bài |
| 3.3 | Tạo tiếp `buổi KIỂM TRA` | Tên giáo án đã tồn tại |
| 3.4 | Về kho, bỏ bộ lọc. Chọn đúng `Buổi kiểm tra` trong ô Giáo án đang chọn; bấm + Giáo án tại e1, e2 rồi e1 lần nữa | Có thông báo đã thêm; lần thêm e1 tiếp theo báo bài đã có |
| 3.4a | Xem nút Giáo án của bài vừa thêm; sau đó chuyển sang giáo án khác chưa có bài đó | Nút có dấu ✓ và chuyển màu trong đúng giáo án đã thêm; đổi giáo án thì trạng thái cập nhật theo giáo án đang chọn |
| 3.5 | Vào chi tiết Buổi kiểm tra | Chỉ có 2 bài; Tổng thời gian: 1 phút 37 giây |
| 3.6 | F5 tại trang chi tiết | Giáo án và 2 bài vẫn còn; có dữ liệu trong workout-routines |
| 3.7 | Bấm Tập tất cả | Thanh đáy bắt đầu e1, HLV Minh Khang; queue gồm 2 bài |
| 3.8 | Sau bước 3.7, bấm Sau để sang e2, rồi bấm Sau lần nữa | Ở bài cuối, đồng hồ dừng và nút Tạm dừng không còn hiển thị |
| 3.9 | Trong chi tiết, bấm Bỏ tại e1 | Còn e2; tổng thời gian thành 1 phút 7 giây |
| 3.10 | Bấm Đổi tên, nhập tên mới chưa có rồi Lưu tên | Tiêu đề và danh sách giáo án đổi theo; F5 vẫn giữ tên mới |
| 3.11 | Trong bản dev, mở Console; về kho, chọn lại đúng giáo án thử vừa đổi tên rồi thêm một bài | Có log addExercise kèm before và after |
| 3.12 | Bấm Giao diện tối rồi Giao diện sáng | Màu giao diện đổi toàn bộ; các thao tác và trạng thái hiện tại vẫn dùng được |
| 3.13 | Mở http://localhost:5173/routines/khong-ton-tai | Hiện Không tìm thấy giáo án |
| 3.14 | Quay lại Giáo án, xóa đúng giáo án vừa tạo để test | Giáo án đó biến mất; F5 không xuất hiện lại |

Có sẵn 3 giáo án mẫu: Thân trên cơ bản, Ngày chân, Toàn thân. Mẫu được thêm một lần, không ghi đè giáo án cá nhân; có thể sửa/xóa như giáo án thường. Mẫu đã xóa không tự xuất hiện lại sau F5.

Nếu muốn kiểm tra lúc hoàn toàn chưa có giáo án, dùng một cửa sổ riêng/ẩn danh để không tác động dữ liệu đang lưu, xóa các mẫu trong cửa sổ thử đó: ô chọn báo Chưa có giáo án và nút + Giáo án bị khóa.

Lazy loading có thể kiểm tra từ kết quả build. Muốn xem qua Network, dùng bản production: chạy `npm run build`, rồi `npm run preview`, mở URL Vite cung cấp, mở Network và lần lượt vào các trang phụ. Đề bài về chunk riêng được kiểm tra rõ nhất ở bản production; môi trường dev phục vụ các module nguồn.

## Phần 4 - Vitest, React Testing Library và coverage

### Đề yêu cầu và phần đã làm

- Tối thiểu 12 test; bản hiện tại có 64 test trong 16 file, tên test bằng tiếng Việt và file test đặt cạnh nguồn.
- Đủ các nhóm bắt buộc: formatDuration; generateExercises; routineReducer; session store; debounce với renderHook/fake timers; ExerciseRow với mock callback/getByRole; trang giáo án với userEvent và renderWithProviders.
- Có thêm test interval và cleanup, các trang, persistence, đổi tên và các biên của store.
- Có test hiệu năng dùng React Profiler: danh sách và phần điều khiển không commit khi chỉ elapsed đổi, phần đếm ngược cập nhật, form chỉ đọc dispatch không cập nhật theo danh sách giáo án. Có kiểm tra việc không tính lại thời lượng dòng trước mốc debounce.
- Ngưỡng Lines 70% áp dụng cho src/features và src/utils. Kết quả lần kiểm tra gần nhất: 100% Lines trong phạm vi này; ảnh bảng báo cáo ở coverage.png.

### Tự chạy bằng terminal

Mở PowerShell tại thư mục project:

```powershell
Set-Location 'D:\BaiTH\B23DCCC079_LTWNC_TH02'
npm run build
npm test
npm run coverage
```

Đối chiếu:

| Lệnh | Kết quả mong đợi |
| --- | --- |
| npm run build | Kết thúc thành công, có dist và ba chunk trang phụ |
| npm test | 16 file test đạt, 64 test đạt, không có test thất bại |
| npm run coverage | Toàn bộ test đạt, Lines >= 70%; bản hiện tại 100% trong phạm vi được cấu hình |

Mở `coverage/index.html` sau khi chạy coverage để xem báo cáo HTML. Đây là coverage của phạm vi đề yêu cầu, không phải tuyên bố đo toàn bộ các file trong ứng dụng.

## Yêu cầu chung và nộp bài

- Node.js 22.12 trở lên; React + TypeScript; React Router v6; react-window v1; Zustand; Vitest và React Testing Library.
- Không dùng Redux Toolkit, any hoặc enum trong mã; dùng import type cho kiểu dữ liệu.
- GitHub repo public; đã push các commit Phan 1, Phan 2, Phan 3, Phan 4.
- Các file hướng dẫn/cấu hình AI agent và thư mục kiểm tra nội bộ không được đưa vào các commit đã push; .gitignore đã có quy tắc loại trừ.

## Phần tùy chọn chưa triển khai

- Thời gian nghỉ giữa bài.
- So sánh thời gian render cả 10.000 dòng với danh sách ảo hóa và ghi số đo vào README.
- Zustand devtools middleware.
- Phím Space để chạy/tạm dừng.

## Ghi kết quả khi test

Đánh dấu từng mã đã đạt. Nếu thấy sai, ghi lại: mã ca test, URL đang mở, bộ lọc/giáo án đang chọn, thao tác vừa bấm, kết quả thực tế và ảnh màn hình nếu có.
