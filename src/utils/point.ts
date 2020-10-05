import Vector from '@/utils/vector';

export default class Point {
    x: number;
    y: number;
    lx: number;
    ly: number;
    index: number;

    constructor(x: number, y: number, index: number) {
      this.x = x;
      this.y = y;
      this.lx = this.x - 5;
      this.ly = this.y - 5;
      this.index = index;
    }

    getVector(end: Point) : Vector{
        return new Vector(end.x - this.x, end.y - this.y)
    }
}
