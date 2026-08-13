js
(function ultimateMbsTrigger() {
    const CONFIG = {
        EVENT_ID: "evt-06fr3rtoss5vc",
        OCC_ID: "occ-06fr3rxvshj98",
        MY_CODE: "NHẬP_MÃ_CỦA_BẠN",
        API_META: "https://cticket.vn/tix/public/events/v2/bigbang2026worldtourinhanoi-tickets",
        API_VERIFY: "https://cticket.vn/tix/public/events/evt-06fr3rtoss5vc/verify-entry-code"
    };

    console.log("%c[SYSTEM] Đang đọc cấu hình Phase từ Server...", "color: #007bff;");

    const executeVerify = () => {
        console.log("%c🚀 ĐẾN GIỜ MỞ BÁN! Bắt đầu xác thực...", "color: #ff0000; font-weight: bold;");
        const task = setInterval(async () => {
            try {
                const res = await fetch(CONFIG.API_VERIFY, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                    body: JSON.stringify({ code: CONFIG.MY_CODE, occurrence_id: CONFIG.OCC_ID })
                });
                const data = await res.json();
                if (data?.queue_url || data?.redirect_url || res.ok) {
                    clearInterval(task);
                    window.location.href = data?.queue_url || data?.redirect_url || window.location.href;
                }
                console.log("⏳ Server đang xử lý...");
            } catch (e) {}
        }, 400);
    };

    const monitor = setInterval(async () => {
        try {
            const res = await fetch(`${CONFIG.API_META}?t=${Date.now()}`);
            const data = await res.json();
            
            // Tìm phase Membership (MBS)
            const mbsPhase = data.selling_phases.find(p => p.name.includes("MBS") || p.id === 564);
            if (!mbsPhase) return console.error("Không tìm thấy Phase MBS!");

            const startTime = new Date(mbsPhase.start_time).getTime();
            const now = Date.now();

            if (now >= startTime) {
                clearInterval(monitor);
                executeVerify();
            } else {
                const countdown = Math.round((startTime - now) / 1000);
                console.log(`[${new Date().toLocaleTimeString()}] Đang đợi Phase MBS mở sau: ${countdown} giây...`);
            }
        } catch (e) {
            console.warn("Lỗi kết nối API Monitor.");
        }
    }, 1000);
})();