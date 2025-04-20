[English Version](./README_EN.md) | [中文版](./README.md)

# 俄罗斯方块小游戏

本项目是一个使用 HTML5、CSS3 和 TypeScript 编写的俄罗斯方块（Tetris）小游戏，具有现代化界面和良好的用户体验，适合学习和娱乐。

## 目录结构

```
├── src/
│   ├── index.html         # 游戏主页面
│   ├── index.ts           # 入口脚本（TypeScript）
│   └── core/              # 游戏核心逻辑
│       ├── game.ts            # 游戏主循环与状态管理
│       ├── renderer.ts        # 渲染逻辑
│       ├── tetromino-factory.ts # 俄罗斯方块生成工厂
│       └── types.ts           # 类型定义
├── .gitignore
└── README.md
```

## 快速开始

1. 克隆仓库并安装依赖：
```bash
git clone https://github.com/zym9863/tetris-game.git
cd tetris-game
npm install
```

2. 本地开发：
```bash
npm run start
```

3. 构建生产包：
```bash
npm run build
```

## 主要特性
- 现代化配色与动画，界面美观
- 经典俄罗斯方块玩法，支持分数、等级、消除行数统计
- 代码结构清晰，便于学习和扩展
- 响应式布局，适配不同屏幕

## 依赖与开发
- 无需后端，纯前端实现
- 主要使用 TypeScript、HTML5、CSS3
- 可使用 VSCode 等现代 IDE 进行开发

## 贡献
欢迎通过 issue 或 pull request 进行建议和改进。

## License
MIT
