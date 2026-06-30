// ============================================================
// TCSA – Extended Mock Data
// ============================================================

export const statsData = {
  totalMessages: 48_320,
  toxicMessages: 3_847,
  positive: 28_512,
  negative: 5_961,
  neutral: 9_847,
};

export const sentimentData = [
  { name: 'Tích cực', value: 59, color: '#22c55e' },
  { name: 'Trung tính', value: 28, color: '#3b82f6' },
  { name: 'Tiêu cực', value: 13, color: '#ef4444' },
];

export const toxicLineData = [
  { time: '00:00', toxic: 12, clean: 88 },
  { time: '02:00', toxic: 8, clean: 72 },
  { time: '04:00', toxic: 5, clean: 55 },
  { time: '06:00', toxic: 20, clean: 120 },
  { time: '08:00', toxic: 45, clean: 280 },
  { time: '10:00', toxic: 78, clean: 450 },
  { time: '12:00', toxic: 120, clean: 620 },
  { time: '14:00', toxic: 95, clean: 580 },
  { time: '16:00', toxic: 110, clean: 540 },
  { time: '18:00', toxic: 143, clean: 710 },
  { time: '20:00', toxic: 98, clean: 490 },
  { time: '22:00', toxic: 62, clean: 320 },
];

export const weeklyData = [
  { day: 'Thứ 2', toxic: 320, clean: 1240, positive: 680, neutral: 340 },
  { day: 'Thứ 3', toxic: 280, clean: 1520, positive: 820, neutral: 420 },
  { day: 'Thứ 4', toxic: 410, clean: 1180, positive: 590, neutral: 380 },
  { day: 'Thứ 5', toxic: 390, clean: 1340, positive: 720, neutral: 310 },
  { day: 'Thứ 6', toxic: 520, clean: 1680, positive: 910, neutral: 460 },
  { day: 'Thứ 7', toxic: 480, clean: 1890, positive: 1050, neutral: 520 },
  { day: 'CN', toxic: 350, clean: 2100, positive: 1240, neutral: 590 },
];

export const topNegativeKeywords = [
  { rank: 1, keyword: 'ghét', count: 1_842, trend: 'up' },
  { rank: 2, keyword: 'ngu', count: 1_537, trend: 'up' },
  { rank: 3, keyword: 'xấu xa', count: 1_204, trend: 'down' },
  { rank: 4, keyword: 'phản bội', count: 983, trend: 'stable' },
  { rank: 5, keyword: 'tệ', count: 876, trend: 'up' },
  { rank: 6, keyword: 'lừa đảo', count: 754, trend: 'up' },
  { rank: 7, keyword: 'vô dụng', count: 692, trend: 'down' },
  { rank: 8, keyword: 'chán', count: 631, trend: 'stable' },
  { rank: 9, keyword: 'thất vọng', count: 578, trend: 'down' },
  { rank: 10, keyword: 'kinh khủng', count: 445, trend: 'stable' },
];

export const recentActivity = [
  { id: 1, type: 'toxic', text: 'Phát hiện bình luận độc hại từ user_troll_99', time: '2 phút trước', color: '#ef4444' },
  { id: 2, type: 'approved', text: 'Bài đăng được duyệt: "Sản phẩm tuyệt vời..."', time: '5 phút trước', color: '#22c55e' },
  { id: 3, type: 'alert', text: 'Tỷ lệ toxic tăng 12% trong livestream', time: '8 phút trước', color: '#f59e0b' },
  { id: 4, type: 'deleted', text: 'Đã xóa 3 bình luận vi phạm từ post #2841', time: '12 phút trước', color: '#ef4444' },
  { id: 5, type: 'system', text: 'AI Model v2.4 cập nhật thành công', time: '18 phút trước', color: '#3b82f6' },
  { id: 6, type: 'toxic', text: 'Banned user: spam_bot_123 (5 vi phạm)', time: '25 phút trước', color: '#ef4444' },
];

