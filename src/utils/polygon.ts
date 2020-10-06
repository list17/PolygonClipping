import Point from '@/utils/point';
import Segment from '@/utils/segment';

export default class Polygon {
    pointSet: Point[][] = [[]];
    segmentSet: Segment[] = [];

    addPoint(x: number, y: number): boolean {
        if (this.findPoint(x, y)) {
            return false;
        }

        let newPoint: Point = new Point(x, y);

        if (this.pointSet.length > 1) {
            if (newPoint.isInLoop(this.pointSet[0]) === 0) {
                return false;
            }

            for (let i = 1; i < this.pointSet.length - 1; i++) {
                if (newPoint.isInLoop(this.pointSet[i]) === 1) {
                    return false;
                }
            }
        }

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
        let area = 0;
        for (let i = 0; i < points.length - 1; ++i) {
            area += points[i].x * points[i + 1].y;
            area -= points[i + 1].x * points[i].y;
        }
        area += points[points.length - 1].x * points[0].y;
        area -= points[0].x * points[points.length - 1].y;
        return (area < 0);
    }

    clip(polygon: Polygon): Point[][] {
        let mainTableOrigin: LinkNode[] = this.initTable();
        let cutTableOrigin: LinkNode[] = polygon.initTable();
        let mainTable: LinkNode[] = [];
        let cutTable: LinkNode[] = [];
        this.insertTable(polygon, mainTableOrigin, cutTableOrigin, mainTable, cutTable);

        if (mainTable.length === mainTableOrigin.length) {
            if (this.getArea() >= polygon.getArea()) {
                return polygon.pointSet;
            } else {
                let result: Point[][] = [];
                result.push(this.pointSet[0]);
                for (let i = 1; i < polygon.pointSet.length; ++i) {
                    if (polygon.pointSet[i].length === 0) {
                        continue;
                    }
                    if (polygon.pointSet[i][0].isPointInPolygon(this.pointSet)) {
                        result.push(polygon.pointSet[i]);
                    }
                }
                return result;
            }
        }

        let result: Point[][] = [];
        while (true) {
            let points: Point[] = [];
            let isFound: boolean = false;
            let pNode: LinkNode | undefined = undefined;
            for (let i = 0; i < mainTable.length; ++i) {
                if (mainTable[i].type === NodeType.In) {
                    isFound = true;
                    pNode = mainTable[i];
                    break;
                }
            }
            if (!isFound || pNode === undefined) {
                break;
            }
            pNode.type = NodeType.Normal;
            let currentTable: number = 0;
            points.push(pNode.point);
            let head: LinkNode = pNode;
            while (true) {
                if (currentTable === 0) {
                    pNode = pNode.next;
                    if (pNode === undefined) {
                        break;
                    }
                    if (pNode.type === NodeType.Normal) {
                        points.push(pNode.point);
                    } else if (pNode.type === NodeType.In) {
                        points.push(pNode.point);
                    } else {
                        points.push(pNode.point);
                        pNode = pNode.equal;
                        currentTable = 1;
                    }
                } else {
                    pNode = pNode.next;
                    if (pNode.type === NodeType.Normal) {
                        points.push(pNode.point);
                    } else if (pNode.type === NodeType.Out) {
                        points.push(pNode.point);
                    } else {
                        pNode = pNode.equal;
                        currentTable = 0;
                        if (pNode === head) {
                            break;
                        } else {
                            pNode.type = NodeType.Normal;
                            points.push(pNode.point);
                        }
                    }
                }
            }
            result.push(points);
        }
        return result;
    }


    getArea(): number {
        let nodes = this.pointSet[0];
        let area = 0;
        for (let i = 0; i < nodes.length - 1; ++i) {
            area += nodes[i].x * nodes[i + 1].y;
            area -= nodes[i + 1].x * nodes[i].y;
        }
        area += nodes[nodes.length - 1].x * nodes[0].y;
        area -= nodes[0].x * nodes[nodes.length - 1].y;
        return 0.5 * Math.abs(area);
    }

