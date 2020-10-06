import Point from '@/utils/point';
import Vector from '@/utils/vector';

export default class Segment {
    begin: Point;
    end: Point;
    vector: Vector;

    constructor(begin: Point, end: Point) {
        this.begin = begin;
        this.end = end;
        this.vector = this.begin.getVector(this.end);
    }

    isStraddle(seg: Segment): boolean {
        let temp1 = this.begin.getVector(seg.begin)
        let temp2 = this.begin.getVector(seg.end)
        return temp1.crossProduct(this.vector) * temp2.crossProduct(this.vector) < 0;
    }

    isCross(seg: Segment): boolean {
        if (this.vector.crossProduct(seg.vector) === 0) {
            // 平行
            return false;
        } else {
            if (this.isStraddle(seg) && seg.isStraddle(this)) {
                return true;
            }
        }
        return false;
    }

    getIntersect(seg: Segment): Point {
        let C1 = this.end.x * this.begin.y - this.begin.x * this.end.y;
        let C2 = seg.end.x * seg.begin.y - seg.begin.x * seg.end.y;
        return new Point(
            Math.ceil((C2 * this.vector.x - C1 * seg.vector.x) / (seg.vector.x * this.vector.y - this.vector.x * seg.vector.y)),
            Math.ceil((C1 * seg.vector.y - C2 * this.vector.y) / (this.vector.x * seg.vector.y - seg.vector.x * this.vector.y)));
    }
}