export const recentDetections = [
  { id: 1, user: 'user_troll_99', content: 'Ngu vậy mà cũng livestream...', score: 0.94, sentiment: 'negative', time: '2 phút trước', avatarColor: '#ef4444', avatar: 'UT' },
  { id: 2, user: 'anon_hater', content: 'Lừa đảo khách hàng trắng trợn!', score: 0.88, sentiment: 'negative', time: '7 phút trước', avatarColor: '#f59e0b', avatar: 'AH' },
  { id: 3, user: 'spam_bot_123', content: 'Xấu xa, kinh khủng, vô dụng!', score: 0.97, sentiment: 'negative', time: '15 phút trước', avatarColor: '#6366f1', avatar: 'SB' },
];

export const commentsData = [
  {
    id: 1,
    user: 'Nguyễn Văn An',
    avatar: 'NA',
    avatarColor: '#3b82f6',
    content: 'Sản phẩm này thật tuyệt vời! Tôi rất hài lòng với chất lượng và dịch vụ khách hàng. Sẽ mua lại lần sau.',
    sentiment: 'positive',
    toxicScore: 0.03,
    isToxic: false,
    time: '2 phút trước',
    platform: 'Facebook',
  },
  {
    id: 2,
    user: 'Trần Thị Bảo',
    avatar: 'TB',
    avatarColor: '#8b5cf6',
    content: 'Ngu quá mà còn bán đắt, đồ lừa đảo mấy thứ này vứt đi cho rồi!!! Kinh khủng thật sự.',
    sentiment: 'negative',
    toxicScore: 0.94,
    isToxic: true,
    time: '5 phút trước',
    platform: 'YouTube',
  },
  {
    id: 3,
    user: 'Lê Minh Cường',
    avatar: 'MC',
    avatarColor: '#22c55e',
    content: 'Giao hàng đúng hẹn, đóng gói cẩn thận. Lần sau sẽ mua tiếp. Cảm ơn shop!',
    sentiment: 'positive',
    toxicScore: 0.05,
    isToxic: false,
    time: '12 phút trước',
    platform: 'TikTok',
  },
  {
    id: 4,
    user: 'Phạm Quốc Dũng',
    avatar: 'QD',
    avatarColor: '#f59e0b',
    content: 'Sản phẩm bình thường, không có gì đặc biệt nhưng cũng chấp nhận được với mức giá này.',
    sentiment: 'neutral',
    toxicScore: 0.08,
    isToxic: false,
    time: '18 phút trước',
    platform: 'Facebook',
  },
  {
    id: 5,
    user: 'Hoàng Thị Emmi',
    avatar: 'HE',
    avatarColor: '#ef4444',
    content: 'Thật sự thất vọng, shop này xấu xa và lừa đảo khách hàng trắng trợn! Phản bội lòng tin!',
    sentiment: 'negative',
    toxicScore: 0.88,
    isToxic: true,
    time: '25 phút trước',
    platform: 'Instagram',
  },
  {
    id: 6,
    user: 'Vũ Đức Phát',
    avatar: 'DP',
    avatarColor: '#06b6d4',
    content: 'Cảm ơn shop đã hỗ trợ nhiệt tình. Sản phẩm đúng như mô tả, chất lượng tốt!',
    sentiment: 'positive',
    toxicScore: 0.02,
    isToxic: false,
    time: '31 phút trước',
    platform: 'TikTok',
  },
  {
    id: 7,
    user: 'Đỗ Thị Giao',
    avatar: 'TG',
    avatarColor: '#ec4899',
    content: 'Vô dụng, kinh khủng! Tệ nhất tôi từng dùng, phản bội lòng tin khách hàng hoàn toàn.',
    sentiment: 'negative',
    toxicScore: 0.97,
    isToxic: true,
    time: '40 phút trước',
    platform: 'YouTube',
  },
  {
    id: 8,
    user: 'Bùi Văn Hải',
    avatar: 'VH',
    avatarColor: '#84cc16',
    content: 'Chất lượng ổn, giá cả hợp lý. Tuy nhiên thời gian giao hàng hơi chậm so với cam kết.',
    sentiment: 'neutral',
    toxicScore: 0.11,
    isToxic: false,
    time: '55 phút trước',
    platform: 'Facebook',
  },
  {
    id: 9,
    user: 'Ngô Thị Iris',
    avatar: 'TI',
    avatarColor: '#0ea5e9',
    content: 'Rất hài lòng! Mua lần thứ 3 rồi và vẫn tuyệt như vậy. Recommend mọi người nên thử.',
    sentiment: 'positive',
    toxicScore: 0.01,
    isToxic: false,
    time: '1 giờ trước',
    platform: 'Instagram',
  },
  {
    id: 10,
    user: 'Trịnh Văn Kiên',
    avatar: 'VK',
    avatarColor: '#a855f7',
    content: 'Ghét cái shop này vl, mua một lần là biết liền thôi. Ngu mới mua hàng ở đây.',
    sentiment: 'negative',
    toxicScore: 0.91,
    isToxic: true,
    time: '1 giờ trước',
    platform: 'TikTok',
  },
];

