<template>
  <div class="gpm-preview-chart" v-bind:style="chart_style" v-loading="loading">
    <div v-show="PreviewShow">
      <div class="d-flex">
        <el-button
          plain
          :type="isAdjustWindowSizeMode?'danger':'info'"
          size="small"
          @click="{isAdjustWindowSizeMode=!isAdjustWindowSizeMode ; isRightBoundClickDown=false} "
        >{{isAdjustWindowSizeMode?'結束調整':'調整窗大小'}}</el-button>
      </div>
      <div class="preview-region" id="preview-region" :style="previewChartStyle">
        <div class="d-flex preview h-100" id="time-window" v-bind:style="time_window_style">
          <!-- <div v-show="isAdjustWindowSizeMode" id="left-bound" class="bound-opt b-l bg-info h-100"></div> -->
          <div v-show="isAdjustWindowSizeMode" id="right-bound" class="bound-opt b-r h-100"></div>
        </div>
        <canvas class="preview" :id="'preview_chart_'+chart_id"></canvas>
      </div>
    </div>
  </div>
</template>
<script>
import Chart from 'chart.js'
import moment from 'moment';
export default {
  props: {
    chart_id: {
      type: String,
      default: 'preview-chart'
    },
    title: {
      type: String,
      default: "Title"
    },
    xAxisLabel: {
      type: String,
      default: "時間"
    },
    yAxisLabel: {
      type: String,
      default: "YLabel"
    },
    xlabelUseTimeFormat: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false,
      Rendering: false,
      PreviewShow: false,
      chart_style: {
        backgroundColor: '#202020',
        border: '1px solid grey',
        margin: '3px',
        borderRadius: '4px'
      },
      preview_chartInstance: {
        data: {
          labels: [],
          datasets: []
        },
        update: () => { }
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        lineTension: 0,
        tooltips: {
          mode: 'index',
          intersect: true
        },
        layout: {
          padding: {
            top: 1,
          },
        },
        title: {
          display: true,
          text: this.title,
          fontSize: 14,
          fontColor: 'white'
        },
        scales: {
          yAxes: [
            {
              gridLines: {
                color: '#313131',
              },
              ticks: {
                beginAtZero: true,
                padding: 20,
                fontColor: 'white',
                autoskip: true,
                maxTicksLimit: 10,
                min: 0,
                max: 100
              },
              scaleLabel: {
                display: true,
                labelString: this.yAxisLabel,
                fontSize: 16,
                fontColor: 'white'
              }
            }
          ],
          xAxes: [{
            type: 'time',
            time: {
              unit: 'hour',
              displayFormats: {
                day: 'YYYY-MM-DD HH:mm:ss',
                hour: 'YYYY-MM-DD HH:mm:ss'
              }
            },
            gridLines: {
              color: '#313131'
            },
            ticks: {
              autoskip: true,
              autoSkipPadding: 33,
              maxRotation: 0,
              minRotation: 0,
              fontColor: 'white'
            },
            scaleLabel: {
              display: true,
              labelString: this.xAxisLabel,
              fontSize: 16,
              fontColor: 'white'
            },
            getValueForPixel() {

            }
          }]
        },
        annotation: {
          drawTime: 'afterDraw',
          annotations: [{
            type: 'line',
            id: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: 2,
            borderWidth: 2,
            borderColor: 'red'
          }]
        },
        legend: { display: false }
      },
      xlabels: [],
      datasets: [],
      isDark: true,
      currentTheme: 'dark',
      colors: ['blue', 'green', 'red', 'orange', 'pink', 'grey', 'black', 'seagreen'],
      time_window_style: { visibility: 'visible', width: '100px', left: '100px', backgroundColor: 'white', },
      time_window_left_property: 100,
      time_window_width: 100,
      ori_time_window_width: 100,
      lastOffsetOFTimeWindow: 0,
      isTimeWindowClickDown: false,
      isRightBoundClickDown: false,
      isAdjustWindowSizeMode: false,
      bound_ori_mouse_x: -1,
      previewData: null
    }
  },
  methods: {

    ThemeChange() {
      this.currentTheme = this.currentTheme == 'dark' ? 'light' : 'dark';
      this.chart_style.backgroundColor = this.currentTheme == 'dark' ? "#202020" : "white";
      this.chart_style.border = this.currentTheme == 'dark' ? "1px solid grey" : "1px solid white";
      this.isDark = this.currentTheme == 'dark';
      this.chartInstance.options.title.fontColor =
        this.chartInstance.options.scales.xAxes[0].ticks.fontColor =
        this.chartInstance.options.scales.xAxes[0].scaleLabel.fontColor =
        this.chartInstance.options.scales.yAxes[0].ticks.fontColor =
        this.chartInstance.options.scales.yAxes[0].scaleLabel.fontColor = this.currentTheme == 'dark' ? 'white' : 'black';
      this.chartInstance.update();
    },
    ChartInit() {
      if (!this.xlabelUseTimeFormat) {
        this.options.scales.xAxes[0].type = "category";
      }
      //preview
      const ctx_preview = document.getElementById('preview_chart_' + this.chart_id);
      this.preview_chartInstance = new Chart(ctx_preview, {
        type: 'line',
        data: {
          labels: [],
          datasets: []
        },
        options: this.options,
      });
      this.preview_chartInstance.options.animation = false;
    },
    PreviewChartEventRegist() {
      this.TimeWindowDom.addEventListener('mousedown', (e) => this.TimeWindowMouseDown(e))
      this.TimeWindowDom.addEventListener('mouseup', (e) => this.TimeWindowMouseUp(e))
      this.TimeWindowDom.addEventListener('mousemove', (e) => this.TimeWindowMouseMove(e))

      document.getElementById('preview_chart_' + this.chart_id).addEventListener('mouseup', (e) => this.TimeWindowMouseUp(e))
      document.getElementById('preview_chart_' + this.chart_id).addEventListener('mousemove', (e) => this.TimeWindowMouseMove(e))
      document.getElementById('preview_chart_' + this.chart_id).addEventListener('mousedown', (e) => {
        if (this.isAdjustWindowSizeMode)
          return;
        var leftMin = this.preview_chartInstance.scales['x-axis-0'].left
        this.time_window_left_property = e.x - 50 <= leftMin ? leftMin : e.x - 25 - 50;
        this.time_window_style.left = this.time_window_left_property + "px";
      })

      document.getElementById("preview-region").addEventListener('mousemove', (e) => {
        if (this.isRightBoundClickDown) {
          console.log('adjust width', e);
          var increse = e.x - this.bound_ori_mouse_x;
          this.time_window_width = this.ori_time_window_width + increse;
          this.time_window_style.width = this.time_window_width + "px";
        }
      })
      document.getElementById("preview-region").addEventListener('mouseup', () => {
        this.isRightBoundClickDown = false;
      })

      document.getElementById("preview-region").addEventListener('mousedown', (e) => {
        this.ori_time_window_width = this.time_window_width;
        this.bound_ori_mouse_x = e.x;
      })

      document.getElementById("right-bound").addEventListener('mousedown', () => {
        this.isRightBoundClickDown = true;
      })
      document.getElementById("right-bound").addEventListener('mouseup', () => this.isRightBoundClickDown = false)
      document.getElementById("right-bound").addEventListener('mousemove', (e) => {
        if (this.isRightBoundClickDown) {
          console.log('adjust width', e);
        }
      })
    },
    async UpdatePreviewChart(previewData) {
      this.time_window_style.visibility = 'visible';
      this.previewData = previewData
      console.info('開始渲染');

      var _ds = previewData.datasets[0].data;
      if (previewData.ymax == -1) {
        this.preview_chartInstance.options.scales.yAxes[0].ticks.max = Math.max.apply(null, _ds);
      } else
        this.preview_chartInstance.options.scales.yAxes[0].ticks.max = previewData.ymax;
      if (previewData.ymin == -1) {
        this.preview_chartInstance.options.scales.yAxes[0].ticks.min = Math.min.apply(null, _ds);
      } else
        this.preview_chartInstance.options.scales.yAxes[0].ticks.min = previewData.min;


      this.preview_chartInstance.data.labels = previewData.labels;
      this.preview_chartInstance.data.datasets = previewData.datasets;
      this.preview_chartInstance.update();
      console.info('結束渲染');
    },
    ShowPreviewChart() {
      this.PreviewShow = true;
    },
    HidePreviewChart() {
      this.PreviewShow = false;
    },
    Clear() {
      this.preview_chartInstance.data.datasets = [];
      this.preview_chartInstance.data.labels = [];
      this.preview_chartInstance.update();
      this.previewData = null;
    },

    async RenderData(xlabels, datasets) {
      await new Promise((resolve, reject) => {
        try {
          this.chartInstance.data.datasets = datasets;
          this.chartInstance.data.labels = xlabels;
          this.chartInstance.update();

          console.info('結束渲染');
          resolve();
        } catch (error) {
          console.error(error);
          this.ChartInit();
          reject(error)
        }
      });
    },
    TimeWindowMouseDown(e) {
      if (this.isAdjustWindowSizeMode)
        return;
      this.isTimeWindowClickDown = true;
      this.lastOffsetOFTimeWindow = e.offsetX;
      this.time_window_style.backgroundColor = 'red';
    },
    TimeWindowMouseUp(e) {
      this.isTimeWindowClickDown = false;
      this.time_window_style.backgroundColor = 'white';

      if (!this.isAdjustWindowSizeMode) {
        console.info('mouse up so ', e);
        var _from = moment(this.preview_chartInstance.scales['x-axis-0'].getValueForPixel(this.time_window_left_property).toString()).format('yyyy/MM/DD HH:mm:ss');
        var _to = moment(this.preview_chartInstance.scales['x-axis-0'].getValueForPixel(this.time_window_left_property + this.time_window_width).toString()).format('yyyy/MM/DD HH:mm:ss');
        this.$emit("DateTimeIntervalOnchanged", { from: _from, to: _to });
      }
    },
    TimeWindowMouseMove(e) {
      if (this.isAdjustWindowSizeMode)
        return;
      if (this.isTimeWindowClickDown) {
        var leftMin = this.preview_chartInstance.scales['x-axis-0'].left
        this.time_window_left_property = e.x <= leftMin ? leftMin : e.x - 25;
        this.time_window_style.left = this.time_window_left_property + "px";

      }
    }
  },
  computed: {
    TimeWindowDom() {
      return document.getElementById("time-window");
    },
    previewChartStyle() {
      return window.screen.width > 560 ? "height:180px" : "height:120px";
    }
  },
  mounted() {
    this.ChartInit();
    this.PreviewChartEventRegist();
  },
  created() {
  }
}
</script>
<style >
.preview-region {
  position: relative;
  background-color: #313131;
}
.preview {
  position: absolute;
  z-index: 100;
}
#time-window {
  opacity: 0.1;
  background-color: rgba(255, 255, 255, 0.2);
  z-index: 2999;
  cursor: move;
  border: 2px solid blue;
}
.bound-opt {
  background-color: rgb(80, 200, 255);
  width: 7px;
  position: absolute;
  z-index: 3000;
}
.bound-opt:hover {
  background-color: rgb(0, 247, 255);
  cursor: grab;
}

.b-l {
  left: -7px;
}
.b-r {
  right: -7px;
}

#time-window:hover {
  border: 2px solid white;
}
</style>