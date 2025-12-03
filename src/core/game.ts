import { GameState, GameBoard, Tetromino, Position } from './types';
import { TetrominoFactory } from './tetromino-factory';

export class Game {
    private board: GameBoard;
    private currentPiece: Tetromino;
    private nextPiece: Tetromino;
    private gameState: GameState;
    private dropCounter: number = 0;
    private dropInterval: number = 1000;
    private lastTime: number = 0;

    constructor(width: number = 10, height: number = 20) {
        this.board = {
            width,
            height,
            grid: Array(height).fill(null).map(() => Array(width).fill(null))
        };
        
        this.gameState = {
            score: 0,
            level: 1,
            isGameOver: false,
            isPaused: false
        };

        this.currentPiece = TetrominoFactory.create(TetrominoFactory.getRandomType());
        this.nextPiece = TetrominoFactory.create(TetrominoFactory.getRandomType());
    }

    public update(deltaTime: number): void {
        if (this.gameState.isGameOver || this.gameState.isPaused) return;

        this.dropCounter += deltaTime;
        if (this.dropCounter > this.dropInterval) {
            this.moveDown();
            this.dropCounter = 0;
        }
    }

    private isValidMove(position: Position, blocks: Position[]): boolean {
        return blocks.every(block => {
            const newX = block.x + position.x;
            const newY = block.y + position.y;
            return (
                newX >= 0 &&
                newX < this.board.width &&
                newY >= 0 &&
                newY < this.board.height &&
                !this.board.grid[newY][newX]
            );
        });
    }

    public moveLeft(): void {
        const newPosition = {
            x: this.currentPiece.position.x - 1,
            y: this.currentPiece.position.y
        };
        if (this.isValidMove(newPosition, this.currentPiece.blocks)) {
            this.currentPiece.position = newPosition;
        }
    }

    public moveRight(): void {
        const newPosition = {
            x: this.currentPiece.position.x + 1,
            y: this.currentPiece.position.y
        };
        if (this.isValidMove(newPosition, this.currentPiece.blocks)) {
            this.currentPiece.position = newPosition;
        }
    }

    public moveDown(): void {
        const newPosition = {
            x: this.currentPiece.position.x,
            y: this.currentPiece.position.y + 1
        };
        if (this.isValidMove(newPosition, this.currentPiece.blocks)) {
            this.currentPiece.position = newPosition;
        } else {
            this.lockPiece();
            this.clearLines();
            this.spawnNewPiece();
        }
    }

    public rotate(): void {
        const rotated = TetrominoFactory.rotate(this.currentPiece);
        if (this.isValidMove(rotated.position, rotated.blocks)) {
            this.currentPiece = rotated;
        }
    }

    private lockPiece(): void {
        this.currentPiece.blocks.forEach(block => {
            const x = block.x + this.currentPiece.position.x;
            const y = block.y + this.currentPiece.position.y;
            if (y >= 0) {
                this.board.grid[y][x] = this.currentPiece.color;
            }
        });
    }

    private clearLines(): void {
        let linesCleared = 0;
        
        for (let y = this.board.height - 1; y >= 0; y--) {
            if (this.board.grid[y].every(cell => cell !== null)) {
                this.board.grid.splice(y, 1);
                this.board.grid.unshift(Array(this.board.width).fill(null));
                linesCleared++;
                y++; // Check the same line again as everything has moved down
            }
        }

        if (linesCleared > 0) {
            this.updateScore(linesCleared);
        }
    }

    private updateScore(linesCleared: number): void {
        const points = [40, 100, 300, 1200];
        this.gameState.score += points[linesCleared - 1] * this.gameState.level;
        
        // 每清除10行升一级
        const totalLines = Math.floor(this.gameState.score / 1000);
        this.gameState.level = Math.floor(totalLines / 10) + 1;
        
        // 更新下落速度
        this.dropInterval = Math.max(100, 1000 - (this.gameState.level - 1) * 100);
    }

    private spawnNewPiece(): void {
        this.currentPiece = this.nextPiece;
        this.nextPiece = TetrominoFactory.create(TetrominoFactory.getRandomType());

        if (!this.isValidMove(this.currentPiece.position, this.currentPiece.blocks)) {
            this.gameState.isGameOver = true;
        }
    }

    public togglePause(): void {
        this.gameState.isPaused = !this.gameState.isPaused;
    }

    /**
     * 计算当前方块的幽灵位置（在保持X轴位置不变的情况下，向下投射到最底部的合法位置）
     * @returns {Position} 幽灵方块的位置坐标
     */
    public getGhostPosition(): Position {
        const currentX = this.currentPiece.position.x;
        let ghostY = this.currentPiece.position.y;

        // 从当前位置开始，逐步向下移动直到找到最底部的合法位置
        while (true) {
            const nextPosition = { x: currentX, y: ghostY + 1 };
            if (this.isValidMove(nextPosition, this.currentPiece.blocks)) {
                ghostY++;
            } else {
                break;
            }
        }

        return { x: currentX, y: ghostY };
    }

    public getState() {
        return {
            board: this.board,
            currentPiece: this.currentPiece,
            nextPiece: this.nextPiece,
            gameState: this.gameState
        };
    }

    public reset(): void {
        this.board.grid = Array(this.board.height).fill(null)
            .map(() => Array(this.board.width).fill(null));
        this.gameState = {
            score: 0,
            level: 1,
            isGameOver: false,
            isPaused: false
        };
        this.currentPiece = TetrominoFactory.create(TetrominoFactory.getRandomType());
        this.nextPiece = TetrominoFactory.create(TetrominoFactory.getRandomType());
        this.dropCounter = 0;
        this.dropInterval = 1000;
    }
}