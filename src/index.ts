import { Game } from './core/game';
import { Renderer } from './core/renderer';

class GameController {
    private game: Game;
    private renderer: Renderer;
    private lastTime: number = 0;
    private animationId: number | null = null;

    constructor() {
        const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        const scoreElement = document.getElementById('score') as HTMLElement;

        this.game = new Game();
        this.renderer = new Renderer(canvas);

        // 设置键盘事件监听
        document.addEventListener('keydown', this.handleKeyPress.bind(this));

        // 开始游戏循环
        this.gameLoop(0);
    }

    private handleKeyPress(event: KeyboardEvent): void {
        if (this.game.getState().gameState.isGameOver) {
            if (event.code === 'Enter') {
                this.game.reset();
            }
            return;
        }

        switch (event.code) {
            case 'ArrowLeft':
                this.game.moveLeft();
                break;
            case 'ArrowRight':
                this.game.moveRight();
                break;
            case 'ArrowDown':
                this.game.moveDown();
                break;
            case 'ArrowUp':
                this.game.rotate();
                break;
            case 'Space':
                this.game.togglePause();
                break;
        }

        // 阻止方向键滚动页面
        if (event.code.startsWith('Arrow')) {
            event.preventDefault();
        }
    }

    private updateScore(): void {
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.textContent = this.game.getState().gameState.score.toString();
        }
    }

    private gameLoop(timestamp: number): void {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.game.update(deltaTime);
        this.renderer.render(this.game);
        this.updateScore();

        this.animationId = requestAnimationFrame(this.gameLoop.bind(this));
    }
}

// 等待DOM加载完成后启动游戏
document.addEventListener('DOMContentLoaded', () => {
    new GameController();
});