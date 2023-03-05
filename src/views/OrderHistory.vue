<template>
  <div class="row">
    <!-- 基本訊息 -->
    <div class="col-12">
      <div class="card_outStyle radius-10 p-3">
        <!-- 標題 -->
        <div class="d-flex align-items-center justify-content-between mx-4">
          <h4 class="text-white d-flex flex-start my-4">訂單紀錄</h4>
          <div class="d-flex text-start">
            <i class="fa-solid fa-sack-dollar text-white fs-5 mb-2"
              ><span class="text-light2 ms-2" style="margin-right: 100px"
                >總金額 : <span class="fs-6 text-white">{{ this.total }} $</span></span
              ></i
            >
            <i class="fa-solid fa-hand-holding-dollar text-white fs-5"
              ><span class="text-light2 ms-2"
                >總手續費 : <span class="fs-6 text-white"> {{ this.totalFee }} $</span></span
              ></i
            >
          </div>
        </div>
        <!-- 搜尋內容 -->
        <el-form ref="search_form" :model="searchOption" class="searchForm_style">
          <el-row>
            <!-- 資料內容 -->
            <el-col :span="24" class="add_left_style_1">
              <div class="d-flex justify-content-between">
                <!-- 第三方平台🍖 -->
                <el-form-item label="訂單 ID :" class="thirdPay_style me-2" prop="id">
                  <el-input v-model="searchOption.id" placeholder="請輸入訂單ID" />
                </el-form-item>
                <!-- 平台種類🍖 -->
                <el-form-item label="商戶訂單ID :" class="thirdPay_style me-2" prop="merchant_order_id">
                  <el-input v-model="searchOption.merchant_order_id" placeholder="請輸入商戶ID" />
                </el-form-item>
                <!-- 支付狀態 🍖-->
                <el-form-item label="支付狀態" class="thirdPay_style me-2" prop="isPaid">
                  <el-select v-model="searchOption.isPaid" placeholder="選擇類型" @change="choosePay_type(searchOption.isPaid)" clearable>
                    <el-option label="已支付" :value="true"></el-option>
                    <el-option label="未支付" :value="false"></el-option>
                  </el-select>
                </el-form-item>
                <!-- 通知狀態 🍖-->
                <el-form-item label="通知狀態" class="thirdPay_style me-2" prop="isGotReceipt">
                  <el-select v-model="searchOption.isGotReceipt" placeholder="選擇類型" @change="chooseReceipt_status(searchOption.isGotReceipt)" clearable>
                    <el-option label="收到回執" :value="true"></el-option>
                    <el-option label="暫無回執" :value="false"></el-option>
                  </el-select>
                </el-form-item>
                <!-- 狀態 🍖-->
                <el-form-item label="通道類型" class="thirdPay_style me-2" prop="payMethodId">
                  <el-select v-model="searchOption.payMethodId" placeholder="選擇狀態" @change="choose_tunnel(searchOption.payMethodId)" clearable>
                    <el-option label="轉卡" value="7"></el-option>
                    <el-option label="ZALO" value="8"></el-option>
                    <el-option label="MOMO" value="9"></el-option>
                    <el-option label="Viettel" value="12"></el-option>
                    <el-option label="直連" value="10"></el-option>
                    <el-option label="銀行掃碼" value="11"></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="24" class="add_left_style_1">
              <div class="d-flex">
                <!-- 金額範圍min -->
                <el-form-item label="金額範圍" class="thirdPay_style me-2" prop="amountMin">
                  <el-input v-model="searchOption.amountMin" placeholder="最小金額" oninput="value=value.replace(/[^0-9.]/g,'')" clearable> </el-input>
                </el-form-item>
                <!-- 金額範圍max -->
                <el-form-item label="~" class="thirdPay_style me-2" prop="amountMax">
                  <el-input v-model="searchOption.amountMax" placeholder="最大金額" oninput="value=value.replace(/[^0-9.]/g,'')" clearable> </el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <div class="text-center justify-content-between mt-3">
            <el-button color="#faa30d" class="search_btn mt-1 px-5 fw-bold" size="default" @click.prevent="resetForm()">重置</el-button>
            <el-button color="#faa30d" class="search_btn mt-1 px-5 fw-bold" size="default" @click="doSearch()">查詢</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
  <!-- 查詢內容table -->
  <div class="row">
    <div class="col-12">
      <div class="card_outStyle radius-10 p-4">
        <div class="col-12">
          <div class="d-flex align-items-center justify-content-between">
            <div class="d-flex">
              <el-radio-group class="dateType_list" v-model="radio2" @change="searchDate(radio2)">
                <el-radio-button label="今天" />
                <el-radio-button label="近7天" />
                <el-radio-button label="一個月" />
                <el-radio-button label="三個月" />
              </el-radio-group>
              <el-date-picker class="ms-3" v-model="dateRange" type="daterange" range-separator="to" start-placeholder="起始日期" end-placeholder="結束日期" />
            </div>
            <el-button color="#faa30d" class="search_btn px-5 fw-bold" size="default" @click="openExcelModal()">導出數據</el-button>
          </div>
        </div>

        <!-- 查詢內容 -->
        <div class="order_table mt-3">
          <el-table id="excelTable" :data="orderTable" :header-cell-style="{ background: 'linear-gradient(180deg, rgba(252, 240, 255, 1) 0%, rgba(89, 160, 182, 0.597) 100%)', color: '#606266' }" v-loading="loading_table" element-loading-background="rgba(122, 122, 122, 0.1)">
            <el-table-column prop="id" label="訂單ID" align="center" width="180">
              <!-- <template v-slot="{ row }">{{ formatName(row.payGateCode) }}</template> -->
            </el-table-column>
            <el-table-column prop="merchantName" label="商戶名稱" width="100" align="center">
              <!-- <template v-slot="{ row }">{{ formatRate(row.rate) }}</template> -->
            </el-table-column>
            <el-table-column prop="merchant_order_id" label="商戶訂單ID" width="180" align="center">
              <!-- <template v-slot="{ row }">
                <el-tag :type="row.isActive === 1 ? 'success' : 'danger'">
                  {{ formatgmtUsed(row.isActive) }}
                </el-tag>
              </template> -->
            </el-table-column>
            <el-table-column prop="pgType" label="通道類型" width="100" align="center">
              <template v-slot="{ row }">
                <img class="payTunnel_size" :src="row.pgType" :alt="row.momo_pay" @click="test(row)" @keydown="test(row)" />
              </template>
            </el-table-column>
            <el-table-column prop="costFee" label="手續費" width="120" align="center" :formatter="stateFormat"> </el-table-column>
            <el-table-column prop="amount" label="訂單金額" width="180" align="center" :formatter="stateFormat">
              <!-- <template v-slot="{ row }">
                <el-tag :type="row.isActive === 1 ? 'success' : 'danger'">
                  {{ formatgmtUsed(row.isActive) }}
                </el-tag>
              </template> -->
            </el-table-column>
            <el-table-column sortable prop="createdAt" label="創建時間" width="180" align="center">
              <!-- <template v-slot="{ row }">
                <el-tag :type="row.isActive === 1 ? 'success' : 'danger'">
                  {{ formatgmtUsed(row.isActive) }}
                </el-tag>
              </template> -->
            </el-table-column>
            <el-table-column prop="isPaid" label="支付狀態" width="100" align="center">
              <template v-slot="{ row }">
                <el-tag :type="row.isPaid === 1 ? 'success' : 'danger'">
                  {{ formatisPaid(row.isPaid) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="isGotReceipt" label="通知狀態" width="100" align="center">
              <template v-slot="{ row }">
                <el-tag :type="row.isGotReceipt === 1 ? 'success' : 'danger'">
                  {{ formatisGotReceipt(row.isGotReceipt) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="billType" label="操作" align="center">
              <template v-slot="{ row }">
                <div class="setting_style d-flex align-items-center justify-content-center">
                  <span @click="verifyRecharge(row)" @keydown="verifyRecharge(row)" class="me-3 pe-3" style="border-right: 2px solid">通知紀錄 </span>
                  <span @click="openMerchant(row)" @keydown="openMerchant(row)" class="me-3 pe-3" style="border-right: 2px solid">商家地址</span>
                  <span @click="doResendNotify(row)" @keydown="doResendNotify(row)">補發通知</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分頁套件 -->
          <div class="d-flex justify-content-end mt-4">
            <el-pagination :page-sizes="[10, 30, 50, 100]" layout="sizes,prev, pager, next" :total="totalPage" class="pageStyle d-flex flex-row-reverse" v-model:page-size="pageSize" :current-page="currentPage" @current-change="handleCurrentChange" @size-change="sizeChange"> </el-pagination>
          </div>
          <!-- 通知紀錄彈窗 -->
          <el-dialog v-model="centerDialogVisible" title="通知紀錄" width="60%" center>
            <div class="notifyList_table">
              <el-table :data="notifyList_Data" stripe style="width: 100%" :header-cell-style="{ background: 'linear-gradient(180deg, rgba(252, 240, 255, 1) 0%, rgba(89, 160, 182, 0.95) 100%)', color: '#606266' }">
                <el-table-column prop="isSuccess" label="通知結果" width="100" align="center">
                  <template v-slot="{ row }">
                    <el-tag :type="row.isSuccess === 1 ? 'success' : 'danger'">
                      {{ formatisSuccess(row.isSuccess) }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="request" label="請求內容" width="240" align="center" />
                <el-table-column prop="response" label="服務器返回" align="center" />
                <el-table-column prop="createdAt" label="通知時間" align="center" />
              </el-table>
            </div>
          </el-dialog>
          <!-- 商家地址彈窗 -->
          <el-dialog class="merchant_title" v-model="merchantDialogVisible" title="商家地址" width="60%" center>
            <div class="d-flex flex-column">
              <span class="mb-2 fs-4">通知地址 : {{ this.merchant_notify_url }} </span>
              <span class="fs-4">返回地址 : {{ this.merchant_return_url }} </span>
            </div>
          </el-dialog>
          <!-- EXCEL導出彈窗 -->
          <el-dialog class="excelModel_style" v-model="excelDialogVisible" title="選擇導出範圍" width="20%" center>
            <div class="d-flex flex-column align-items-start">
              <span class="mb-2 fs-5 text-deep2">日期範圍</span>
              <el-date-picker class="mb-4" v-model="dateRange" type="daterange" range-separator="to" start-placeholder="起始日期" end-placeholder="結束日期" />
              <span class="mb-2 fs-5">時間類型</span>
              <el-radio-group class="mb-4" v-model="radio2" @change="searchDate(radio2)">
                <el-radio-button label="創建時間" />
                <el-radio-button label="支付時間" />
              </el-radio-group>

              <span class="mb-2 fs-5">語言</span>
              <el-radio-group class="mb-4" v-model="radio2" @change="searchDate(radio2)">
                <el-radio-button label="中文" />
                <el-radio-button label="英文" />
              </el-radio-group>

              <span class="mb-2 fs-5">快速導出</span>
              <div class="d-flex align-self-center">
                <el-button color="#faa30d" class="datePick_btn px-5 py-4 mt-4 fw-bold fs-6 align-self-center" size="small" @click="openExcelModal()">當日</el-button>
                <el-button color="#faa30d" class="datePick_btn px-5 py-4 mt-4 fw-bold fs-6 align-self-center" size="small" @click="openExcelModal()">近三天</el-button>
                <el-button color="#faa30d" class="datePick_btn px-5 py-4 mt-4 fw-bold fs-6 align-self-center" size="small" @click="openExcelModal()">近7天</el-button>
              </div>
              <el-button color="#faa30d" class="export_btn p-4 mt-4 fw-bold fs-5 align-self-center" size="default" @click="openExcelModal()">確認導出</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { ElMessage } from 'element-plus';
// import table2excel from 'js-table2excel';
import moment from 'moment';
import VNMOMO from '../assets/Logo/VNMOMO.png';
import VNZALO from '../assets/Logo/VNZALO.png';
import TCB from '../assets/Logo/TCB.png';
import MBBANK from '../assets/Logo/MBBANK.png';
import VNVIETTEL from '../assets/Logo/VNVIETTEL.png';
import QRCODE from '../assets/Logo/qr-code.png';
import ATM from '../assets/Logo/ATM.png';

// 當前時間
const nowTime = moment(new Date()).utc().format();
// 最近7天
const sevenTime = moment(new Date()).utc().subtract(7, 'days').format();
// 最近1個月
const monthTime = moment(new Date()).utc().subtract(30, 'days').format();
// 最近3個月
const threeMonthTime = moment(new Date()).utc().subtract(90, 'days').format();
// 千分位
const comma = /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g;

export default {
  data() {
    return {
      // 搜尋選項
      searchOption: {
        id: null,
        merchant_order_id: null,
        isPaid: null,
        startAt: '2022-01-23T17:00:00.000Z',
        endAt: '2023-01-31T16:59:59.999Z',
        limit: 10,
        skip: 0,
        isGotReceipt: null,
        payMethodId: null,
        amountMax: null,
        amountMin: null,
        find: false,
      },
      radio2: '今天', // 時間區間
      total: '', // 總金額
      totalFee: '', // 總手續費
      dateRange: '',
      dateOne: '',
      dateTwo: '',

      // 下方訂單Table
      orderTable: [],
      //   圖片來源
      imgSrc: '',
      //  通知紀錄彈窗
      centerDialogVisible: false,
      notifyList_Data: [], // 通知紀錄彈窗表格資料
      notify_id: '', // 欲通知紀錄ID

      // 商家地址彈窗
      merchantDialogVisible: false,
      merchant_notify_url: '',
      merchant_return_url: '',

      // 補發通知
      resendData: {
        resendID: '',
      },

      // 分頁參數
      totalPage: 10, // 總共多少頁數
      currentPage: 1, // 當前頁數
      pageSize: 10, // 當前頁顯示多少條

      // 導出EXCEL數據
      excelDialogVisible: false, // excel彈窗
      excelDate_one: '',
      excelDate_two: '',
      type: 'createdAt',
      lang: 'chinese',
      // 加載
      loading_table: false,
    };
  },
  methods: {
    // 過濾支付狀態
    formatisPaid(isPaid) {
      if (isPaid === 1) {
        return '已支付';
      }
      if (isPaid === 0) {
        return '未支付';
      }
      return '備用';
    },
    // 過濾回執狀態
    formatisGotReceipt(isGotReceipt) {
      if (isGotReceipt === 1) {
        return '已收到回執';
      }
      if (isGotReceipt === 0) {
        return '暫無回執';
      }
      return '備用';
    },
    // 過濾通道圖片狀態
    formatpgType(pgType) {
      if (pgType === 'VNMOMO') {
        return this.imgSrc === VNMOMO;
      }
      if (pgType === 0) {
        return '暫無回執';
      }
      return '備用';
    },
    // 過濾通知結果
    formatisSuccess(isSuccess) {
      if (isSuccess === 1) {
        return '成功';
      }
      if (isSuccess === 0) {
        return '失敗';
      }
      return '備用';
    },
    // 支付類型修改
    choosePay_type(item) {
      console.log(item);
      // this.searchOption.isPaid = item.isPaid;
      if (item === true) {
        this.searchOption.isPaid = true;
      }
      if (item === 'false') {
        this.searchOption.isPaid = false;
      }
      if (item === '') {
        this.searchOption.isPaid = null;
      }
      // else this.searchOption.isPaid = null;
    },
    // 通知狀態修改
    chooseReceipt_status(item) {
      console.log(item);
      // this.searchOption.isPaid = item.isPaid;
      if (item === true) {
        this.searchOption.isGotReceipt = true;
      }
      if (item === false) {
        this.searchOption.isGotReceipt = false;
      }
      if (item === '') {
        this.searchOption.isGotReceipt = null;
      }
      // else this.searchOption.isPaid = null;
    },
    // 搜尋通道類型
    choose_tunnel(item) {
      console.log(item);
      if (item === 7) {
        this.searchOption.payMethodId = 7;
        console.log('轉卡');
      }
      if (item === 8) {
        this.searchOption.payMethodId = 8;
        console.log('ZALO');
      }
      if (item === 9) {
        this.searchOption.payMethodId = 9;
        console.log('MOMO');
      }
      if (item === 10) {
        this.searchOption.payMethodId = 10;
        console.log('直連');
      }
      if (item === 11) {
        this.searchOption.payMethodId = 11;
        console.log('銀行掃碼');
      }
      if (item === 12) {
        this.searchOption.payMethodId = 12;
        console.log('Viettel');
      }
    },
    // 搜尋金額範圍
    choose_moneyRange(item) {
      console.log(item);
      if (item === 7) {
        this.searchOption.payMethodId = 7;
        console.log('轉卡');
      }
      if (item === 8) {
        this.searchOption.payMethodId = 8;
        console.log('ZALO');
      }
      if (item === 9) {
        this.searchOption.payMethodId = 9;
        console.log('MOMO');
      }
      if (item === 10) {
        this.searchOption.payMethodId = 10;
        console.log('直連');
      }
      if (item === 11) {
        this.searchOption.payMethodId = 11;
        console.log('銀行掃碼');
      }
      if (item === 12) {
        this.searchOption.payMethodId = 12;
        console.log('Viettel');
      }
    },
    // 搜尋日期天數
    searchDate(label) {
      console.log(nowTime);
      console.log(label);
      this.dateRange = '';
      if (label === '今天') {
        this.searchOption.startAt = nowTime;
        this.searchOption.endAt = nowTime;
      }
      if (label === '近7天') {
        console.log(sevenTime);
        this.searchOption.startAt = sevenTime;
        this.searchOption.endAt = nowTime;
      }
      if (label === '一個月') {
        console.log(monthTime);
        this.searchOption.startAt = monthTime;
        this.searchOption.endAt = nowTime;
      }
      if (label === '三個月') {
        console.log(threeMonthTime);
        this.searchOption.startAt = threeMonthTime;
        this.searchOption.endAt = nowTime;
      }
      this.doSearch();
    },
    // 千分位
    stateFormat(row, column, cellValue) {
      let bellValue = cellValue;
      bellValue += '';
      if (!bellValue.includes('.')) bellValue += '.';
      return bellValue.replace(/(\d)(?=(\d{3})+\.)/g, ($0, $1) => `${$1},`).replace(/\.$/, '');
    },

    // 重置會員表單
    resetForm() {
      this.$refs.search_form.resetFields();
      console.log(this.dateRange);
    },
    // 查詢
    doSearch() {
      this.loading_table = true;
      console.log(this.radio2);
      // 預設搜尋當日訂單
      if (this.dateRange === '') {
        if (this.radio2 === '今天') {
          this.searchOption.startAt = nowTime;
          console.log('抓今天');
          this.searchOption.endAt = nowTime;
        } else if (this.radio2 === '近7天') {
          console.log('抓7天');
          this.searchOption.startAt = sevenTime;
          this.searchOption.endAt = nowTime;
        } else if (this.radio2 === '一個月') {
          console.log('抓一個月');
          this.searchOption.startAt = monthTime;
          this.searchOption.endAt = nowTime;
        } else {
          console.log('抓3個月');
          this.searchOption.startAt = threeMonthTime;
          this.searchOption.endAt = nowTime;
        }
      } else {
        this.radio2 = '';
        this.dateOne = moment(this.dateRange[0]).utc().format();
        this.dateTwo = moment(this.dateRange[1]).add(1, 'days').utc().format();
        this.searchOption.startAt = this.dateOne;
        this.searchOption.endAt = this.dateTwo;
        console.log(this.searchOption.startAt, this.searchOption.endAt);
      }
      if (this.searchOption.amountMin === '') {
        this.searchOption.amountMin = null;
      }
      if (this.searchOption.amountMax === '') {
        this.searchOption.amountMax = null;
      }
      this.$http.post('/api/getOrders', this.searchOption).then((res) => {
        console.log(res.data.data);
        this.orderTable = res.data.data.dataset;
        this.loading_table = false;
        this.total = res.data.data.totalAmount;
        this.total = this.total.toString().replace(comma, ',');
        this.totalFee = res.data.data.totalCostFee;
        this.totalFee = this.totalFee.toString().replace(comma, ',');
        this.totalPage = res.data.data.count;
        console.log(this.orderTable);
        _.forEach(this.orderTable, (item, key) => {
          console.log(key);
          if (item.payMethodId === 9) {
            this.orderTable[key].pgType = VNMOMO;
            // this.imgSrc = VNMOMO;
            // this.member_info.member_wallet[0].currencyName = 'Tether';
          } else if (item.payMethodId === 8) {
            // this.orderTable[key].imgSrc = VNZALO;
            this.orderTable[key].pgType = VNZALO;
            // this.imgSrc = VNZALO;
            // this.member_info.member_wallet[1].currencyName = 'Bitcoin';
          } else if (item.pgType === 'TCB') {
            // this.orderTable[key].imgSrc = VNZALO;
            this.orderTable[key].pgType = TCB;
          } else if (item.pgType === 'MBBANK') {
            // this.orderTable[key].imgSrc = VNZALO;
            this.orderTable[key].pgType = MBBANK;
          } else if (item.payMethodId === 12) {
            // this.orderTable[key].imgSrc = VNZALO;
            this.orderTable[key].pgType = VNVIETTEL;
          } else if (item.payMethodId === 7) {
            this.orderTable[key].pgType = ATM;
          } else if (item.payMethodId === 11) {
            this.orderTable[key].pgType = QRCODE;
          } else {
            this.orderTable[key].pgType = ATM;
          }
        });
      });
    },
    verifyRecharge(data) {
      console.log(data);
      this.notify_id = data.id;
      this.getOrderNotifies();
      console.log(this.notify_id);
      this.centerDialogVisible = true;
    },
    // 打開商家地址
    openMerchant(data) {
      console.log(data);
      this.merchant_notify_url = data.merchant_notify_url;
      this.merchant_return_url = data.merchant_return_url;
      this.merchantDialogVisible = true;
    },
    // 獲取通知紀錄
    getOrderNotifies() {
      this.$http.get(`/api/getOrderNotifies/${this.notify_id}`).then((res) => {
        console.log(res.data.data);
        this.notifyList_Data = res.data.data.dataset;
      });
    },
    // 補發通知
    doResendNotify(data) {
      console.log(data);
      this.resendData.resendID = data.id;
      console.log(this.resendData.resendID);
      this.$http.post('/api/resendNotify', this.resendData).then((res) => {
        console.log(res.data.code);
        ElMessage({ showClose: true, message: `訂單 ${this.resendData.resendID} 補發成功 !`, type: 'success' });
      });
    },
    // 變換當前頁數
    handleCurrentChange(skip) {
      this.currentPage = skip; // 定義當前頁數 等於 skip
      if (skip <= 1) {
        this.searchOption.skip = 0;
        console.log(skip);
        // 若當前頁數 等於或小於1頁時
        this.doSearch();
      } else if (skip > 1) {
        this.searchOption.skip = (skip - 1) * 10;
        console.log(this.searchOption.skip);
        // 若當前頁數等於2.3.4.5頁.....
        this.doSearch();
      }
    },
    // 變換每頁的項目數量
    sizeChange(limit) {
      console.log(limit);
      this.searchOption.limit = limit;
      this.currentPage = 1;
      this.doSearch();
    },
    // onBatchExport() {
    //   const column = [
    //     {
    //       title: '訂單id',
    //       key: 'id',
    //       type: 'text',
    //     },
    //     {
    //       title: '商戶名稱',
    //       key: 'merchantName',
    //       type: 'text',
    //     },
    //     {
    //       title: '商戶訂單ID',
    //       key: 'merchant_order_id',
    //       type: 'text',
    //     },
    //     {
    //       title: '通道類型',
    //       key: 'pgType',
    //       type: 'image',
    //       width: 50,
    //       height: 50,
    //     },
    //     {
    //       title: '訂單金額',
    //       key: 'amount',
    //       type: 'text',
    //     },
    //     {
    //       title: '創建時間',
    //       key: 'createdAt',
    //       type: 'text',
    //     },
    //     {
    //       title: '支付時間',
    //       key: 'paidAt',
    //       type: 'text',
    //     },
    //     {
    //       title: '支付狀態',
    //       key: 'isPaid',
    //       type: 'text',
    //     },
    //     {
    //       title: '通知狀態',
    //       key: 'isGotReceipt',
    //       type: 'text',
    //     },
    //     {
    //       title: '付言',
    //       key: 'id',
    //       type: 'text',
    //     },
    //   ];
    //   const tableDatas = JSON.parse(JSON.stringify(this.orderTable)); // 这里面填写你接口的数据
    //   const datas = tableDatas;
    //   table2excel(column, datas, '二维码');
    // },

    // EXCEL彈窗
    openExcelModal() {
      this.excelDialogVisible = true;
    },
    getExcel() {
      this.dateRange[0] = moment(this.dateRange[0]).utc().format();
      this.dateRange[1] = moment(this.dateRange[1]).add(1, 'days').utc().format();
      this.excelDate_one = this.$filters.dateTime(this.dateRange[0]);
      this.excelDate_two = this.$filters.dateTime(this.dateRange[1]);
      console.log(this.excelDate_one);
      console.log(this.excelDate_two);
      // if (!isTrue) {
      //   ElMessage({ showClose: true, message: '最多仅支持导出31天数据', type: 'error' });
      //   return;
      // }
      // if (!this.url) {
      //   ElMessage({ showClose: true, message: '缺少参数，请刷新页面', type: 'error' });
      //   return;
      // }

      window.open(`/api/getOrderExcel/${this.excelDate_one}to${this.excelDate_two}.csv?dateType=${this.type}&lang=${this.lang}`, '_blank;');
    },
    test(row) {
      console.log(row.pgType);
    },
  },
  created() {},
};
</script>

<style lang="scss">
// 卡片最外框底樣式
.card_outStyle {
  background-color: rgb(0 0 0 / 20%);
  box-shadow: 0px 0px 10px 2px rgba(242, 242, 242, 0.61);
  -webkit-box-shadow: 0px 0px 19px 2px rgba(242, 242, 242, 0.61);
  -moz-box-shadow: 0px 0px 19px 2px rgba(242, 242, 242, 0.61);
  margin-bottom: 1.5rem;
  border: 0 solid transparent;
  border-radius: 15px;
}
// 查詢鈕
.search_btn {
  border: none;
  //   color: rgb(48, 47, 47);
}
.searchForm_style {
  & .el-form-item__label {
    color: white;
  }
}
.order_table {
  width: 100%;
  // margin: auto;
}
// sortable 樣式
.order_table .sort-caret.ascending {
  border-bottom-color: rgb(96, 98, 102);
}
.order_table .sort-caret.descending {
  border-top-color: rgb(96, 98, 102);
}
.notifyList_table .el-table__header-wrapper {
  border-radius: 15px;
}
.order_table .el-table__header-wrapper {
  border-radius: 15px;
}
.order_table .el-table,
.el-table__expanded-cell {
  background-color: transparent;
}
.notifyList_table .el-table,
.el-table__expanded-cell {
  // 通知紀錄 - 表格背景色
  background-color: #ffffff;
}
.order_table .el-table th {
  border-bottom: none !important;
  padding-top: 10px;
}
.order_table .el-table tr {
  background-color: transparent !important;
  color: white;
}
.notifyList_table .el-table tr {
  background-color: transparent !important;
  color: rgb(0, 0, 0);
}
// 更改表格hover背景色
.order_table .el-table__body tr:hover {
  border-radius: 15px !important;
}
.order_table .el-table__body tr:hover > td {
  background-color: #2a5595 !important;
}
.notifyList_table .el-table__body tr:hover > td {
  background-color: #6790ce !important;
}
.order_table .el-table--enable-row-transition .el-table__body td,
.order_table .cell {
  background-color: transparent !important;
  border: none !important; //去掉表格的底線
  margin-top: 10px;
  margin-bottom: 10px !important;
}
.order_table .el-table::before {
  //去除底部白线
  height: 0px !important;
  background-color: transparent !important;
}
// 通道類型圖片大小
.payTunnel_size {
  max-height: 60%;
  max-width: 60%;
  width: auto;
  height: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  object-fit: cover;
}
.setting_style span:hover {
  color: #cacbcb;
  transition: 0.7ms;
  cursor: pointer;
}
.merchant_title {
  font-size: 20px;
  font-weight: bold;
  & .el-dialog__title {
    font-size: 30px;
    font-weight: bold;
  }
}
// 分頁套件樣式
.pageStyle {
  --el-pagination-bg-color: 0;
  & button:disabled {
    background: none;
  }
  & .btn-prev,
  .btn-next {
    color: #ededed;
  }
  & .el-pager li {
    color: #ededed !important;
  }
  & .el-pager li:hover {
    color: #faa30d !important;
  }
  & .el-pager li.is-active {
    color: #faa30d !important;
  }
  // 頁數選擇器
  & .el-select .el-input {
    width: 100px;
  }
  & .el-input__wrapper {
    background: none;
  }
}
// EXCEL彈窗
.excelModel_style {
  background: linear-gradient(90deg, rgba(252, 240, 255, 1) 0%, rgba(64, 121, 139, 0.95) 100%);
  font-size: 20px;
  font-weight: bold;
  & .el-dialog__title {
    font-size: 30px;
    font-weight: bold;
  }
}
// 確認導出鈕樣式
.export_btn {
  display: flex;
  width: 200px;
  justify-content: center;
  border-radius: 15px;
  border: none;
  background: linear-gradient(90deg, rgb(56, 146, 145) 0%, rgba(209, 109, 47, 0.95) 100%);
  box-shadow: 5px 7px 16px 0px rgba(0, 0, 0, 0.5);
  -webkit-box-shadow: 5px 7px 16px 0px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 5px 7px 16px 0px rgba(0, 0, 0, 0.5);
  & :hover {
    transition: 0.7ms;
    color: #e8ebeb;
  }
}
// 快速導出日期選項
.datePick_btn {
  border-radius: 15px;
  background: linear-gradient(90deg, rgb(171, 212, 211) 0%, rgba(214, 144, 101, 0.95) 100%);
  border: none;
  box-shadow: 5px 7px 16px 0px rgba(0, 0, 0, 0.5);
  -webkit-box-shadow: 5px 7px 16px 0px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 5px 7px 16px 0px rgba(0, 0, 0, 0.5);
  & :hover,
  & :focus {
    transition: 0.7ms;
    color: #e8ebeb;
  }
}
// 快速選擇日期類型-選擇後樣式
.dateType_list .el-radio-button__original-radio:checked + .el-radio-button__inner {
  background: #faa30d !important;
  border-color: #faa30d !important;
  box-shadow: none;
}
</style>
