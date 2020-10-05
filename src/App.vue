<template>
    <div id="app" style="display: flex; margin-left: 20px; margin-top: 40px;">
        <svg id='canvas' style="height: 500px; width: 800px; border: black solid 1px;">
            <g v-for="(points, index1) in polygon1.getPointSet()" v-bind:key=index1>
                <text v-for="(point, index) in points"
                      :x=point.lx
                      :y=point.ly
                      v-bind:key=index>{{point.index + 1}}</text>
                <circle v-for="(point, index) in points"
                        v-bind:key=index
                        :cx=point.x
                        :cy=point.y
                        :r="pointRadius"
                        class="circle">

                </circle>
            </g>

            <g v-for="(points, index1) in polygon2.getPointSet()" v-bind:key=index1>
                <text v-for="(point, index) in points"
                      :x=point.lx
                      :y=point.ly
                      v-bind:key=index>{{point.index + 1}}</text>
                <circle v-for="(point, index) in points"
                        v-bind:key=index
                        :cx=point.x
                        :cy=point.y
                        :r="pointRadius"
                        class="circle"
                        style="fill: blue;">
                </circle>
            </g>

<!--            <g v-for="(segment, index1) in polygon1.getSegSet()" v-bind:key=index1>-->
<!--                <g v-for="index in points.length" v-bind:key="index">-->
                    <line v-for="(segment, index) in polygon1.getSegSet()" v-bind:key=index
                          :x1="segment.begin.x"
                          :y1="segment.begin.y"
                          :x2="segment.end.x"
                          :y2="segment.end.y"
                          stroke="black">
                    </line>

<!--                    <line v-if="index - 1 === points.length - 1"-->
<!--                          :x1="points[index - 1].x"-->
<!--                          :y1="points[index - 1].y"-->
<!--                          :x2="points[0].x"-->
<!--                          :y2="points[0].y"-->
<!--                          stroke="black">-->
<!--                    </line>-->
<!--                </g>-->
<!--            </g>-->

<!--            <g v-for="(points, index1) in polygon2.getPointSet()" v-bind:key=index1>-->
<!--                <g v-for="index in points.length" v-bind:key="index">-->
<!--                    <line v-if="index - 1!== points.length - 1"-->
<!--                          :x1="points[index - 1].x"-->
<!--                          :y1="points[index - 1].y"-->
<!--                          :x2="points[index].x"-->
<!--                          :y2="points[index].y"-->
<!--                          stroke="blue">-->
<!--                    </line>-->

<!--                    <line v-if="index - 1 === points.length - 1"-->
<!--                          :x1="points[index - 1].x"-->
<!--                          :y1="points[index - 1].y"-->
<!--                          :x2="points[0].x"-->
<!--                          :y2="points[0].y"-->
<!--                          stroke="blue">-->
<!--                    </line>-->
<!--                </g>-->
<!--            </g>-->
            <line v-for="(segment, index) in polygon2.getSegSet()" v-bind:key=index
                  :x1="segment.begin.x"
                  :y1="segment.begin.y"
                  :x2="segment.end.x"
                  :y2="segment.end.y"
                  stroke="blue">
            </line>

        </svg>
        <div style="display: flex; flex-direction: column; margin-left: 20px;">
            <el-button
                @click="polygon = polygon2">
                绘制图形2
            </el-button>
            <el-button>
                进行裁剪
            </el-button>
        </div>

    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Polygon from '@/utils/polygon';
import Segment from '@/utils/segment';

export default Vue.extend({
    name: 'App',
    data: () => ({
        pointRadius: 4,
        polygon1: new Polygon(),
        polygon2: new Polygon(),
        polygon: new Polygon()
    }),
    mounted() {
        this.polygon = this.polygon1
        const rect = document.getElementById('canvas')!;
        rect.addEventListener('click', (event) => {
            const offset = rect.getBoundingClientRect();
            if(!this.polygon.addPoint(event.clientX - offset.x, event.clientY - offset.y)) {
                this.$message.error('无法添加该点。');
            }
        });
        rect.addEventListener('contextmenu', (event)=>{
            event.preventDefault();
            this.polygon.close();
        })
    },
    methods: {
        tailor(): Segment[] {
            return this.polygon1.clip(this.polygon2);
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
