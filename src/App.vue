<template>
    <div id="app" style="display: flex; margin-left: 20px; margin-top: 40px;">
        <svg id='canvas' style="height: 800px; width: 1500px; border: black solid 1px;">
            <g v-for="(points, index1) in polygon1.getPointSet()" v-bind:key=index1>
                <circle v-for="(point, index) in points"
                        v-bind:key=index
                        :cx=point.x
                        :cy=point.y
                        :r="pointRadius"
                        class="circle">

                </circle>
            </g>

            <g v-for="(points, index1) in polygon2.getPointSet()" v-bind:key=index1>
                <circle v-for="(point, index) in points"
                        v-bind:key=index
                        :cx=point.x
                        :cy=point.y
                        :r="pointRadius"
                        class="circle"
                        style="fill: blue;">
                </circle>
            </g>

            <line v-for="(segment, index) in polygon1.getSegSet()" v-bind:key=index
                  :x1="segment.begin.x"
                  :y1="segment.begin.y"
                  :x2="segment.end.x"
                  :y2="segment.end.y"
                  stroke="black">
            </line>

            <line v-for="(segment, index) in polygon2.getSegSet()" v-bind:key=index
                  :x1="segment.begin.x"
                  :y1="segment.begin.y"
                  :x2="segment.end.x"
                  :y2="segment.end.y"
                  stroke="blue">
            </line>
            <g v-for="polygon in result" v-show="result.length !== 0">
                <g v-for="points in polygon.pointSet">
                    <line v-for="(segment, index) in points" v-bind:key=index
                          :x1="segment.x"
                          :y1="segment.y"
                          :x2="points[index !== points.length - 1 ? index + 1 : 0].x"
                          :y2="points[index !== points.length - 1 ? index + 1 : 0].y"
                          stroke="red">
                    </line>
                </g>
            </g>
        </svg>
        <div style="display: flex; flex-direction: column; margin-left: 20px; height: 500px;">
            <el-button
                type="primary"
                @click="polygon = polygon2">
                绘制图形2
            </el-button>
            <el-button
                type="primary"
                style="margin-top: 20px;"
                @click="clip">
                进行裁剪
            </el-button>

            <el-button
                type="primary"
                style="margin-top: 20px;"
                @click="nextClip">
                继续裁剪
            </el-button>

            <el-button
                type="primary"
                style="margin-top: 20px;"
                @click="polygon.clear()">
                清除当前图形
            </el-button>

            <el-button
                type="primary"
                style="margin-top: 20px;"
                @click="clear">
                全部清空图形
            </el-button>

            <div style="margin-top: 200px;">颜色标注:</div>
            <el-tag color="#000000"
                    style="color: white;  margin-top: 10px;height: 20px; line-height: 20px; border-radius: 10px; border: none; text-align: center; align-content: center;">
                主多变形
            </el-tag>
            <el-tag color="#0000ff"
                    style="color: white; margin-top: 10px; height: 20px; line-height: 20px; border-radius: 10px; border: none; text-align: center; align-content: center;">
                裁剪多边形
            </el-tag>
            <el-tag color="#bf3878"
                    style="color: white; margin-top: 10px; height: 20px; line-height: 20px; border-radius: 10px; border: none; text-align: center; align-content: center;">
                裁剪后多边形
            </el-tag>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Polygon from '@/utils/polygon';

export default Vue.extend({
    name: 'App',
    data: () => ({
        pointRadius: 4,
        polygon1: new Polygon(),
        polygon2: new Polygon(),
        polygon: new Polygon(),
        result: [] as Polygon[],
    }),
    mounted() {
        this.polygon = this.polygon1
        const rect = document.getElementById('canvas')!;
        rect.addEventListener('click', (event) => {
            const offset = rect.getBoundingClientRect();
            if (!this.polygon.addPoint(event.clientX - offset.x, event.clientY - offset.y)) {
                this.$message.error('无法添加该点。');
            }
        });
        rect.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            if (!this.polygon.close()) {
                this.$message.error('当前顶点过少或者存在交点无法闭合');
            }
        })
    },
    methods: {
        clip(): void {
            this.result = this.polygon2.clip(this.polygon1);
        },
        nextClip(): void {
            if (this.result.length <= 0) {
                this.$message.error('当前没有可以选中的裁剪后多边形。');
                this.clear();
            } else if (this.result.length >= 2) {
                this.$message.error('当前裁剪后多边形数量大于2, 无法进行后续操作。')
            } else {
                let temp = this.result[0];
                this.clear();
                this.polygon1 = temp;
                this.polygon = this.polygon2;
            }
        },
        clear(): void {
            this.polygon1.clear();
            this.polygon2.clear();
            this.polygon = this.polygon1;
            this.result = [];
        }
    },

});

</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}
</style>

<style scoped>
.circle:hover {
    r: 10px;
    transition: r 0.2s ease-in-out;
}

.circle {
    cursor: pointer;
}
</style>

<style lang="less">
.el-button + .el-button {
    margin-left: 0 !important;
}

</style>
