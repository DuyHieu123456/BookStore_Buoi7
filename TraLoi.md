# Trả lời câu hỏi bổ sung — BookStore Buổi 7

Họ tên: Trần Huỳnh Duy Hiệu — MSSV: 23722361

## Câu 1 — Cấu trúc điều hướng

BookDetail được đăng ký ở Stack ngoài cùng vì màn Chi tiết phải phủ lên toàn bộ giao diện, che cả Tab Bar, và Stack tự cung cấp nút quay lại (←) cùng tiêu đề "Chi tiết sách". Người dùng mở Chi tiết từ Home rồi quay lại đúng vị trí cuộn trước đó, giống hệt luồng mua hàng thật. Nếu đặt BookDetail vào trong Tab thì nó sẽ thành một tab ngang hàng: Tab Bar vẫn hiện ở dưới, không có nút ← tự động, và người dùng buộc phải bấm tab để thoát ra thay vì quay lại màn vừa xem.

## Câu 2 — Redux / Immer và useMemo

Redux Toolkit dùng thư viện Immer bên trong createSlice: khi reducer viết `state.items.push(...)`, ta thực ra đang sửa trên một bản nháp (draft) do Immer tạo ra, chứ không sửa trực tiếp state gốc. Immer so sánh bản nháp với state cũ rồi tự sinh ra state mới bất biến, nên component đọc state cũ vẫn an toàn và Redux vẫn phát hiện đúng thay đổi để render lại. Nếu bỏ useMemo trong useCart thì kết quả hiển thị (tổng số lượng, tổng tiền) không đổi chút nào, vì phép tính vẫn chạy; hậu quả chỉ là hai tổng bị tính lại ở mọi lần render dù items không đổi — giỏ càng lớn và app càng render nhiều thì càng tốn, ngoài ra giá trị trả về thay đổi identity không cần thiết có thể khiến các component con dùng memo render lại thừa.

## Câu 3 — Promise.all và cách xử lý khi một API lỗi

Với `Promise.all([getBooks(), getCategories()])` ở Home hiện tại: nếu getCategories() lỗi thì cả Promise.all bị reject ngay, catch chạy và Home hiện ErrorView dù getBooks() đã thành công — người dùng mất cả danh sách sách chỉ vì thiếu danh mục. Muốn vẫn hiện sách thì đổi sang `Promise.allSettled`: request nào fulfilled thì lấy value của nó, request nào rejected thì chỉ mất phần đó (ví dụ vẫn hiện lưới sách nhưng không có chip danh mục, kèm ghi log hoặc thông báo phụ). Đánh đổi là code phức tạp hơn: phải tự kiểm tra trạng thái từng kết quả, tự quyết định lỗi phần nào là chấp nhận được, và giao diện có thêm các trạng thái "thiếu một phần dữ liệu" khó kiểm thử hơn lỗi toàn cục.

## Câu 4 — Debounce

Không đặt setTimeout thẳng trong onChangeText vì mỗi ký tự gõ vào đều tạo một timer riêng mà timer của các ký tự trước không bị huỷ; các timer đó vẫn lần lượt chạy và gây lọc (hoặc gọi API) nhiều lần, chỉ là mỗi lần bị trễ đi chứ không gộp lại thành một lần cuối. Hook useDebounce đặt timer trong useEffect và trả về hàm dọn dẹp `return () => clearTimeout(t)`: mỗi khi value đổi, React chạy hàm dọn dẹp của lần trước, huỷ timer cũ, chỉ timer của ký tự cuối cùng mới đủ 400 ms để cập nhật giá trị. Hàm dọn dẹp còn tránh được việc setState vào component đã bị gỡ khỏi màn hình (unmount), vốn gây cảnh báo rò rỉ bộ nhớ và lỗi khó hiểu.

## Câu 5 — Code bổ sung: sắp xếp giá tăng dần / giảm dần

Đã thêm vào HomeScreen (`src/screens/HomeScreen.tsx`): một state `sort` và một hàng hai nút "Giá tăng dần / Giá giảm dần" trong phần header của lưới (bấm lại nút đang chọn để bỏ sắp xếp). Việc sắp xếp làm ngay trong useMemo của `visibleBooks`: lọc trước bằng `filterBooks`, sau đó sắp xếp một **bản sao** của mảng đã lọc để không sửa mảng gốc trong state.

```tsx
type SortKey = "asc" | "desc" | null;
const [sort, setSort] = useState<SortKey>(null);

const visibleBooks = useMemo(() => {
  const filtered = filterBooks(books, {
    keyword: debouncedKeyword,
    categoryId,
    priceRange,
  });
  if (!sort) return filtered;
  return [...filtered].sort((a, b) =>
    sort === "asc" ? a.price - b.price : b.price - a.price
  );
}, [books, debouncedKeyword, categoryId, priceRange, sort]);
```

Ảnh chụp màn hình kết quả sắp xếp: đính kèm trong file Word minh chứng (mục Câu 5 — sắp xếp giá).
