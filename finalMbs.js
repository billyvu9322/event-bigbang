(function scheduleMbsTask() {
    // 1. THÔNG TIN CẤU HÌNH
    const CONFIG = {
        EVENT_ID: "evt-06fr3rtoss5vc",
        //occurrences: https://cticket.vn/tix/public/events/v2/bigbang2026worldtourinhanoi-tickets
        OCC_ID: "occ-06ftne1b2jgtq",
        TARGET_HOUR: 9,
        TARGET_MINUTE: 59,
        TARGET_SECOND: 59
    };

    const TARGET_URL = `https://cticket.vn/buy/${CONFIG.EVENT_ID}/queue?ocid=${CONFIG.OCC_ID}`;

    console.log(`%c[TIMER] Script đã nạp. Đang đợi đến ${CONFIG.TARGET_HOUR}:${CONFIG.TARGET_MINUTE}:${CONFIG.TARGET_SECOND}...`, "color: #007bff; font-weight: bold;");

    // 2. Logic kiểm tra thời gian
    const checkTimer = setInterval(async () => {
        const now = new Date();
        
        if (now.getHours() === CONFIG.TARGET_HOUR && 
            now.getMinutes() === CONFIG.TARGET_MINUTE && 
            now.getSeconds() >= CONFIG.TARGET_SECOND) {
            
            console.log("%c🚀 ĐẾN GIỜ G! Đang chuyển hướng vào queue...", "color: #ff0000; font-weight: bold;");
            window.location.href = TARGET_URL;
            clearInterval(checkTimer);
        }
    }, 300);
})();
