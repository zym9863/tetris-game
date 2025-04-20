import { Tetromino, TetrominoType, COLORS } from './types';

const SHAPES: { [key in TetrominoType]: number[][] } = {
    I: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    O: [
        [1, 1],
        [1, 1]
    ],
    T: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    J: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    L: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ]
};

export class TetrominoFactory {
    static create(type: TetrominoType): Tetromino {
        const shape = SHAPES[type];
        const blocks = [];

        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) {
                    blocks.push({ x, y });
                }
            }
        }

        return {
            type,
            blocks,
            color: COLORS[type],
            position: {
                x: Math.floor((10 - shape[0].length) / 2),
                y: 0
            },
            rotation: 0
        };
    }

    static rotate(tetromino: Tetromino, clockwise: boolean = true): Tetromino {
        const newBlocks = tetromino.blocks.map(({ x, y }) => {
            if (tetromino.type === 'O') return { x, y };
            
            const size = tetromino.type === 'I' ? 4 : 3;
            if (clockwise) {
                return { x: size - 1 - y, y: x };
            } else {
                return { x: y, y: size - 1 - x };
            }
        });

        return {
            ...tetromino,
            blocks: newBlocks,
            rotation: (tetromino.rotation + (clockwise ? 1 : -1)) % 4
        };
    }

    static getRandomType(): TetrominoType {
        const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
        return types[Math.floor(Math.random() * types.length)];
    }
}