<template>
    <div id="app" style="display: flex; margin-left: 20px; margin-top: 40px;">
        <svg id='canvas' style="height: 500px; width: 800px; border: black solid 1px;">
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

            <g v-for="points in result" v-show="result.length !== 0">
                <line v-for="(segment, index) in points" v-bind:key=index
                      :x1="segment.x"
                      :y1="segment.y"
                      :x2="points[index !== points.length - 1 ? index + 1 : 0].x"
                      :y2="points[index !== points.length - 1 ? index + 1 : 0].y"
                      stroke="red">
                </line>
            </g>

        </svg>
        <div style="display: flex; flex-direction: column; margin-left: 20px;">
            <el-button
                @click="polygon = polygon2">
                绘制图形2
            </el-button>
            <el-button
                @click="tailor">
                进行裁剪
            </el-button>
        </div>

    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Polygon from '@/utils/polygon';
import Point from '@/utils/point';

export default Vue.extend({
    name: 'App',
    data: () => ({
        pointRadius: 4,
        polygon1: new Polygon(),
        polygon2: new Polygon(),
        polygon: new Polygon(),
        result: [] as Point[][],
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
            this.polygon.close();
        })
    },
    methods: {
        tailor(): void {
            this.result = this.polygon2.clip(this.polygon1);
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