export const chatMessages = [
  { id: 1, user: 'user_alpha', avatar: 'UA', avatarColor: '#3b82f6', content: 'Livestream này hay quá, tiếp tục đi bạn!', isToxic: false, time: '20:30:01' },
  { id: 2, user: 'toxic_user_1', avatar: 'TU', avatarColor: '#ef4444', content: 'Ngu vậy mà cũng livestream, xấu xa thật sự', isToxic: true, toxicWords: ['ngu', 'xấu xa'], time: '20:30:04' },
  { id: 3, user: 'peaceful_rose', avatar: 'PR', avatarColor: '#22c55e', content: 'Cảm ơn bạn đã chia sẻ, rất bổ ích!', isToxic: false, time: '20:30:08' },
  { id: 4, user: 'viewer_99', avatar: 'V9', avatarColor: '#8b5cf6', content: 'Shop này lừa đảo không? Ai mua rồi review đi', isToxic: true, toxicWords: ['lừa đảo'], time: '20:30:12' },
  { id: 5, user: 'fan_minh', avatar: 'FM', avatarColor: '#f59e0b', content: 'Ủng hộ bạn 100% luôn, keep it up!', isToxic: false, time: '20:30:16' },
  { id: 6, user: 'hater_anon', avatar: 'HA', avatarColor: '#ef4444', content: 'Kinh khủng quá, vô dụng hết sức đi thôi', isToxic: true, toxicWords: ['kinh khủng', 'vô dụng'], time: '20:30:20' },
  { id: 7, user: 'sunshine_le', avatar: 'SL', avatarColor: '#06b6d4', content: 'Mình mới đăng ký kênh, nội dung quá chất!', isToxic: false, time: '20:30:25' },
  { id: 8, user: 'curious_cat', avatar: 'CC', avatarColor: '#ec4899', content: 'Bao giờ có flash sale vậy bạn?', isToxic: false, time: '20:30:29' },
];

export const newChatMessages = [
  { id: 9, user: 'dragon_vn', avatar: 'DV', avatarColor: '#84cc16', content: 'Hay lắm, chia sẻ thêm đi!', isToxic: false },
  { id: 10, user: 'anon_troll', avatar: 'AT', avatarColor: '#ef4444', content: 'Ghét kiểu livestream tệ như này lắm', isToxic: true, toxicWords: ['ghét', 'tệ'] },
  { id: 11, user: 'happy_viewer', avatar: 'HV', avatarColor: '#3b82f6', content: 'Màn hình rõ nét ghê, mình xem cả tiếng rồi', isToxic: false },
  { id: 12, user: 'spam_bot', avatar: 'SB', avatarColor: '#ef4444', content: 'Phản bội fan, xấu xa không thể tả được!', isToxic: true, toxicWords: ['phản bội', 'xấu xa'] },
  { id: 13, user: 'viet_pro', avatar: 'VP', avatarColor: '#22c55e', content: 'Cộng đồng này rất thân thiện, thích lắm!', isToxic: false },
  { id: 14, user: 'dark_anon', avatar: 'DA', avatarColor: '#6366f1', content: 'Nội dung ổn nhưng âm thanh hơi nhỏ bạn ơi', isToxic: false },
  { id: 15, user: 'rage_user', avatar: 'RU', avatarColor: '#ef4444', content: 'Ngu thật sự, lừa đảo người xem hoài!', isToxic: true, toxicWords: ['ngu', 'lừa đảo'] },
  { id: 16, user: 'cheerful_99', avatar: 'C9', avatarColor: '#f59e0b', content: 'Đỉnh lắm, xem mãi không chán!', isToxic: false },
  { id: 17, user: 'bad_actor', avatar: 'BA', avatarColor: '#ef4444', content: 'Vô dụng, tệ quá mức có thể tưởng tượng!', isToxic: true, toxicWords: ['vô dụng', 'tệ'] },
  { id: 18, user: 'nice_person', avatar: 'NP', avatarColor: '#22c55e', content: 'Love this content! 💙', isToxic: false },
];

