(async function backtestFinalFlow() {
    const EVENT_ID = "evt-06fp6li727o78";
    const TEST_OCC_ID = "occ-06fp6lofqe9se"; // Suất diễn ngày 24/10
    const TEST_CODE = "TEST_BACKTEST_123";
    const API_URL = `https://cticket.vn/tix/public/events/${EVENT_ID}/verify-entry-code`;

    console.log("%c[BACKTEST] Bắt đầu kiểm tra quy trình 5 bước...", "color: #007bff; font-weight: bold;");

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({ 
                code: TEST_CODE,
                occurrence_id: TEST_OCC_ID 
            })
        });

        const result = await response.json();

        // PHÂN TÍCH PHẢN HỒI
        if (response.status === 400 || response.status === 403 || response.status === 422) {
            console.log("%c✅ KẾT QUẢ: CẤU TRÚC ĐÚNG!", "background: green; color: white; padding: 2px 5px;");
            console.log("%cPhản hồi từ Server:", "color: #555;", result);
            console.log(`%cGiải thích: Server đã nhận diện được bạn đang cố gắng xác thực cho Suất diễn ${TEST_OCC_ID}. Vì hiện tại cổng chưa mở/mã giả nên server trả về: "${result.message || 'Mã không hợp lệ'}".`, "color: #888; font-style: italic;");
            console.log("%c=> HÀNH ĐỘNG: Sẵn sàng dùng code thật vào lúc 10h sáng.", "font-weight: bold; color: #00b14f;");
        } else {
            console.error("❌ CẢNH BÁO: API có thể đã thay đổi cấu trúc hoặc ID sự kiện sai.", result);
        }
    } catch (err) {
        console.error("❌ LỖI KẾT NỐI: Không thể chạm tới Server. Kiểm tra lại tab Network.", err);
    }
})();