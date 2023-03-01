<template v-if="isRouterAlive">
  <div style="height: 500px" :key="key">
    <vue3-chart-js v-bind="{ ...lineChart }" />
  </div>
</template>

<script>
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs';
import _ from 'lodash';
import moment from 'moment';

const date = new Date(); // 當前時間國字格式
const year = date.getFullYear(); // 當年
const month = date.getMonth() + 1; // 當月
// const day = new Date(year, month, 0); // 當日
const nowTime = moment(new Date()).format('YYYY-MM-01'); // 當前日期轉換第一天
const dateCount = [];
const totalCount = []; // 營業額
const orderCount = []; // 訂單量
// const receivedAmount = this.$t('order_receivedAmount');
export default {
  name: 'App',
  components: {
    Vue3ChartJs,
  },
  props: {
    // 外層傳進來的資料(每次點擊資料都會不同 要寫在watch裡面)
    chartData: {
      type: String,
      default() {
        return '';
      },
    },
  },
  watch: {
    chartData() {
      console.log(this.chartData);
      console.log(dateCount);
      this.dateRange.startAt = this.chartData; // 內層等於外層
      console.log(this.chartData);
      // this.lineChart.data.labels.push(this.dateRange.startAt);
      console.log(dateCount);
      // this.getChart_data();
      // this.getDate();
    },
  },
  data() {
    return {
      isRouterAlive: false,
      // 時間選擇器
      dateRange: {
        startAt: '1',
        endAt: '2022-12',
        payMethodId: null,
        merchantId: null,
      },
      // 選擇的月份
      chooseMonth: 1,
      chooseYear: 1,
      chooseYYDD: '',
      // 當月所有數據
      allMonth_data: [],
      // 重新更新組件
      key: 0,
    };
  },
  setup() {
    const lineChart = {
      type: 'line',
      options: {
        maintainAspectRatio: false,
        // aspectRatio: 1,
        responsive: true, // 符合響應式
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
        // stacked: false,
        borderRadius: 4,
        color: 'white', // 下方標籤顏色
        font: {
          weight: 'bold',
        },
        formatter: Math.round,
        padding: 6,
        scales: {
          x: {
            //     type: 'time',
            //     time: {
            //   // Luxon format string
            //   tooltipFormat: 'DD T'
            // },
            // 顯示X軸名稱
            // title: {
            //   display: true,
            //   text: '日期',
            //   color: 'white',
            // },
            grid: {
              color: '#7D7E79', // X軸表格顏色
            },
            ticks: {
              color: '#AEB2B3', // x軸標籤顏色
              callback(val, index) {
                // Hide every 2nd tick label
                // console.log(val, index, month);
                // if (month === 4 || month === 6 || month === 9 || month === 11) {
                //   console.log('抓到小月');
                return index % 3 === 0 ? this.getLabelForValue(val) : '';
                // }
                // if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
                //   console.log('抓到大月');
                //   return index % 3 === 0 ? this.getLabelForValue(val) : '';
                // }
                // return index % 3 === 0 ? this.getLabelForValue(val) : '';
                /* X軸隱藏幾個刻度 */
              },
              // stepSize:6,
              // maxTicksLimit:6,  // X軸最大區間
            },
          },

          y: {
            min: 0,
            // max: 1000000,
            type: 'linear',
            display: true,
            position: 'top',
            // id: 'first-y-axis',
            grid: {
              color: '#7D7E79',
            },
            ticks: {
              stepSize: 50000,
              color: '#AEB2B3', // y軸標籤顏色
              callback(val) {
                // console.log(val, index);
                return `${this.getLabelForValue(val)} 元`;
              },
            },
            // 顯示Y1軸名稱
            title: {
              display: true,
              text: '代收總量',
              color: 'white',
              align: 'center',
            },
          },
          // Y軸右邊數字
          y1: {
            min: 0,
            // max: 3,
            type: 'linear',
            display: true,
            position: 'right',
            // id: 'y1',
            grid: {
              color: '#7D7E79',
            },
            ticks: {
              color: '#AEB2B3', // y軸標籤顏色
              callback(val, index) {
                console.log(val, index);
                return `${this.getLabelForValue(val)} 單`;
              },
              stepSize: 1,
            },
            // 顯示Y2軸名稱
            title: {
              display: true,
              text: '訂單量',
              color: 'white',
              align: 'center',
              unit: '筆',
              // font: {
              //   weight: 'bold',
              //   size: '12px',
              // },
            },
          },

          // yAxes: [
          //   {
          //     id: 'left-y-axis',
          //     type: 'linear',
          //     position: 'left',
          //   },
          //   {
          //     id: 'right-y-axis',
          //     type: 'linear',
          //     position: 'right',
          //   },
          // ],
        },
      },
      data: {
        // X軸參數名稱
        labels: dateCount,
        // labels: ['2023-01-01', '2023-01-02', '2023-01-03', '2023-01-04', '2023-01-05', '2023-01-06', '2023-01-07', '2023-01-08', '2023-01-09', '2023-01-10', '2023-01-11', '2023-01-12','2023-01-13','2023-01-14','2023-01-15','2023-01-16','2023-01-17','2023-01-18','2023-01-19','2023-01-20','2023-01-21','2023-01-22','2023-01-23','2023-01-24','2023-01-25','2023-01-26','2023-01-27','2023-01-28','2023-01-29','2023-01-30','2023-01-31'],
        // 下方2樣標籤
        datasets: [
          {
            label: '代收總量',
            backgroundColor: ['#fff'], // 標點顏色
            pointBorderWidth: 2.5, // 標點外框粗細
            borderWidth: 5, // 曲線外框粗細
            pointRadius: 7, // 標點大小
            borderColor: '#2980b9', // 曲線顏色
            data: totalCount,
            tension: 0.5, // 弧度
            fill: false, // 曲線是否填滿
            // yAxisID: 'left-y-axis',
          },
          {
            label: '訂單量',
            pointBorderWidth: 2.5,
            borderColor: '#fff', // 曲線顏色
            backgroundColor: ['rgba(119, 96, 196, 0.54)'],
            tension: 0.5,
            borderWidth: 2, // 曲線外框粗細
            pointRadius: 5, // 標點大小
            fill: true,
            data: orderCount,
            yAxisID: 'y1',
          },
        ],
      },
    };
    return {
      lineChart,
    };
  },
  methods: {
    // 取得日期
    getChart() {
      if (this.chartData === '') {
        // 抓取當前時間
        this.dateRange.startAt = nowTime;
        // dateCount.push(this.dateRange.startAt);
        this.getMonthDays(month);
        console.log(this.chartData);
      }
      // 選擇的日期
      if (this.chartData !== 0) {
        console.log(this.chartData);
        this.chooseMonth = this.$filters.thisMonth(this.chartData); // 取得所選月份
        this.chooseYear = this.$filters.getYear(this.chartData); // 取得所選年分
        this.chooseYYDD = this.$filters.thisYYDD(this.chartData);
        console.log(this.chooseMonth);
        console.log(this.chooseYYDD);
        dateCount.splice(0, dateCount.length);
        this.getMonthDays(this.chooseMonth);
        // this.getChart_data();
      } else {
        dateCount.splice(0, dateCount.length);
      }
    },
    // 獲取每月中所有日期  （當月1號開始）
    getMonthDays(n) {
      console.log(this.chartData);
      // 当前月天数
      const daysInMonth = moment(`${this.chooseYYDD}`, 'YYYY-MM').daysInMonth();
      console.log(daysInMonth);

      for (let i = 0; i < daysInMonth; i += 1) {
        const day = moment(
          moment()
            .month(moment().month() + n)
            .startOf('month')
            .add(i, 'days')
            .valueOf(),
        ).format(`${this.chooseYear}-${this.chooseMonth}-DD`);
        dateCount.push(day);
        // totalCount.push(0);
        // console.log(dateCount);
      }
      if (this.chooseMonth === '01') {
        dateCount[30] = `${this.chooseYear}-01-31`;
      }
      return dateCount;
    },
    // 獲取指定日期數據圖表
    getChart_data() {
      // 当前月天数
      const daysInMonth = moment(`${this.chooseYYDD}`, 'YYYY-MM').daysInMonth();
      console.log(daysInMonth);
      // 抓起始日 & 結束日
      this.dateRange.startAt = moment(this.chartData).utc().format();
      this.dateRange.endAt = moment(this.chartData).utc().add(daysInMonth, 'days').format();
      console.log(this.dateRange.startAt);
      console.log(this.dateRange.endAt);
      totalCount.length = 0;
      orderCount.length = 0;
      for (let i = 0; i < daysInMonth; i += 1) {
        totalCount.push(0);
        orderCount.push(0);
      }
      this.$http.post('/api/getMyOrderDailyReport', this.dateRange).then((res) => {
        // console.log(res.data.data);
        this.allMonth_data = res.data.data;
        console.log(this.allMonth_data);
        _.forEach(this.allMonth_data, (item, key) => {
          console.log(item.date);
          console.log(item.totalAmount);
          this.allMonth_data[key].getDate = this.$filters.thisDate(item.date);
          console.log(item.getDate);
          console.log(Number(item.getDate));
          totalCount[Number(item.getDate) - 1] = item.totalAmount;
          orderCount[Number(item.getDate) - 1] = item.orderCount;
          console.log(totalCount);
          // this.reload_lineChart();
          this.handleUpdateClick();
        });
        // this.reload_lineChart();
        return totalCount;
      });
    },
    // 重新整理圖表
    handleUpdateClick() {
      this.key += 1;
    },
  },
  created() {
    console.log(year, month, date.getDate(), nowTime);
    this.getChart();
    this.getChart_data();
  },
};
</script>