export const toxicWords = ['ngu', 'xấu xa', 'lừa đảo', 'ghét', 'kinh khủng', 'vô dụng', 'phản bội', 'tệ', 'thất vọng', 'chán'];

// Analytics data
export const analyticsHeatmap = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 24 }, (_, hour) => {
    const base = Math.random() * 50;
    const peak = (hour >= 8 && hour <= 22) ? Math.random() * 120 : base;
    return { day, hour, value: Math.round(peak) };
  })
);

export const categoryData = [
  { name: 'Hate Speech', count: 1240, color: '#ef4444' },
  { name: 'Spam', count: 890, color: '#f59e0b' },
  { name: 'Harassment', count: 654, color: '#8b5cf6' },
  { name: 'Misinformation', count: 423, color: '#06b6d4' },
  { name: 'Violence', count: 312, color: '#ec4899' },
  { name: 'Adult Content', count: 189, color: '#f97316' },
];

export const recentLogs = [
  { id: 1, time: '21:34', user: 'toxic_user_99', content: 'Ngu vậy mà cũng...', score: 0.94, status: 'blocked', sentiment: 'negative' },
  { id: 2, time: '21:33', user: 'spam_bot_x', content: 'Mua ngay đi, giảm giá...', score: 0.71, status: 'flagged', sentiment: 'neutral' },
  { id: 3, time: '21:31', user: 'hater_anon', content: 'Xấu xa, kinh khủng!', score: 0.97, status: 'blocked', sentiment: 'negative' },
  { id: 4, time: '21:28', user: 'nice_user_1', content: 'Rất tuyệt vời luôn!', score: 0.02, status: 'approved', sentiment: 'positive' },
  { id: 5, time: '21:25', user: 'review_bot', content: 'Lừa đảo shop này...', score: 0.86, status: 'blocked', sentiment: 'negative' },
  { id: 6, time: '21:22', user: 'user_minh', content: 'Cảm ơn team đã làm!', score: 0.03, status: 'approved', sentiment: 'positive' },
  { id: 7, time: '21:19', user: 'angry_fan', content: 'Ghét mấy thứ này...', score: 0.79, status: 'flagged', sentiment: 'negative' },
  { id: 8, time: '21:15', user: 'neutral_guy', content: 'Sản phẩm tạm được', score: 0.12, status: 'approved', sentiment: 'neutral' },
];

export const topActiveUsers = [
  { rank: 1, name: 'toxic_user_99', avatar: 'TU', avatarColor: '#ef4444', violations: 42, status: 'banned' },
  { rank: 2, name: 'spam_bot_x', avatar: 'SB', avatarColor: '#f59e0b', violations: 31, status: 'flagged' },
  { rank: 3, name: 'hater_anon', avatar: 'HA', avatarColor: '#8b5cf6', violations: 28, status: 'banned' },
  { rank: 4, name: 'angry_fan_vn', avatar: 'AF', avatarColor: '#f97316', violations: 19, status: 'flagged' },
  { rank: 5, name: 'review_spammer', avatar: 'RS', avatarColor: '#ec4899', violations: 14, status: 'warned' },
];
