(function() {
    // 密码模块初始化（由 lock.js 暴露）
    if (window.lockModule && typeof window.lockModule.init === 'function') {
        window.lockModule.init();
    }

    // 加载时延
    window.addEventListener('load', function() {
        const loadTime = Math.round(performance.now());
        const timeTag = document.getElementById('time-tag');
        if (timeTag) timeTag.textContent = loadTime + ' 毫秒';
    });

    // 防复制保护
    document.oncontextmenu = e => e.preventDefault();
    document.onselectstart = e => e.preventDefault();
    document.oncopy = e => e.preventDefault();
    document.oncut = e => e.preventDefault();

    // 搜索引擎切换
    let currentEngine = "baidu";
    document.querySelectorAll(".engine-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".engine-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentEngine = btn.dataset.engine;
        });
    });

    // 本地搜索高亮
    function localSearch(keyword) {
        const cards = document.querySelectorAll(".nav-card");
        cards.forEach(card => card.classList.remove("highlight"));
        if (!keyword) return;
        let found = false;
        const searchText = keyword.toLowerCase().replace("al", "ai");
        cards.forEach(card => {
            if (card.innerText.toLowerCase().includes(searchText)) {
                card.classList.add("highlight");
                found = true;
            }
        });
        if (!found) alert("未找到相关内容");
    }

    // 搜索按钮
    document.getElementById("search-btn").addEventListener("click", function() {
        const keyword = document.getElementById("search-input").value.trim();
        if (!keyword) return;
        if (currentEngine === "local") {
            localSearch(keyword);
        } else {
            const engineUrls = {
                baidu: "https://www.baidu.com/s?wd=",
                bing: "https://cn.bing.com/search?q=",
                "360": "https://www.so.com/s?q=",
                sogou: "https://www.sogou.com/web?query=",
                toutiao: "https://so.toutiao.com/search/?keyword=",
                metaso: "https://metaso.cn/?q=",
                nami: "https://www.n.cn/search/?q=",
                chatbd: "https://chat.baidu.com/search?word="
            };
            const url = engineUrls[currentEngine] + encodeURIComponent(keyword);
            if (url) window.open(url, "_blank");
        }
    });

    // 回车搜索
    document.getElementById("search-input").addEventListener("keydown", function(e) {
        if (e.key === "Enter") document.getElementById("search-btn").click();
    });

    // 打字机效果
    const texts = [
        "一站直达，高效上网从这里开始",
        "更高效的上网入口，从expert1网页导航开始",
        "聚合常用网站与优质资源，分类清晰，搜索方便"
    ];
    let textIndex = 0, charIndex = 0, isDeleting = false;
    const typeSpeed = 90, deleteSpeed = 60, pauseAfterTyping = 2200, pauseAfterDelete = 600;
    const typeTextEl = document.getElementById("typeText");

    function typeWriter() {
        const current = texts[textIndex];
        if (isDeleting) {
            typeTextEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typeTextEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }
        if (!isDeleting && charIndex === current.length) {
            setTimeout(() => { isDeleting = true; typeWriter(); }, pauseAfterTyping);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(typeWriter, pauseAfterDelete);
        } else {
            setTimeout(typeWriter, isDeleting ? deleteSpeed : typeSpeed);
        }
    }
    typeWriter();

    // 实时时钟
    function updateTime() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        const timeBox = document.getElementById('timeBox');
        if (timeBox) timeBox.innerText = `⏰现在是北京时间：${h}:${m}:${s}`;
    }
    updateTime();
    setInterval(updateTime, 1000);
})();
