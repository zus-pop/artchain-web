# Chính Sách Ví Và Điều Khoản Đấu Giá

## 1. Mục đích và phạm vi
Tài liệu này quy định cơ chế sử dụng ví nội bộ, khóa tiền, hoàn tiền và khấu trừ phí trong quá trình tham gia đấu giá tác phẩm trên nền tảng.

Áp dụng cho:
- Người tham gia đấu giá (bên mua).
- Người sở hữu tác phẩm (bên bán).
- Các đơn hàng phát sinh từ kết quả đấu giá thành công.

## 2. Nguyên tắc thanh toán qua ví nội bộ
- Nền tảng không sử dụng thanh toán ngoài tại bước chốt đơn đấu giá.
- Khi người dùng thắng đấu giá, hệ thống tự động khóa tiền trong ví theo giá trúng đấu cộng các khoản phí liên quan (nếu có).
- Tiền khóa được giữ tạm thời cho tới khi đơn hoàn tất hoặc bị hủy theo điều khoản.

## 3. Luồng xử lý đơn đấu giá
1. Thắng đấu giá (khóa ví).
2. Người thắng xác nhận nhận hàng trong thời hạn quy định.
3. Kiểm định và niêm phong tác phẩm.
4. Vận chuyển chuyên dụng.
5. Giao hàng và xác nhận hoàn tất.

## 4. Xác nhận nhận hàng và từ chối nhận
### 4.1 Thời hạn xác nhận
- Người thắng đấu giá phải xác nhận nhận hàng trong vòng 24 giờ kể từ khi hệ thống phát thông báo.
- Quá thời hạn mà không xác nhận, hệ thống có thể tự động xử lý theo chính sách hủy nhận.

### 4.2 Từ chối nhận trước khi vận chuyển
- Nếu người thắng từ chối nhận sau khi đã chốt đấu giá, khoản khóa ví được hoàn lại sau khi trừ phí vi phạm.
- Mức khấu trừ mặc định: 12% giá trúng đấu.

Công thức tham chiếu:
- Số tiền hoàn ví = Giá trúng đấu - (Giá trúng đấu x 12%) - các chi phí đã phát sinh (nếu có).

### 4.3 Từ chối nhận sau khi đã phát sinh vận chuyển/kiểm định
- Ngoài phí vi phạm, người dùng chịu thêm chi phí thực tế đã phát sinh gồm:
- Phí kiểm định, đóng gói, bảo hiểm, vận chuyển 1 chiều hoặc 2 chiều (nếu hoàn trả).

## 5. Hoàn ví và thời gian xử lý
- Các khoản hoàn ví được xử lý về ví nội bộ của tài khoản thắng đấu giá.
- Thời gian hoàn: từ 1 đến 7 ngày làm việc, tùy mức độ đối soát.
- Trường hợp cần kiểm tra gian lận hoặc tranh chấp, thời gian xử lý có thể kéo dài hơn.

## 6. Điều kiện miễn/giảm phí vi phạm
Nền tảng có thể xem xét miễn hoặc giảm phí vi phạm trong các trường hợp:
- Tác phẩm không đúng mô tả đã công bố.
- Tác phẩm hư hỏng do lỗi đóng gói, vận chuyển từ phía đơn vị vận hành.
- Lỗi kỹ thuật hệ thống ảnh hưởng trực tiếp đến kết quả đấu giá.

## 7. Tranh chấp và khiếu nại
- Người dùng gửi khiếu nại trong thời hạn 72 giờ kể từ thời điểm phát sinh sự kiện.
- Cần cung cấp bằng chứng (hình ảnh, video mở kiện, thông tin vận đơn, biên bản nhận hàng).
- Quyết định cuối cùng dựa trên dữ liệu hệ thống, chứng từ vận hành và biên bản xác minh.

## 8. Hiệu lực và cập nhật
- Chính sách có hiệu lực ngay khi được công bố trên nền tảng.
- Nền tảng có quyền cập nhật chính sách theo từng giai đoạn vận hành.
- Khi thay đổi quan trọng (như tỷ lệ khấu trừ), hệ thống sẽ thông báo trước cho người dùng.

## 9. Gợi ý cấu hình kỹ thuật
- `REFUND_PENALTY_PERCENT=12`
- `BUYER_CONFIRM_TIMEOUT_HOURS=24`
- `REFUND_PROCESSING_MIN_DAYS=1`
- `REFUND_PROCESSING_MAX_DAYS=7`

---

Nếu cần, có thể tách tài liệu này thành:
- Điều khoản pháp lý cho người dùng (phiên bản công khai).
- Tài liệu vận hành nội bộ cho đội CS/ops (phiên bản nghiệp vụ chi tiết).
