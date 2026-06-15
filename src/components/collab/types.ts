export interface DrawLine {
  tool: 'pen' | 'eraser';
  points: number[];
  color: string;
  width: number;
}
