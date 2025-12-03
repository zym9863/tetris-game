import { Game } from './game';
import { Block, Position } from './types';

export class Renderer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private blockSize: number;
    private backgroundImage: HTMLImageElement;

    constructor(canvas: HTMLCanvasElement, blockSize: number = 30) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.blockSize = blockSize;

        this.backgroundImage = new Image();
        this.backgroundImage.src = 'images/tetris-bg-1.png';

        // 设置画布大小
        this.canvas.width = 10 * blockSize; // 游戏区域宽度
        this.canvas.height = 20 * blockSize; // 游戏区域高度
    }

    public render(game: Game): void {
        const state = game.getState();
        this.clear();
        this.drawBoard(state.board.grid);

        // 绘制幽灵方块（仅在游戏未结束且未暂停时显示）
        if (!state.gameState.isGameOver && !state.gameState.isPaused) {
            const ghostPosition = game.getGhostPosition();
            this.drawPiece({
                blocks: state.currentPiece.blocks,
                position: ghostPosition,
                color: state.currentPiece.color
            }, true); // 第二个参数为true表示绘制幽灵方块
        }

        // 绘制当前活动方块
        this.drawPiece(state.currentPiece);

        if (state.gameState.isGameOver) {
            this.drawGameOver();
        } else if (state.gameState.isPaused) {
            this.drawPaused();
        }
    }

    private clear(): void {
        this.ctx.fillStyle = '#111';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private drawBlock(x: number, y: number, color: string, isGhost: boolean = false): void {
        const borderWidth = 2;

        if (isGhost) {
            // 绘制幽灵方块（半透明填充 + 边框）
            this.ctx.fillStyle = this.adjustColorOpacity(color, 0.3);
            this.ctx.fillRect(
                x * this.blockSize,
                y * this.blockSize,
                this.blockSize,
                this.blockSize
            );

            // 绘制边框
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = borderWidth;
            this.ctx.strokeRect(
                x * this.blockSize + borderWidth / 2,
                y * this.blockSize + borderWidth / 2,
                this.blockSize - borderWidth,
                this.blockSize - borderWidth
            );
        } else {
            // 绘制正常方块
            // 绘制主体
            this.ctx.fillStyle = color;
            this.ctx.fillRect(
                x * this.blockSize,
                y * this.blockSize,
                this.blockSize,
                this.blockSize
            );

            // 加强高光效果，增加复古感
            this.ctx.fillStyle = this.lightenColor(color, 70);
            this.ctx.fillRect(
                x * this.blockSize,
                y * this.blockSize,
                this.blockSize,
                borderWidth
            );
            this.ctx.fillRect(
                x * this.blockSize,
                y * this.blockSize,
                borderWidth,
                this.blockSize
            );

            // 加深阴影效果
            this.ctx.fillStyle = this.darkenColor(color, 70);
            this.ctx.fillRect(
                x * this.blockSize + this.blockSize - borderWidth,
                y * this.blockSize,
                borderWidth,
                this.blockSize
            );
            this.ctx.fillRect(
                x * this.blockSize,
                y * this.blockSize + this.blockSize - borderWidth,
                this.blockSize,
                borderWidth
            );

            // 添加内部光晕效果
            const gradient = this.ctx.createRadialGradient(
                x * this.blockSize + this.blockSize / 2,
                y * this.blockSize + this.blockSize / 2,
                0,
                x * this.blockSize + this.blockSize / 2,
                y * this.blockSize + this.blockSize / 2,
                this.blockSize / 2
            );
        }
    }

    /**
     * 调整颜色的透明度
     * @param color 原始颜色（十六进制格式）
     * @param opacity 透明度值（0-1之间）
     * @returns {string} 带透明度的RGBA颜色字符串
     */
    private adjustColorOpacity(color: string, opacity: number): string {
        const hex = color.replace('#', '');
        const num = parseInt(hex, 16);
        const r = (num >> 16) & 0xff;
        const g = (num >> 8) & 0xff;
        const b = num & 0xff;
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    private drawBoard(grid: (string | null)[][]): void {
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                if (grid[y][x]) {
                    this.drawBlock(x, y, grid[y][x]!);
                } else {
                    // 绘制空格子的网格线
                    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                    this.ctx.strokeRect(
                        x * this.blockSize,
                        y * this.blockSize,
                        this.blockSize,
                        this.blockSize
                    );
                }
            }
        }
    }

    private drawPiece({ blocks, position, color }: { blocks: Position[], position: Position, color: string }, isGhost: boolean = false): void {
        blocks.forEach(block => {
            const x = block.x + position.x;
            const y = block.y + position.y;
            this.drawBlock(x, y, color, isGhost);
        });
    }

    private drawGameOver(): void {
        const text = '游戏结束';
        this.drawOverlay(text);
    }

    private drawPaused(): void {
        const text = '已暂停';
        this.drawOverlay(text);
    }

    private drawOverlay(text: string): void {
        // 半透明背景
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 文本
        this.ctx.fillStyle = '#0ff';
        this.ctx.font = 'bold 24px "Press Start 2P", Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(
            text,
            this.canvas.width / 2,
            this.canvas.height / 2
        );
    }

    private lightenColor(color: string, amount: number): string {
        return this.adjustColor(color, amount);
    }

    private darkenColor(color: string, amount: number): string {
        return this.adjustColor(color, -amount);
    }

    private adjustColor(color: string, amount: number): string {
        const hex = color.replace('#', '');
        const num = parseInt(hex, 16);
        const r = Math.min(255, Math.max(0, (num >> 16) + amount));
        const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
        const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    }
}
