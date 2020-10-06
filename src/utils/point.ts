import Vector from '@/utils/vector';

export default class Point {
    x: number;
    y: number;
    lx: number;
    ly: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.lx = this.x - 5;
        this.ly = this.y - 5;
    }

    getVector(end: Point): Vector {
        return new Vector(end.x - this.x, end.y - this.y)
    }

    isInLoop(points: Point[]): number {
        // 0 表示在多边形外 1表示在多边形内 -1表示在多边形上
        let count: number = 0;
        for (let i = 0; i < points.length; ++i) {
            let p1: Point = points[i];
            let p2: Point = i === points.length - 1 ? points[0] : points[i + 1];
            if ((this.y >= p1.y && this.y <= p2.y) || (this.y >= p2.y && this.y <= p1.y)) {
                let t: number = (this.y - p1.y) / (p2.y - p1.y);
                let xt: number = p1.x + t * (p2.x - p1.x);
                if (this.x === xt) return -1;
                if (this.x < xt) ++count;
            }
        }
        return count % 2 ? 1 : 0;
    }

    isPointInPolygon(p: Point[][]) {
        let i = this.x, j = this.y;
        let isInside: boolean = false;
        let totalAngle = 0.0;
        for (let k = 0; k < p[0].length; ++k) {
            let x1 = p[0][k].x - i;
            let y1 = p[0][k].y - j;
            let x2 = (k === p[0].length - 1) ? (p[0][0].x - i) : (p[0][k + 1].x - i);
            let y2 = (k === p[0].length - 1) ? (p[0][0].y - j) : (p[0][k + 1].y - j);
            let a = this.angleBetween(x1, y1, x2, y2);
            totalAngle += a;
        }
        if (Math.abs(totalAngle) > 6) {
            isInside = true;
        }
        if (isInside) {
            for (let k = 1; k < p.length; ++k) {
                totalAngle = 0.0;
                for (let l = 0; l < p[k].length; ++l) {
                    let x1 = p[k][l].x - i;
                    let y1 = p[k][l].y - j;
                    let x2 = (l === p[k].length - 1) ? (p[k][0].x - i) : (p[k][l + 1].x - i);
                    let y2 = (l === p[k].length - 1) ? (p[k][0].y - j) : (p[k][l + 1].y - j);
                    let a = this.angleBetween(x1, y1, x2, y2);
                    totalAngle += a;
                }
                if (Math.abs(totalAngle) > 6) {
                    isInside = false;
                    break;
                }
            }
        }
        return isInside;
    }

    angleBetween(x1: number, y1: number, x2: number, y2: number): number {
        let sinValue = (x1 * y2 - x2 * y1) / (Math.sqrt(x1 * x1 + y1 * y1) * Math.sqrt(x2 * x2 + y2 * y2));
        let cosValue = (x1 * x2 + y1 * y2) / (Math.sqrt(x1 * x1 + y1 * y1) * Math.sqrt(x2 * x2 + y2 * y2));
        if (cosValue >= 1) {
            return 0;
        }
        if (cosValue <= -1) {
            return 3.1416;
        }
        let a = Math.acos(cosValue);
        if (sinValue < 0) {
            a = -a;
        }
        return a;
    }


    distance(point: Point): number {
        return Math.ceil(Math.sqrt(Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2)))
    }
}
