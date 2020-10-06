export default class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }

    crossProduct(vec: Vector): number {
        return this.x * vec.y - this.y * vec.x;
    }
}
