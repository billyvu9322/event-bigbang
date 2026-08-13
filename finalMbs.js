(function scheduleMbsTask() {
    // 1. THÔNG TIN CẤU HÌNH (Đã cập nhật ID mới nhất)
    const CONFIG = {
        EVENT_ID: "evt-06fr3rtoss5vc",
        OCC_ID: "occ-06fr3rxvshj98", // Đêm 1 (24/10). Đêm 2 là: occ-06fr3s31pdt7c
        MY_CODE: "NHẬP_MÃ_CỦA_BẠN",
        TARGET_HOUR: 9,
        TARGET_MINUTE: 59,
        TARGET_SECOND: 50,
        INTERVAL_MS: 500 // Tốc độ thử lại (0.5 giây/lần)
    };

    console.log(`%c[TIMER] Script đã nạp. Đang đợi đến ${CONFIG.TARGET_HOUR}:${CONFIG.TARGET_MINUTE}:${CONFIG.TARGET_SECOND}...`, "color: #007bff; font-weight: bold;");

    // 2. Hàm thực thi gửi API
    const trigger = async () => {
        try {
            const res = await fetch(`https://cticket.vn/tix/public/events/${CONFIG.EVENT_ID}/verify-entry-code`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ 
                    code: CONFIG.MY_CODE,
                    occurrence_id: CONFIG.OCC_ID 
                })
            });

            const data = await res.json();
            const queueUrl = data.queue_url || data.redirect_url || (data.data && data.data.url);

            if (queueUrl) {
                console.log("%c🔥 ĐÃ VÀO QUEUE! Đang chuyển hướng...", "color: orange; font-weight: bold;");
                window.location.href = queueUrl;
                return true;
            } 
            
            if (res.ok) {
                console.log("%c✅ THÀNH CÔNG: Đang vào Seatmap...", "color: green; font-weight: bold;");
                window.location.reload();
                return true;
            }

            console.log(`[${new Date().toLocaleTimeString()}] ⏳ Đang đợi server mở... (${data.message || 'Locked'})`);
            return false;
        } catch (e) {
            return false;
        }
    };

    // 3. Logic kiểm tra thời gian
    const checkTimer = setInterval(async () => {
        const now = new Date();
        
        if (now.getHours() === CONFIG.TARGET_HOUR && 
            now.getMinutes() === CONFIG.TARGET_MINUTE && 
            now.getSeconds() >= CONFIG.TARGET_SECOND) {
            
            console.log("%c🚀 ĐẾN GIỜ G! Bắt đầu chạy Interval API...", "color: #ff0000; font-weight: bold;");
            clearInterval(checkTimer); // Dừng việc kiểm tra giờ

            // Bắt đầu vòng lặp gửi API
            const apiTask = setInterval(async () => {
                const isDone = await trigger();
                if (isDone) clearInterval(apiTask);
            }, CONFIG.INTERVAL_MS);
        }
    }, 1000); // Kiểm tra giờ mỗi giây
})();