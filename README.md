# expert1 的网页导航

一站式高效上网入口，聚合游戏、AI、工具、模拟器、趣味网站等优质资源，支持多引擎搜索、打字机欢迎语、密码访问保护。

## 技术栈
- 原生 HTML/CSS/JS
- CSP 内容安全策略
- Cookie + localStorage 密码锁定机制
- 组件化异步加载

## 目录结构
Lvy/
├── index.html # 入口骨架页面
├── README.md # 仓库说明
├── assets/css/
│ ├── main.css # 通用样式
│ └── lock.css # 密码弹窗样式
├── components/
│ ├── header.html # 标题、打字机、搜索栏、搜索引擎
│ ├── nav-list.html # 全部分类导航卡片
│ ├── footer.html # 加载时延、作者声明
│ └── lock-modal.html # 密码弹窗 DOM 结构
└── js/
├── lock.js # 密码解锁、锁定计数、Cookie 逻辑
└── main.js # 时间、打字机、搜索、防复制主逻辑