    initTable(): LinkNode[] {
        let table: LinkNode[] = [];
        for (let i = 0; i < this.pointSet.length; ++i) {
            let nodes = this.pointSet[i];
            if (nodes.length === 0) {
                continue;
            }
            let isClockwise: boolean = this.isClockwise(nodes);
            let isReverse: boolean = ((i === 0 && !isClockwise) || (i != 0 && isClockwise));
            //bool isReverse = false;
            let last: null | LinkNode = null;
            let head: LinkNode | null = null;
            for (let j = 0; j < nodes.length; ++j) {
                let pNode = new LinkNode(i, (isReverse ? (nodes.length - j - 1) : j), NodeType.Normal, nodes[(isReverse ? (nodes.length - j - 1) : j)], 0);
                if (head === null) {
                    head = pNode;
                }
                if (last != null) {
                    last.next = pNode;
                }
                last = pNode;
                table.push(pNode);
            }
            if (last != null && head != null) {
                last.next = head;
            }
        }
        return table;
    }

    insertTable(polygon: Polygon, mainTableOrigin: LinkNode[], cutTableOrigin: LinkNode[], mainTable: LinkNode[], cutTable: LinkNode[]): void {
        let pNodes: LinkNode[][] = [];
        let qNodes: LinkNode[][] = [];
        for (let i = 0; i < mainTableOrigin.length; ++i) {
            pNodes.push([])
        }
        for (let i = 0; i < cutTableOrigin.length; ++i) {
            qNodes.push([])
        }
        for (let i = 0; i < mainTableOrigin.length; ++i) {
            for (let j = 0; j < cutTableOrigin.length; ++j) {
                let cross: boolean = new Segment(mainTableOrigin[i].point, mainTableOrigin[i].next.point).isCross(
                    new Segment(cutTableOrigin[j].point, cutTableOrigin[j].next.point)
                );
                if (cross) {
                    let point = new Segment(mainTableOrigin[i].point, mainTableOrigin[i].next.point).getIntersect(
                        new Segment(cutTableOrigin[j].point, cutTableOrigin[j].next.point)
                    );
                    let type: number = NodeType.Out;
                    if (mainTableOrigin[i].point.getVector(mainTableOrigin[i].next.point).crossProduct(
                        cutTableOrigin[j].point.getVector(cutTableOrigin[j].next.point)
                    ) > 0) {
                        type = NodeType.In;
                    }
                    let newPNode = new LinkNode(mainTableOrigin[i].loopId, 0, type, point, mainTableOrigin[i].point.distance(point));
                    let newQNode = new LinkNode(cutTableOrigin[j].loopId, 0, type, point, cutTableOrigin[j].point.distance(point));
                    newPNode.equal = newQNode;
                    newQNode.equal = newPNode;
                    pNodes[i].push(newPNode);
                    qNodes[j].push(newQNode);
                }
            }
        }
        for (let i = 0; i < pNodes.length; ++i) {
            pNodes[i] = pNodes[i].sort((node1: LinkNode, node2: LinkNode) => {
                return node1.dis - node2.dis;
            })
        }

        for (let i = 0; i < qNodes.length; ++i) {
            qNodes[i] = qNodes[i].sort((node1: LinkNode, node2: LinkNode) => {
                return node1.dis - node2.dis;
            })
        }
        for (let i = 0; i < mainTableOrigin.length; ++i) {
            mainTable.push(mainTableOrigin[i]);
            let last = mainTableOrigin[i], next = mainTableOrigin[i].next;
            for (let j = 0; j < pNodes[i].length; ++j) {
                let node = pNodes[i][j];
                mainTable.push(node);
                last.next = node;
                last = node;
            }
            last.next = next;
        }
        for (let i = 0; i < cutTableOrigin.length; ++i) {
            cutTable.push(cutTableOrigin[i]);
            let last = cutTableOrigin[i], next = cutTableOrigin[i].next;
            for (let j = 0; j < qNodes[i].length; ++j) {
                let node = qNodes[i][j];
                cutTable.push(node);
                last.next = node;
                last = node;
            }
            last.next = next;
        }
    }

    getPointSet(): Point[][] {
        return this.pointSet;
    }

    getSegSet(): Segment[] {
        return this.segmentSet;
    }
}

enum NodeType {
    Normal,
    In,
    Out
}

class LinkNode {
    pointId: number;
    loopId: number;
    type: number;
    point: Point;
    dis: number;

    constructor(loopId: number, pointId: number, type: number, point: Point, dis: number) {
        this.loopId = loopId;
        this.pointId = pointId;
        this.type = type;
        this.point = point;
        this.dis = dis;
    }

    private _next!: LinkNode;

    get next(): LinkNode {
        return this._next;
    }

    set next(value: LinkNode) {
        this._next = value;
    }

    private _equal!: LinkNode;

    get equal(): LinkNode {
        return this._equal;
    }

    set equal(value: LinkNode) {
        this._equal = value;
    }
}