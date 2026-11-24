# 🏆 AI LÀ TRIỆU PHÚ – PHIÊN BẢN TƯ TƯỞNG HỒ CHÍ MINH 🇻🇳

Website trò chơi học thuật **"Ai Là Triệu Phú - Phiên Bản Tư Tưởng Hồ Chí Minh"** được thiết kế chuyên biệt phục vụ cho các buổi thuyết trình, báo cáo chuyên đề và ôn tập môn học **Tư tưởng Hồ Chí Minh** tại các trường Đại học, Cao đẳng.

Giao diện được xây dựng theo phong cách **truyền hình thực tế (TV Gameshow Broadcast)** hiện đại, đẳng cấp với tông màu xanh navy đậm, vàng ánh kim, hiệu ứng trường quay 3D, đèn spotlight chuyển động và âm thanh kịch tính.

---

## 📁 Cấu trúc thư mục

```text
c:\Users\Admin\TTHCM\
│
├── index.html           # Cấu trúc HTML5 chuẩn gameshow, chứa đầy đủ các ID theo yêu cầu
├── style.css            # Toàn bộ mã định kiểu CSS3, hiệu ứng ánh sáng, lozenge shape và animation
├── ui.js                # Xử lý giao diện: chuyển màn hình, âm thanh Web Audio API, hiệu ứng hạt & pháo hoa
├── questions.js         # Ngân hàng 10 câu hỏi tài liệu PTIT + câu dự phòng + mốc tiền thưởng
├── game.js              # Bộ điều khiển logic: hỗ trợ 2 người/câu, nút quay lại câu trước, tính điểm
├── server.js            # Máy chủ web cục bộ Node.js (chống lưu cache trình duyệt)
└── README.md            # Tài liệu hướng dẫn sử dụng và thuyết trình
```

---

## 🚀 Cách chạy website trên máy tính

Website sử dụng 100% **HTML5, CSS3 và JavaScript thuần (Vanilla JS)**:

### Cách 1: Chạy bằng Node.js Server (Khuyên dùng)
```powershell
node server.js
```
Sau đó truy cập: **`http://localhost:3000`**

### Cách 2: Chạy trực tiếp không cần server
Mở thư mục `c:\Users\Admin\TTHCM`, nhấp đúp vào file **`index.html`** để mở bằng Chrome, Edge, Cốc Cốc.

---

## 🖥️ Hướng dẫn điều khiển trong buổi thuyết trình

1. **Chế độ Toàn màn hình (Fullscreen):**
   - Nhấp vào nút **`Trình chiếu`** ở góc trên bên phải màn hình (hoặc bấm phím **F11**).
   - Tối ưu chuẩn tỉ lệ **16:9** cho máy chiếu giảng đường.

2. **Điều hướng linh hoạt giữa các câu hỏi:**
   - **Nút "◀ Câu trước" / "Câu tiếp ▶"**: Nằm ở thanh trên cùng bên cạnh ô số thứ tự câu hỏi.
   - **Hỗ trợ bút trình chiếu & Bàn phím**:
     - Bấm phím **Mũi tên Trái (◀)** hoặc **PageUp**: Quay lại câu hỏi trước.
     - Bấm phím **Mũi tên Phải (▶)** hoặc **PageDown**: Chuyển sang câu hỏi kế tiếp.

3. **Cơ chế 2 người chơi độc lập mỗi câu:**
   - **Lượt 1 (Người thứ 1)**:
     - Nếu trả lời **Đúng**: Nút xanh lá, cộng điểm và chuyển sang câu tiếp.
     - Nếu trả lời **Sai**: Nút đỏ, khóa đáp án sai, huy hiệu đổi sang *"LƯỢT 2/2: CƠ HỘI CHO NGƯỜI CHƠI 2"* và mở khóa 3 đáp án còn lại để mời bạn thứ 2 trong lớp cứu điểm.
   - **Lượt 2 (Người thứ 2)**:
     - Nếu trả lời **Đúng**: Nút xanh lá, cộng điểm.
     - Nếu cũng **Sai**: Tự động bừng sáng đáp án ĐÚNG màu xanh để cả lớp học hỏi, sau đó chuyển sang câu tiếp.
   - **Mỗi câu hỏi riêng biệt**: Cuộc thi sẽ đi qua trọn vẹn cả 10 câu để cả lớp đều được tham gia thảo luận.

4. **2 Quyền trợ giúp (Chỉ dùng tại Câu 8 và Câu 9):**
   - `50:50`: Loại bỏ 2 phương án sai ngẫu nhiên.
   - `Khán giả`: Mở biểu đồ cột thăm dò ý kiến sinh viên trong hội trường.
   - *(Quyền trợ giúp tự động khóa ở các câu 1-7 và câu 10, chỉ mở khóa kích hoạt tại Câu 8 và Câu 9).*

---

## 📝 Tùy chỉnh câu hỏi và tiền thưởng (`questions.js`)

Mở file `questions.js`, bạn có thể tùy chỉnh mảng `QUESTIONS_BANK` và mảng `PRIZE_VALUES` theo ý muốn:

```javascript
// Danh sách mức thưởng sinh viên
const PRIZE_VALUES = [
  "1 kẹo mút",
  "2.000 VNĐ",
  "3.000 VNĐ",
  "5.000 VNĐ",
  "10.000 VNĐ",      // Mốc an toàn số 5
  "15.000 VNĐ",
  "20.000 VNĐ",
  "25.000 VNĐ",
  "30.000 VNĐ",
  "50.000 VNĐ"       // Mốc tối cao số 10
];
```

---
*Chúc nhóm có một buổi thuyết trình môn Tư tưởng Hồ Chí Minh thật thành công rực rỡ!* ⭐⭐⭐⭐⭐
