import Point from '@/utils/point';
import Segment from '@/utils/segment';

export default class Polygon {
    pointSet: Point[][] = [[]];
    segmentSet: Segment[] = [];

    addPoint(x: number, y: number): boolean {
        if (this.findPoint(x, y)) {
            return false;
        }
        let newPoint: Point = new Point(x, y, this.pointSet[this.pointSet.length - 1].length);

        for (let i = 0; i < this.segmentSet.length; i++) {
            if (this.pointSet[this.pointSet.length - 1].length > 0) {
                let seg = new Segment(this.pointSet[this.pointSet.length - 1][this.pointSet[this.pointSet.length - 1].length - 1], newPoint);
                if (seg.isCross(this.segmentSet[i])) {
                    return false;
                }
            }
        }

        if (this.pointSet[this.pointSet.length - 1].length > 0) {
            this.segmentSet.push(new Segment(this.pointSet[this.pointSet.length - 1][this.pointSet[this.pointSet.length - 1].length - 1], newPoint));
        }

        this.pointSet[this.pointSet.length - 1].push(newPoint);
        return true;
    }

    findPoint(x: number, y: number): boolean {
        for (let i: number = 0; i < this.pointSet.length; i++) {
            for (let j: number = 0; j < this.pointSet[i].length; j++) {
                if (this.pointSet[i][j].x === x && this.pointSet[i][j].y === y) {
                    return true;
                }
            }
        }
        return false;
    }

    close(): void {
        if (this.pointSet[this.pointSet.length - 1].length >= 3) {
            let seg = new Segment(this.pointSet[this.pointSet.length - 1][this.pointSet[this.pointSet.length - 1].length - 1], this.pointSet[this.pointSet.length - 1][0]);
            this.segmentSet.push(seg);
            this.pointSet.push([]);
        }
    }

    isClockwise(points: Point[]): boolean {
        let vec1 = points[0].getVector(points[1]);
        let vec2 = points[0].getVector(points[points.length - 1]);
        return vec1.crossProduct(vec2) > 0;
    }

    clip(polygon: Polygon): Segment[] {


        return []
    }
    
    getPointSet(): Point[][] {
        return this.pointSet;
    }

    getSegSet(): Segment[] {
        return this.segmentSet;
    }
}