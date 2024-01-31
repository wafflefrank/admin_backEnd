<template>
  <div class="row">
    <div class="col-lg-3 col-md-6 col-12">
      <div class="mb-4 card">
        <div class="p-3 card-body">
          <div class="d-flex flex-row-reverse justify-content-between">
            <div class="d-flex flex-column align-items-center">
              <div class="text-center icon-shape bg-gradient-primary d-flex align-items-center justify-content-center flex-column">
                <i class="fa-solid fa-yen-sign fs-3 text-white"></i>
              </div>
              <el-button color="#faa30d" class="mt-2 text-white bill_btn fw-bold fs-6" size="small" @click="billVisible = true">{{ this.$t('settle') }}<i class="fa-solid fa-sack-xmark ms-1"></i></el-button>
            </div>
            <div class="">
              <div class="numbers">
                <p class="mb-3 text-sm font-weight-bold fs-5">{{ this.$t('total') }}</p>
                <h4 class="font-weight-bolder">${{ this.OrderTotal.billAmount_able }}</h4>

                <!-- <span class="text-sm text-success">+55%</span> since yesterday -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-3 col-md-6 col-12">
      <div class="mb-4 card">
        <div class="p-3 card-body">
          <div class="d-flex flex-row-reverse justify-content-between">
            <div>
              <div class="text-center icon-shape bg-gradient-danger">
                <i class="fa-solid fa-money-bill-transfer fs-4 text-white"></i>
              </div>
            </div>
            <div>
              <div class="numbers">
                <p class="mb-3 text-sm font-weight-bold fs-5">{{ this.$t('awaitingPayment') }}</p>
                <h4 class="font-weight-bolder">${{ this.lockedAmount }}</h4>
                <!-- <span class="text-sm text-success fw-bold">+3%</span> since last week -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-3 col-md-6 col-12">
      <div class="mb-4 card">
        <div class="p-3 card-body">
          <div class="d-flex flex-row-reverse justify-content-between">
            <div>
              <div class="text-center icon icon-shape bg-gradient-success border-radius-2xl">
                <i class="fa-solid fa-coins fs-4 text-white"></i>
              </div>
            </div>
            <div class="">
              <div class="numbers">
                <p class="mb-3 text-sm font-weight-bold fs-5">{{ this.$t('transactionMonth') }}</p>
                <h4 class="font-weight-bolder">${{ this.OrderTotal.monthTotal }}</h4>
                <!-- <span class="text-sm text-danger">-2%</span> since last quarter -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-3 col-md-6 col-12">
      <div class="mb-4 card">
        <div class="p-3 card-body">
          <div class="d-flex flex-row-reverse justify-content-between">
            <div>
              <div class="text-center icon icon-shape bg-gradient-warning border-radius-2xl">
                <i class="fa-solid fa-arrow-down-1-9 fs-4 text-white"></i>
              </div>
            </div>
            <div class="">
              <div class="numbers">
                <p class="mb-3 text-sm font-weight-bold fs-5">{{ this.$t('amountThisMonth') }}</p>
                <h4 class="font-weight-bolder">{{ this.ThisMonthNums }}</h4>
                <!-- <span class="text-sm text-success">+5%</span> than last month -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-12 col-lg-12 col-xl-12">
      <div class="card_barStyle radius-10 p-3">
        <div class="d-flex align-items-center justify-content-between">
          <h2 class="text-white d-flex flex-start my-4">{{ this.$t('statisticsChart') }}</h2>
          <div class="block date_Style me-5">
            <!-- <span class="demonstration text-white">Month</span> -->
            <el-date-picker v-model="timeValue" type="month" placeholder="Pick a month" @change="getMonth()" />
          </div>
        </div>
        <div class="hstack flex-wrap align-items-center justify-content-evenly gap-3 gap-sm-4 mb-4 border p-3 radius-10">
          <div class="d-flex align-items-center">
            <p class="mb-0 fs-5 text-light me-5">{{ this.$t('todayTransaction') }}</p>
            <h5 class="mb-0">
              <span class="text-white font-13"
                >{{ this.todayOrder_amount }}<span class="fs-6">{{ this.$t('unit') }}</span></span
              >
            </h5>
          </div>
          <div class="vr"></div>
          <div class="d-flex align-items-center">
            <p class="mb-0 fs-5 text-light me-5">{{ this.$t('todayOrders') }}</p>
            <h5 class="mb-0">
              <span class="text-white font-13"
                >{{ this.todayOrder_count }}<span class="fs-6">{{ this.$t('unit') }}</span></span
              >
            </h5>
          </div>
        </div>
        <div v-if="isRouterAlive">
          <LiveChart :chartData="monthDate_plus"></LiveChart>
        </div>
      </div>
    </div>
    <!-- <div class="col-12 col-lg-8 col-xl-4">
      <div class="card_barStyle radius-10 p-5">
        <PieChart></PieChart>
      </div>
    </div> -->
  </div>
  <!-- 結算彈窗 -->
  <el-dialog class="billModel_style" v-model="billVisible" :title="this.$t('settlement_confirm')" width="50%" center>
    <!-- <el-input class="bankName_style" v-model="google_code" placeholder="銀行名稱"> </el-input> -->
    <div class="d-flex align-items-center chooseBill_style">
      <span>{{ this.$t('settlement_account') }}</span>
      <el-select class="chooseBank_style" v-model="billAdd_Form.bankOwner" :placeholder="this.$t('choose_account')" @change="chooseBank_name(billAdd_Form.bankOwner)" clearable>
        <el-option v-for="item in bankCard" :value="item.id" :key="item.bankOwner" :label="`${item.bankOwner} ｜ ${item.bankAccount}`"></el-option>
      </el-select>
    </div>
    <div class="d-flex align-items-center chooseBill_style">
      <span>{{ this.$t('bank') }}</span>
      <el-select disabled class="chooseBank_style" v-model="billAdd_Form.bankName" :placeholder="this.$t('bank')" clearable>
        <el-option v-for="item in bankCard" :value="item.id" :key="item" :label="item.bankName"></el-option>
      </el-select>
    </div>
    <el-input class="addInfo_style mt-3" v-model="billAdd_Form.amount" :placeholder="this.$t('settlement_amount')" oninput="value=value.replace(/[^0-9.]/g,'')">
      <template #prepend>{{ this.$t('settlement_amount') }}</template>
    </el-input>
    <div class="d-flex align-items-center">
      <el-input class="addInfo_style mt-3" v-model="billAdd_Form.paidPassword" :placeholder="this.$t('Transaction_pwd')" type="password">
        <template #prepend>{{ this.$t('Transaction_pwd') }}</template>
      </el-input>
      <div @click="resetPwd()" @keydown="resetPwd()" class="resetPwd_style mt-3">
        <span class="text-white">{{ this.$t('Transaction_resetPwd') }}</span>
      </div>
    </div>
    <div class="d-flex flex-column align ms-4">
      <div class="d-flex mt-5">
        <span class="fs-6 text-white">{{ this.$t('Remark') }}</span>
      </div>
      <div>
        <span class="text-light"
          >{{ this.$t('Fee') }}: <span class="text-deep2-danger ms-1 fw-bold">{{ this.xfFee }}{{ this.$t('unit') }}</span></span
        >
      </div>
    </div>

    <div class="d-flex justify-content-center">
      <el-button color="#faa30d" plain class="cancel_btn p-4 mt-4 fw-bold fs-5 align-self-center" size="default" @click="cancelBill()">{{ this.$t('Cancel') }}</el-button>
      <el-button color="#faa30d" class="confirm_btn p-4 mt-4 fw-bold fs-5 align-self-center" size="default" @click="conFirmBill()">{{ this.$t('confirm') }}</el-button>
    </div>
  </el-dialog>
  <!-- 重置密碼彈窗 -->
  <el-dialog class="billModel_style" v-model="resetPwdVisible" :title="this.$t('Setting_pwd')" width="50%" center>
    <el-input class="addInfo_style mt-3" v-model="resetPwd_Form.paidPassword" :placeholder="this.$t('Transaction_pwd')" type="password">
      <template #prepend>{{ this.$t('Transaction_pwd') }}</template>
    </el-input>

    <el-input class="addInfo_style mt-3" v-model="paidPassword_sec" :placeholder="this.$t('confirm_pwd')" type="password">
      <template #prepend>{{ this.$t('confirm_pwd') }}</template>
    </el-input>
    <div class="d-flex" style="margin-left: 200px">
      <span class="fs-6 text-deep-danger fw-bold me-2">※</span>
      <span class="fs-6 text-white">{{ this.$t('rule_pwd') }}</span>
    </div>
    <el-input class="addInfo_style mt-3" v-model="resetPwd_Form.googleVerifyCode" :placeholder="this.$t('googleCode')">
      <template #prepend>{{ this.$t('googleCode') }}</template>
    </el-input>

    <div class="d-flex justify-content-center">
      <el-button color="#faa30d" class="save_btn p-4 mt-4 fw-bold fs-5 align-self-center" size="default" @click="savePwd()">{{ this.$t('Save') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import moment from 'moment';
import _ from 'lodash';
import { ElMessage } from 'element-plus';
// import PieChart from '../components/LiveChart/PieChart.vue';
import LiveChart from '../components/LiveChart/LiveChart3.vue';
// 千分位
const comma = /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g;
const defaultDateRange = moment(new Date()).format('YYYY-MM-01');
// 當前時間
const nowTime = moment(new Date()).format();
export default {
  components: {
    LiveChart,
    // PieChart,
  },
  provide() {
    return {
      reload_LineChart: this.reload_lineChart,
    };
  },
  data() {
    return {
      isRouterAlive: true,
      defaultTime: '',
      // 結算彈窗
      billVisible: false,
      // 支付密碼彈窗
      resetPwdVisible: false,
      // 結算表單
      billAdd_Form: {
        amount: '',
        bankAccount: '',
        bankName: '',
        bankOwner: '',
        bankType: '',
        billType: 'T0',
        createdAt: '',
        billId: '',
        id: '',
        merchantId: '',
        paidPassword: '',
      },
      // 密碼重置表單
      resetPwd_Form: {
        paidPassword: '',
        googleVerifyCode: '',
      },
      // 再次密碼確認
      paidPassword_sec: '',
      bankCard: [],
      // 訂單金額
      OrderTotal: {
        dayTotal: '',
        monthTotal: '',
        billAmount_able: '', // 可結算金額
      },
      lockedAmount: '',
      // 錯誤訊息
      errorMsg: {
        paidPassword: '',
        resetPwd: '',
      },
      // 當前選擇時間
      timeValue: '',
      // 月份天數
      dateValue: '',
      // 當前時間轉成訂單建立時間
      nowTime_billAt: '',
      // 當前時間轉成訂單
      nowTime_billID: '',
      // 月份+日期
      monthDate_plus: '',
      // 當月所有數據
      allMonth_data: [],
      // 本月筆數
      ThisMonthNums: '',
      // 本月月份:
      ThisMonth: '',
      // 時間選擇器
      dateRange: {
        startAt: '1',
        endAt: '2022-12',
        payMethodId: null,
        merchantId: null,
      },
      // 查詢當日的交易額
      dailyOrder: {
        startAt: '1',
        endAt: '2022-12',
        payMethodId: null,
        merchantId: null,
      },
      // 今日交易額
      todayOrder_amount: '',
      // 今日訂單量
      todayOrder_count: '',
      // 下發手續費
      xfFee: '',
    };
  },
  methods: {
    // getHomeData() {
    //   // this.isLoading = true;

    //   // this.liveChartInfo = [
    //   //   { value: 1, name: 'ETH' },
    //   //   { value: 2, name: 'BTC' },
    //   //   { value: 30, name: 'USDT' },
    //   // ];
    //   // this.liveChartInfo = res.data.data.walletData.currency;
    // },

    // 商戶資料
    getMyInfo() {
      this.$http.get('/api/myInfo').then((res) => {
        console.log(res.data.data);
        this.OrderTotal.billAmount_able = res.data.data.billableAmount.toString().replace(comma, ',');
        this.lockedAmount = res.data.data.lockedAmount.toString().replace(comma, ',');
        this.xfFee = res.data.data.xfRate;
      });
    },
    // 取得銀行卡清單
    getBankList() {
      this.$http.get('/api/getMyBanks').then((res) => {
        console.log(res.data.data);
        this.bankCard = res.data.data;
      });
    },
    // 選擇銀行
    chooseBank_name(item) {
      console.log(item);
      _.forEach(this.bankCard, (item1, key) => {
        if (this.bankCard[key].id === item) {
          this.billAdd_Form.id = item;
          this.billAdd_Form.bankAccount = item1.bankAccount;
          this.billAdd_Form.bankName = item1.bankName;
          this.billAdd_Form.bankOwner = item1.bankOwner;
          this.billAdd_Form.bankType = item1.bankType;
          this.billAdd_Form.merchantId = item1.merchantId;
          console.log(this.billAdd_Form.id, item, this.billAdd_Form.bankAccount);
        }
      });
    },
    // 重置支付密碼
    resetPwd() {
      this.resetPwdVisible = true;
    },
    // 保存支付密碼
    savePwd() {
      this.$http.post('/api/updateMyPaidPassword', this.resetPwd_Form).then((res) => {
        console.log(res.data.code);
        console.log(res.data.msg);
        const addMsg = res.data.msg;
        if (this.resetPwd_Form.paidPassword !== this.paidPassword_sec) {
          ElMessage({ showClose: true, message: '二次密碼不一致', type: 'warning' });
        }
        if (res.data.code === 200) {
          this.resetPwdVisible = false;
          ElMessage({ showClose: true, message: `${res.data.msg}`, type: 'success' });
        } else if (res.data.code === 422) {
          this.errorMsg.resetPwd = _.findKey(addMsg, ['param', 'paidPassword']);
          console.log(this.errorMsg.resetPwd);
          if (this.errorMsg.resetPwd !== undefined) {
            ElMessage({ showClose: true, message: `${res.data.msg.paidPassword.msg}`, type: 'error' });
          }
          this.errorMsg.googleVerifyCode = _.findKey(addMsg, ['param', 'googleVerifyCode']);
          console.log(this.errorMsg.bankName);
          if (this.errorMsg.googleVerifyCode !== undefined) {
            ElMessage({ showClose: true, message: `${res.data.msg.googleVerifyCode.msg}`, type: 'error' });
          }
        }
        this.resetPwd_Form.paidPassword = '';
        this.resetPwd_Form.googleVerifyCode = '';
      });
    },
    // 確認提交
    conFirmBill() {
      this.nowTime_billAt = nowTime;
      this.nowTime_billAt = this.$filters.dateTime3(this.nowTime_billAt);
      console.log(this.nowTime_billAt);
      this.nowTime_billID = moment().format('YYYYMMDDHHmmss');
      console.log(this.nowTime_billID);
      this.billAdd_Form.createdAt = this.nowTime_billAt;
      this.billAdd_Form.billId = this.nowTime_billID;
      this.$http.post('/api/bill', this.billAdd_Form).then((res) => {
        console.log(res.data.code);
        console.log(res.data.msg);
        const addMsg = res.data.msg;
        if (res.data.code === 200) {
          this.billVisible = false;
          this.$swal.fire('結算成功!', '結算成功', 'success');
        } else if (res.data.code === 422) {
          this.errorMsg.paidPassword = _.findKey(addMsg, ['param', 'paidPassword']);
          console.log(this.errorMsg.paidPassword);
          if (this.errorMsg.paidPassword !== undefined) {
            ElMessage({ showClose: true, message: `${res.data.msg.paidPassword.msg}`, type: 'error' });
          }
        } else {
          ElMessage({ showClose: true, message: `${res.data.msg}`, type: 'error' });
        }
      });
    },
    // 取消提交
    cancelBill() {
      this.billVisible = false;
    },
    getDayMonthOrderTotal() {
      this.$http.get('/api/getDayMonthOrderTotal').then((res) => {
        console.log(res.data.data);
        this.OrderTotal.dayTotal = res.data.data.dayTotalOrderAmount;
        this.OrderTotal.monthTotal = res.data.data.monthTotalOrderAmount;
      });
    },
    getMonth() {
      console.log(this.timeValue);
      if (this.timeValue !== null) {
        this.dateValue = this.$filters.thisMonthDays(this.timeValue);
        console.log(this.dateValue);
        this.monthDate_plus = this.$filters.dateTime4(this.timeValue);
        console.log(this.monthDate_plus);
        this.reload_lineChart();
      } else {
        console.log(this.timeValue);
        this.monthDate_plus = 0;
        console.log(this.monthDate_plus);
        this.reload_lineChart();
      }
    },
    getThisMonth() {
      // 当前月天数
      const daysInMonth = moment(`${nowTime}`, 'YYYY-MM').daysInMonth();
      console.log(daysInMonth);
      // 本月的月份
      this.ThisMonth = this.$filters.thisMonth(nowTime);
      // 抓起始日 & 結束日
      this.dateRange.startAt = moment(nowTime).utc().format(`YYYY-${this.ThisMonth}-01`);
      this.dateRange.endAt = moment(this.dateRange.startAt).utc().add(daysInMonth, 'days').format();
      console.log(this.dateRange.startAt);
      console.log(this.dateRange.endAt);
      this.$http.post('/api/getMyOrderDailyReport', this.dateRange).then((res) => {
        if (res.data.data.length === 0) {
          this.ThisMonthNums = 0;
        } else {
          this.ThisMonthNums = res.data.data[0].orderCount;
          console.log(this.ThisMonthNums);
        }
      });
    },
    // 獲取今日交易額 & 訂單量
    getDailyReport() {
      this.dailyOrder.startAt = moment(nowTime).utc().format();
      this.dailyOrder.endAt = moment(nowTime).utc().format();
      console.log(this.dailyOrder.startAt);
      this.$http.post('/api/getMyOrderDailyReport', this.dailyOrder).then((res) => {
        console.log(res.data);
        if (res.data.data.length === 0) {
          this.todayOrder_amount = 0;
          this.todayOrder_count = 0;
        } else {
          this.todayOrder_amount = res.data.data[0].totalAmount.toString().replace(comma, ',');
          this.todayOrder_count = res.data.data[0].orderCount.toString().replace(comma, ',');
          console.log(this.ThisMonthNums);
        }
      });
    },
    // 重新整理圖表
    reload_lineChart() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        // 刷新後執行
        this.isRouterAlive = true;
        // this.getMonth();
      });
    },
  },
  created() {
    this.timeValue = defaultDateRange; // DatePicker預設日期
    this.monthDate_plus = defaultDateRange; // 外層傳送給內層chart的初始日期
    this.getMyInfo();
    this.getDayMonthOrderTotal();
    this.getBankList();
    console.log(nowTime);
    this.getThisMonth();
    this.getDailyReport();
  },
};
</script>

