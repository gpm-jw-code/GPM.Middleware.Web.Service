/**產生繪圖資料(喂給GPMChart.vue) */
export function GenDiagnoseChartData(data = { chartDatas: {} }, display_mode) {
  if (!display_modes.find((m) => m.value == display_mode)) {
    throw new Error('display_mode must be "HS"、"AID" or "AIH"')
  }

  var chartData
  var borderColor = 'gold'

  if (display_mode == 'HS') {
    chartData = data.chartDatas.healthScoreList
    borderColor = 'rgb(21, 237, 201)'
  }

  if (display_mode == 'AID') chartData = data.chartDatas.alertIndex_by_Day_List

  if (display_mode == 'AIH') chartData = data.chartDatas.alertIndex_by_Hour_List
  if (chartData == undefined) return { timeLs: [], datasets: [] }
  if (chartData.length == 0) {
    return { timeLs: [], datasets: [] }
  }

  var timeList = chartData.timeList
  var scoreList = chartData.valueList

  var datasets = [
    {
      label: display_mode.toString(),
      data: scoreList,
      borderColor: borderColor,
    },
  ]
  return { timeLs: timeList, datasets: datasets }
}

export const display_modes = [
  { label: 'Health Score', value: 'HS' },
  { label: 'Alert Index(day)', value: 'AID' },
  { label: 'Alert Index(Hour)', value: 'AIH' },
]
