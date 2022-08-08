<template>
  <div class="gpm-chart" v-bind:style="chart_style" v-loading="loading">
    <!-- <div class="d-flex theme">
      <el-icon
        v-show="!isDark"
        @click="ThemeChange"
        class="light-icon"
        :color="currentTheme!='dark'? 'black':'white'"
      >
        <Sunny />
      </el-icon>
      <el-switch
        active-color="rgb(19, 19, 19)"
        inactive-color="rgb(226, 226, 226)"
        v-model="isDark"
        @change="ThemeChange"
      />
      <el-icon
        v-show="isDark"
        @click="ThemeChange"
        class="dark-icon"
        :color=" currentTheme!='dark'? 'white':'black'"
      >
        <Moon />
      </el-icon>
    </div>
    -->
    <canvas class="h-100" @click="ClickChartHandel" :id="chart_id"></canvas>
  </div>
</template>
<script>
import Chart from 'chart.js'
export default {
  components: {
  },
  props: {
    chart_id: {
      type: String,
      default: 'dchart'
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
      chart_style: {
        backgroundColor: '#202020',
        border: '1px solid grey',
        margin: '3px',
        borderRadius: '4px'
      },
      chartInstance: {
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
            bottom: 10,
            top: 10,
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
              unit: 'second',
              displayFormats: {
                day: 'YYYY-MM-DD',
                hour: 'YYYY-MM-DD HH',
                second: 'YY/MM/DD HH:mm:ss'
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
        legend: { display: true }
      },
      xlabels: [],
      datasets: [],
      datasetsVisible: [],
      isDark: true,
      currentTheme: 'dark',
      colors: ['blue', 'green', 'red', 'orange', 'pink', 'grey', 'black', 'seagreen']
    }
  },
  methods: {
    test() {
      this.chartInstance.setDatasetVisibility(1, false); // hides dataset at index 1
      this.chartInstance.update(); // chart now renders with dataset hidden

    },
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
    ClickChartHandel() {
    },
    ChartInit() {

      if (!this.xlabelUseTimeFormat) {
        this.options.scales.xAxes[0].type = "category";
      }

      const ctx = document.getElementById(this.chart_id);
      this.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [],
          datasets: []
        },
        options: this.options,
      });
      this.chartInstance.options.animation = false;
    },
    async UpdatePreviewChart(timeList = [], valueList = []) {
      this.$refs['preview_chart'].UpdatePreviewChart(timeList, valueList);
    },
    async UpdateChart(datavw, timeUnit = 'second', showLoading = false) {
      try {
        console.info('開始渲染');
        // this.Clear();
        if (showLoading)
          this.loading = true;

        await this.RenderData(datavw, timeUnit);
        setTimeout(() => {
          this.loading = false;
        }, 100);
      } catch (error) {
        return "err";
      }
    },
    ShowPreviewChart() {
      this.$refs['preview_chart'].ShowPreviewChart();
    },
    HidePreviewChart() {
      this.$refs['preview_chart'].HidePreviewChart();
    },
    FeedData(time = [], dataSets = [{ label: '', data: -1, borderColor: 'blue', borderWidth: 1 }]) {
      if (dataSets.length == 0)
        return;
      if (time == undefined)
        return;

      this.xlabels.push(time);
      dataSets.forEach(dataObj => {
        var series = this.datasets.find(s => s.label == dataObj.label);
        if (series) {
          series.data.push(dataObj.data);
        } else {
          this.datasets.push({
            label: dataObj.label,
            data: [dataObj.data],
            backgroundColor: "",
            borderColor: dataObj.borderColor ? dataObj.borderColor : 'blue',
            borderWidth: dataObj.borderWidth ? dataObj.borderWidth : 1,
            fill: false,
            pointStyle: 'none',
            pointRadius: 0, lineTension: 0,
          })
        }
      })
      this.DataFIFO();
      this.RenderData();
    },
    Clear() {
      this.datasetsVisible = [];
      this.RenderData([], []);
    },

    async RenderData(datavw, timeUnit = 'second') {
      await new Promise((resolve, reject) => {
        try {
          var _ds = datavw.datasets[0].data;
          if (datavw.ymax == -1) {
            this.chartInstance.options.scales.yAxes[0].ticks.max = Math.max.apply(null, _ds);
          } else
            this.chartInstance.options.scales.yAxes[0].ticks.max = datavw.ymax;
          if (datavw.ymin == -1) {
            this.chartInstance.options.scales.yAxes[0].ticks.min = Math.min.apply(null, _ds);
          } else
            this.chartInstance.options.scales.yAxes[0].ticks.min = datavw.ymin;

          this.chartInstance.options.scales.xAxes[0].time.unit = timeUnit;
          this.chartInstance.data.datasets = datavw.datasets;
          this.chartInstance.data.labels = datavw.labels;
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
    DataFIFO() {
      if (this.xlabels.length > 50) {
        this.xlabels.splice(0, 1);
        this.datasets.forEach(s => {
          s.data.splice(0, 1)
        })
      }
    },

  },
  computed: {
    currentDataSet() {
      var dataAry = [];
      this.chartInstance.data.datasets.forEach(s => {
        dataAry.push(s.data)
      })

      return {
        labels: this.chartInstance.data.labels,
        datas: dataAry
      }
    },
    TimeWindowDom() {
      return document.getElementById("time-window");
    }
  },
  mounted() {
    this.ChartInit();

  },
  created() {
  }
}
</script>
<style >
.setting-region .el-icon {
  position: absolute;
  padding-top: 15px;
  cursor: pointer;
  z-index: 3014;
}

.setting-region .light-icon {
  left: 1px;
}
.setting-region .dark-icon {
  right: 1px;
}

.setting-region button {
  border-radius: 30px;
}

.setting-region:hover {
  opacity: 1;
}
.color-dis {
  width: 20px;
  height: 12px;
  margin-top: 5px;
  margin-left: 5px;
}
</style>