<style lang="scss" scoped>
// 結算鈕
.bill_btn {
  background-image: linear-gradient(310deg, #5e72e4, #825ee4);
  border: none;
  &:hover {
    opacity: 0.8;
  }
}
.card {
  -webkit-box-shadow: 0px 0px 50px -11px rgba(56, 166, 207, 1);
  -moz-box-shadow: 0px 0px 50px -11px rgba(56, 166, 207, 1);
  box-shadow: 0px 0px 50px -11px rgba(56, 166, 207, 1);
}
.bg-gradient-primary {
  background-image: linear-gradient(310deg, #5e72e4, #825ee4);
}
.bg-gradient-danger {
  background-image: linear-gradient(310deg, #ea617c, #ee5f37c8);
}
.bg-gradient-success {
  background-image: linear-gradient(310deg, #16714a, #2dcecc);
}
.bg-gradient-warning {
  background-image: linear-gradient(310deg, #fb6340, #fbb140);
}
.icon-shape {
  width: 48px;
  height: 48px;
  background-position: 50%;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.card_barStyle {
  background-color: rgb(0 0 0 / 20%);
  box-shadow: 0 0.3rem 0.8rem rgb(0 0 0 / 12%);
  margin-bottom: 1.5rem;
  border: 0 solid transparent;
}
.radius-10 {
  border-radius: 20px;
}
.border {
  border: 3px solid rgb(255 255 255 / 15%) !important;
}
.vr {
  display: inline-block;
  align-self: stretch;
  width: 2px;
  min-height: 1em;
  background-color: #ffffff !important;
  opacity: 0.25;
}
// 時間選擇器
.date_Style {
  & :deep(.el-input__wrapper) {
    border-radius: 10px;
    background: none;
  }
  & :deep(.el-input__inner) {
    color: #fff;
  }
}
// 新增資訊樣式
.addInfo_style {
  width: 80%;
  --el-input-focus-border-color: #faa30d;
  padding: 10px 100px 10px 100px;
  & :deep(.el-input__inner) {
    padding: 25px 0 25px 0px;
    // border-radius: 50px;
  }
  & :deep(.el-input__wrapper) {
    border-top-right-radius: 50px;
    border-bottom-right-radius: 50px;
    padding-left: 10px;
  }
  & :deep(.el-input-group__prepend) {
    border-top-left-radius: 50px;
    border-bottom-left-radius: 50px;
  }
}
.chooseBill_style {
  width: 100%;
  --el-select-input-focus-border-color: #faa30d !important;
  // display: flex;
  padding: 10px 100px 10px 100px;
  & span {
    border-top-left-radius: 50px;
    border-bottom-left-radius: 50px;
    border: 1px solid #f5f7fa;
    padding: 15px 20px 15px 20px;
    color: #909399;
    background: #f5f7fa;
  }
  & :deep(.el-input__inner) {
    padding: 25px 0 25px 0px;
  }
  & :deep(.el-input__wrapper) {
    border-top-right-radius: 50px;
    border-bottom-right-radius: 50px;
    padding-left: 10px;
  }
}
.chooseBank_style {
  --el-select-input-focus-border-color: #faa30d !important;
}
// 重置支付密碼
.resetPwd_style {
  cursor: pointer;
  & :hover {
    color: #faa30d !important;
    transition: 0.7ms;
  }
}
.cancel_btn,
.confirm_btn {
  display: flex;
  width: 200px;
  justify-content: center;
  border-radius: 15px;
  // border: 1px solid rgba(209, 109, 47, 0.95);
  // box-shadow: 5px 7px 16px 0px rgba(0, 0, 0, 0.5);
  // -webkit-box-shadow: 5px 7px 16px 0px rgba(0, 0, 0, 0.5);
  // -moz-box-shadow: 5px 7px 16px 0px rgba(0, 0, 0, 0.5);
  // & :hover {
  //   transition: 0.7ms;
  //   color: #e8ebeb;
  // }
}
.save_btn {
  display: flex;
  width: 200px;
  justify-content: center;
  border-radius: 15px;
  border: none;
  background: linear-gradient(90deg, rgb(181, 189, 189) 0%, rgba(209, 109, 47, 0.95) 100%);
  box-shadow: 5px 7px 16px 0px rgba(0, 0, 0, 0.5);
  -webkit-box-shadow: 5px 7px 16px 0px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 5px 7px 16px 0px rgba(0, 0, 0, 0.5);
  & :hover {
    transition: 0.7ms;
    color: #e8ebeb;
  }
}
</style>

<style lang="scss">
.billModel_style {
  background: linear-gradient(270deg, rgb(5, 57, 87) 0%, rgba(95, 171, 194, 0.95) 100%) !important;
  font-size: 20px;
  font-weight: bold;
  border-radius: 20px;
  & .el-dialog__title {
    font-size: 30px;
    font-weight: bold;
    color: #fff;
  }
}
</style>
