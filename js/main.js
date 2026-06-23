document.oncontextmenu = e => e.preventDefault();
document.onselectstart = e => e.preventDefault();
document.oncopy = e => e.preventDefault();
document.oncut = e => e.preventDefault();

window.addEventListener('load', function() {
    const loadTime = Math.round(performance.now());
    document.getElementById('time-tag').textContent = loadTime + ' 毫秒';
});

let currentEngine = "baidu";
document.querySelectorAll(".engine-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".engine-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentEngine = btn.dataset.engine;
    });
});

function localSearch(keyword) {
    const cards = document.querySelectorAll(".nav-card");
    cards.forEach(card => card.classList.remove("highlight"));
    if (!keyword) return;
    let found = false;
    const searchText = keyword.toLowerCase().replace("al","ai");
    cards.forEach(card => {
        const cardText = card.innerText.toLowerCase();
        if (cardText.includes(searchText)) {
            card.classList.add("highlight");
            found = true;
        }
    });
    if (!found) alert("未找到相关内容");
}

document.getElementById("search-btn").addEventListener("click", function() {
    const keyword = document.getElementById("search-input").value.trim();
    if (!keyword) return;
    if (currentEngine === "local") {
        localSearch(keyword);
    } else {
        let url = "";
        switch(currentEngine) {
            case "baidu": url = "https://www.baidu.com/s?wd=" + encodeURIComponent(keyword); break;
            case "bing": url = "https://cn.bing.com/search?q=" + encodeURIComponent(keyword); break;
            case "360": url = "https://www.so.com/s?q=" + encodeURIComponent(keyword); break;
            case "sogou": url = "https://www.sogou.com/web?query=" + encodeURIComponent(keyword); break;
            case "toutiao": url = "https://so.toutiao.com/search/?keyword=" + encodeURIComponent(keyword); break;
            case "metaso": url = "https://metaso.cn/?q=" + encodeURIComponent(keyword); break;
            case "nami": url = "https://www.n.cn/search/?q=" + encodeURIComponent(keyword); break;
            case "chatbd": url = "https://chat.baidu.com/search?word=" + encodeURIComponent(keyword); break;
        }
        if (url) window.open(url, "_blank");
    }
});

document.getElementById("search-input").addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        document.getElementById("search-btn").click();
    }
});

const texts = [
    "一站直达，高效上网从这里开始",
    "更高效的上网入口，从expert1网页导航开始",
    "聚合常用网站与优质资源，分类清晰，搜索方便"
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typeSpeed = 90;
const deleteSpeed = 60;
const pauseAfterTyping = 2200;
const pauseAfterDelete = 600;
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

function updateTime() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('timeBox').innerText = `⏰现在是北京时间：${h}:${m}:${s}`;
}

// 组件加载完成后再执行
window.pageReady = function(){
    typeWriter();
    updateTime();
    setInterval(updateTime, 1000);
}
