(async function finalMbsFastPass() {
    const EVENT_ID = "evt-06fp6li727o78";
    // CHỌN SUẤT DIỄN TẠI ĐÂY:
    // occ-06fp6lofqe9se (Ngày 24/10)
    // occ-06fp6luui0ndc (Ngày 25/10)
    const OCC_ID = "occ-06fp6lofqe9se"; 
    const MY_CODE = "NHẬP_MÃ_CỦA_BẠN";

    console.log(`%c[SYSTEM] Đang nhắm mục tiêu Suất diễn: ${OCC_ID}`, "color: #00b14f");

    const trigger = async () => {
        try {
            const res = await fetch(`https://cticket.vn/tix/public/events/${EVENT_ID}/verify-entry-code`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest' // Header quan trọng để bypass một số filter
                },
                body: JSON.stringify({ 
                    code: MY_CODE,
                    occurrence_id: OCC_ID 
                })
            });

            const data = await res.json();
            
            if (data.queue_url || data.redirect_url) {
                window.location.href = data.queue_url || data.redirect_url;
                return true;
            } 
            console.log("⏳ Đang thử lại... (Server response: " + (data.message || "Locked") + ")");
            return false;
        } catch (e) {
            return false;
        }
    };

    // Tự động lặp lại mỗi 0.5s để bắt đúng khoảnh khắc 10h00 sáng
    const timer = setInterval(async () => {
        const success = await trigger();
        if (success) clearInterval(timer);
    }, 500);
})();