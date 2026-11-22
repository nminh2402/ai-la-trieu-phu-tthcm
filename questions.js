/**
 * ============================================================================
 * NGÂN HÀNG CÂU HỎI MÔN HỌC: TƯ TƯỞNG HỒ CHÍ MINH
 * Chủ đề: ĐẠI ĐOÀN KẾT TOÀN DÂN TỘC & ĐOÀN KẾT QUỐC TẾ
 * (Kèm phần liên hệ thực tiễn Học viện Công nghệ Bưu chính Viễn thông - PTIT)
 * Nguồn: Tài liệu thuyết trình chính thức của nhóm
 * ============================================================================
 */

const QUESTIONS_BANK = [
  {
    id: 1,
    category: "NHẬN BIẾT",
    question: "Theo tư tưởng Hồ Chí Minh, đại đoàn kết toàn dân tộc có vai trò gì đối với sự nghiệp cách mạng Việt Nam?",
    options: {
      A: "Vấn đề chiến lược",
      B: "Thủ đoạn nhất thời",
      C: "Biện pháp tình thế",
      D: "Sách lược ngoại giao"
    },
    correct: "A",
    explanation: "Hồ Chí Minh khẳng định đại đoàn kết toàn dân tộc không phải là thủ đoạn chính trị nhất thời mà là vấn đề có ý nghĩa chiến lược, quyết định thành công của cách mạng.",
    audiencePoll: { A: 82, B: 6, C: 8, D: 4 }
  },
  {
    id: 2,
    category: "NHẬN BIẾT",
    question: "Trong tư tưởng Hồ Chí Minh, lực lượng nào là nền tảng (nòng cốt) của khối đại đoàn kết toàn dân tộc?",
    options: {
      A: "Công nhân - Nông dân - Trí thức",
      B: "Tư sản - Tiểu tư sản - Địa chủ",
      C: "Công nhân - Doanh nhân - Kiều bào",
      D: "Nông dân - Binh lính - Nhân sĩ"
    },
    correct: "A",
    explanation: "Khối đại đoàn kết toàn dân tộc bao gồm mọi người Việt Nam yêu nước, nhưng lấy liên minh giai cấp công nhân với giai cấp nông dân và đội ngũ trí thức làm nền tảng vững chắc.",
    audiencePoll: { A: 88, B: 4, C: 5, D: 3 }
  },
  {
    id: 3,
    category: "NHẬN BIẾT",
    question: "Trong tư tưởng Hồ Chí Minh, tổ chức nào giữ vai trò là hạt nhân lãnh đạo của khối đại đoàn kết toàn dân tộc?",
    options: {
      A: "Đảng Cộng sản Việt Nam",
      B: "Hội Phản đế đồng minh",
      C: "Mặt trận Liên Việt",
      D: "Chính phủ lâm thời"
    },
    correct: "A",
    explanation: "Trong hệ thống lực lượng đại đoàn kết toàn dân tộc, Đảng Cộng sản Việt Nam giữ vai trò là hạt nhân lãnh đạo; sự đoàn kết, thống nhất bên trong nội bộ Đảng là cơ sở, tiền đề để quy tụ sự đoàn kết của toàn xã hội.",
    audiencePoll: { A: 85, B: 6, C: 5, D: 4 }
  },
  {
    id: 4,
    category: "THÔNG HIỂU",
    question: "Câu nói nổi tiếng: \"Đoàn kết, đoàn kết, đại đoàn kết. Thành công, thành công, đại thành công\" được Hồ Chí Minh phát biểu vào năm nào?",
    options: {
      A: "Năm 1945",
      B: "Năm 1951",
      C: "Năm 1954",
      D: "Năm 1969"
    },
    correct: "B",
    explanation: "Câu nói kinh điển này được Chủ tịch Hồ Chí Minh phát biểu trong lời bế mạc Đại hội đại biểu toàn quốc lần thứ II của Mặt trận Liên Việt (tháng 3/1951).",
    audiencePoll: { A: 14, B: 76, C: 6, D: 4 }
  },
  {
    id: 5,
    category: "THÔNG HIỂU [MỐC AN TOÀN]",
    question: "Trong tư tưởng Hồ Chí Minh về đoàn kết quốc tế, lực lượng nào giữ vai trò nòng cốt đối với phong trào cách mạng thế giới?",
    options: {
      A: "Phong trào công nhân quốc tế",
      B: "Phong trào Không liên kết",
      C: "Các tổ chức phi chính phủ",
      D: "Các quốc gia trung lập"
    },
    correct: "A",
    explanation: "Trong ba dòng thác cách mạng cần đoàn kết quốc tế, Hồ Chí Minh xác định phong trào cộng sản và công nhân quốc tế là lực lượng nòng cốt, giữ vai trò quyết định.",
    audiencePoll: { A: 78, B: 10, C: 7, D: 5 }
  },
  {
    id: 6,
    category: "THÔNG HIỂU",
    question: "Hồ Chí Minh đã vận dụng và phát triển luận điểm của nhà lãnh đạo cách mạng vô sản nào khi đề ra khẩu hiệu: \"Vô sản tất cả các nước và các dân tộc bị áp bức, đoàn kết lại\"?",
    options: {
      A: "V.I. Lênin",
      B: "G. Đimitơrốp",
      C: "M. Tơrêdơ",
      D: "K. Liebknecht"
    },
    correct: "A",
    explanation: "Xuất phát từ khẩu hiệu chiến lược của V.I. Lênin và Quốc tế Cộng sản (\"Vô sản tất cả các nước và các dân tộc bị áp bức, đoàn kết lại\"), Hồ Chí Minh đã cụ thể hóa và phát triển thành tư tưởng gắn kết chặt chẽ cách mạng giải phóng dân tộc thuộc địa với cách mạng vô sản thế giới.",
    audiencePoll: { A: 84, B: 6, C: 5, D: 5 }
  },
  {
    id: 7,
    category: "VẬN DỤNG",
    question: "Tổ chức mặt trận đầu tiên do Nguyễn Ái Quốc - Hồ Chí Minh cùng Trung ương Đảng thành lập vào ngày 18/11/1930 có tên gọi là gì?",
    options: {
      A: "Hội Phản đế đồng minh",
      B: "Mặt trận Việt Minh",
      C: "Mặt trận Liên Việt",
      D: "Mặt trận Dân chủ Đông Dương"
    },
    correct: "A",
    explanation: "Ngày 18/11/1930, Ban Thường vụ Trung ương Đảng ra Chỉ thị về việc thành lập Hội Phản đế đồng minh – hình thức tổ chức mặt trận dân tộc thống nhất đầu tiên của cách mạng Việt Nam (ngày 18/11 sau này trở thành Ngày Truyền thống Mặt trận Tổ quốc Việt Nam).",
    audiencePoll: { A: 73, B: 15, C: 8, D: 4 }
  },
  {
    id: 8,
    category: "VẬN DỤNG",
    question: "Nhà lãnh đạo nước ngoài nào từng đưa ra tuyên bố nổi tiếng thể hiện tình đoàn kết quốc tế với Việt Nam: \"Vì Việt Nam, Cuba sẵn sàng hiến dâng cả máu của mình\"?",
    options: {
      A: "Fidel Castro",
      B: "Olof Palme",
      C: "Henri Martin",
      D: "V.I. Lênin"
    },
    correct: "A",
    explanation: "Chủ tịch Cuba Fidel Castro đã đưa ra tuyên bố bất hủ \"Vì Việt Nam, Cuba sẵn sàng hiến dâng cả máu của mình\", thể hiện đỉnh cao của tình đoàn kết quốc tế trong sáng và sự ủng hộ mạnh mẽ của nhân dân thế giới đối với cuộc kháng chiến chống Mỹ của Việt Nam.",
    audiencePoll: { A: 92, B: 3, C: 3, D: 2 }
  },
  {
    id: 9,
    category: "VẬN DỤNG CAO",
    question: "Hội nghị thành lập Mặt trận Việt Nam Độc lập Đồng minh (Việt Minh) theo sáng kiến của Nguyễn Ái Quốc diễn ra vào thời gian nào?",
    options: {
      A: "Tháng 5/1941",
      B: "Tháng 8/1945",
      C: "Tháng 2/1930",
      D: "Tháng 3/1951"
    },
    correct: "A",
    explanation: "Tại Hội nghị Trung ương lần thứ 8 (tháng 5/1941) ở Pác Bó (Cao Bằng) do Nguyễn Ái Quốc chủ trì, Đảng quyết định thành lập Mặt trận Việt Minh nhằm tập hợp rộng rãi mọi tầng lớp nhân dân cho nhiệm vụ giải phóng dân tộc.",
    audiencePoll: { A: 79, B: 11, C: 6, D: 4 }
  },
  {
    id: 10,
    category: "LIÊN HỆ THỰC TIỄN PTIT [MỐC 10]",
    question: "Trong hoạt động hợp tác quốc tế của sinh viên PTIT được nêu trong bài, dự án chung với Viện Công nghệ Fukuoka (Nhật Bản) phát triển ứng dụng hướng dẫn du lịch Hà Nội có tên là gì?",
    options: {
      A: "WanderLust",
      B: "GreenVision",
      C: "Lysia",
      D: "Howest Global"
    },
    correct: "A",
    explanation: "Trong dự án hợp tác chung giữa sinh viên PTIT và Viện Công nghệ Fukuoka (Nhật Bản) công bố tháng 3/2025, các nhóm sinh viên hai nước đã phát triển ba sản phẩm công nghệ, trong đó WanderLust là ứng dụng hướng dẫn du lịch Hà Nội, thể hiện sự kết hợp giữa hiểu biết địa phương của sinh viên Việt Nam và góc nhìn của bạn bè quốc tế.",
    audiencePoll: { A: 81, B: 8, C: 6, D: 5 }
  },
  // Câu hỏi dự phòng (sử dụng khi người chơi dùng quyền trợ giúp ĐỔI CÂU HỎI)
  {
    id: 11,
    category: "CÂU HỎI DỰ PHÒNG",
    question: "Theo tư tưởng Hồ Chí Minh, mẫu số chung để quy tụ mọi người Việt Nam vào khối đại đoàn kết toàn dân tộc là gì?",
    options: {
      A: "Độc lập dân tộc gắn liền với tự do, hạnh phúc của nhân dân",
      B: "Xóa bỏ hoàn toàn các giai cấp bóc lột và tư hữu",
      C: "Xây dựng nền kinh tế công nghiệp nặng hiện đại",
      D: "Thực hiện phân phối bình quân tư liệu sản xuất"
    },
    correct: "A",
    explanation: "Hồ Chí Minh chỉ rõ: Điểm chung để tập hợp toàn thể dân tộc chính là khát vọng độc lập, tự do cho Tổ quốc và hạnh phúc cho đồng bào.",
    audiencePoll: { A: 88, B: 5, C: 4, D: 3 }
  }
];

// Danh sách tiền thưởng tương ứng 10 câu (Đã giữ nguyên danh sách tùy chỉnh của bạn)
const PRIZE_VALUES = [
  "1 kẹo mút",
  "2 kẹo mút",
  "3 kẹo mút",
  "5.000 VNĐ",
  "5.000 VNĐ",      // Mốc an toàn số 5
  "10.000 VNĐ",
  "15.000 VNĐ",
  "20.000 VNĐ",
  "25.000 VNĐ",
  "30.000 VNĐ"       // Mốc tối cao số 10
];
