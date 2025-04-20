export type Position = {
    x: number;
    y: number;
};

export type Block = {
    position: Position;
    color: string;
};

export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export type Tetromino = {
    type: TetrominoType;
    blocks: Position[];
    color: string;
    position: Position;
    rotation: number;
};

export type GameState = {
    score: number;
    level: number;
    isGameOver: boolean;
    isPaused: boolean;
};

export interface GameBoard {
    width: number;
    height: number;
    grid: (string | null)[][];
}

export const COLORS = {
    I: '#96C5B0',  // 莫兰迪青色
    O: '#D4B88C',  // 莫兰迪黄色
    T: '#B19CD9',  // 莫兰迪紫色
    S: '#90A17D',  // 莫兰迪绿色
    Z: '#AF6B58',  // 莫兰迪红色
    J: '#8B95C9',  // 莫兰迪蓝色
    L: '#CF9E76'   // 莫兰迪橙色
};