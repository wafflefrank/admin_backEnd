<template>
  <div class="row">
    <!-- 基本訊息 -->
    <div class="col-12">
      <div class="card_outStyle radius-10 p-3">
        <!-- 標題 -->
        <div class="d-flex align-items-center justify-content-between mx-4">
          <h4 class="text-white d-flex flex-start my-4">{{ this.$t('billHistory') }}</h4>
        </div>
        <!-- 搜尋內容 -->
        <el-form ref="search_form" :model="searchOption" class="searchForm_style">
          <el-row>
            <!-- 資料內容 -->
            <el-col :span="24" class="add_left_style_1 mx-4">
              <div class="d-flex">
                <!-- 支付狀態 🍖-->
                <el-form-item :label="`${this.$t('settlementStatus')} :`" class="thirdPay_style me-5" prop="isDone">
                  <el-select v-model="searchOption.isDone" :placeholder="this.$t('choose_status')" @change="choosePay_type(searchOption.isDone)" clearable>
                    <el-option :label="this.$t('settled')" :value="true"></el-option>
                    <el-option :label="this.$t('notSettled')" :value="false"></el-option>
                  </el-select>
                </el-form-item>
                <!-- 收款人🍖 -->
                <el-form-item :label="`${this.$t('beneficiaryName')} :`" class="thirdPay_style me-5" prop="id">
                  <el-input v-model="searchOption.bankOwner" :placeholder="this.$t('beneficiaryName')" />
                </el-form-item>
                <!-- 訂單ID🍖 -->
                <el-form-item :label="`${this.$t('orderID')} :`" class="thirdPay_style me-5" prop="merchantBillId">
                  <el-input v-model="searchOption.merchantBillId" :placeholder="this.$t('typeOrderID')" />
                </el-form-item>
                <!-- 選擇日期 -->
                <el-form-item :label="`${this.$t('choose_date')} : `" class="thirdPay_style me-5" prop="timeValue">
                  <el-date-picker v-model="timeValue" type="date" :placeholder="this.$t('choose_date')" />
                </el-form-item>
                <!-- 收款帳號 -->
                <!-- <el-form-item label="收款帳號 :" class="thirdPay_style me-5" prop="id">
                  <el-input v-model="searchOption.id" placeholder="收款帳號" />
                </el-form-item> -->
              </div>
            </el-col>
          </el-row>
          <div class="text-center justify-content-between mt-3">
            <el-button color="#faa30d" class="search_btn mt-1 px-5 fw-bold" size="default" @click.prevent="resetForm()">{{ this.$t('reset') }}</el-button>
            <el-button color="#faa30d" class="search_btn mt-1 px-5 fw-bold" size="default" @click="doSearch()">{{ this.$t('search') }}</el-button>
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
          <div class="d-flex align-items-center justify-content-end">
            <el-button color="#faa30d" class="search_btn px-5 fw-bold" size="default" @click="openExcelModal()">{{ this.$t('exportData') }}</el-button>
          </div>
        </div>

        <!-- 查詢內容 -->
        <div class="bill_table mt-3">
          <el-table id="excelTable" :data="orderTable" :header-cell-style="{ background: 'linear-gradient(180deg, rgba(252, 240, 255, 1) 0%, rgba(89, 160, 182, 0.597) 100%)', color: '#606266' }" v-loading="loading_table" element-loading-background="rgba(122, 122, 122, 0.1)">
            <!-- # -->
            <el-table-column prop="id" label="#" align="center" width="120">
              <!-- <template v-slot="{ row }">{{ formatName(row.payGateCode) }}</template> -->
            </el-table-column>
            <!-- 代付單號 -->
            <el-table-column prop="merchant_bill_id" :label="this.$t('POBO_ID')" align="center">
              <!-- <template v-slot="{ row }">{{ formatRate(row.rate) }}</template> -->
            </el-table-column>
            <!-- 收款人資訊 -->
            <el-table-column prop="bankOwner" :label="this.$t('merchantInfo')" align="center" width="250">
              <template v-slot="{ row }">
                <el-popover effect="light" trigger="hover" placement="top" width="auto">
                  <template #default>
                    <div>{{ this.$t('bankOwner') }} : {{ row.bankOwner }}</div>
                    <div>{{ this.$t('bankName') }} : {{ row.bankName }}</div>
                    <div>{{ this.$t('branchBank') }} :</div>
                    <div>{{ this.$t('bankAccount') }} : {{ row.bankAccount }}</div>
                  </template>
                  <template #reference>
                    <el-tag>{{ row.bankOwner }}</el-tag>
                  </template>
                </el-popover>
              </template>
            </el-table-column>
            <!-- 平台出款訊息 -->
            <el-table-column prop="mainCardBankOwner" :label="this.$t('platformPaymentInfo')" align="center" width="250">
              <template v-slot="{ row }">
                <div v-if="row.isDone === 1">
                  <el-popover effect="light" trigger="hover" placement="top" width="auto">
                    <template #default>
                      <div>{{ this.$t('bankOwner') }} : {{ row.mainCardBankOwner }}</div>
                      <div>{{ this.$t('bankName') }} : {{ row.mainCardBankName }}</div>
                      <div>{{ this.$t('branchBank') }} :</div>
                      <div>{{ this.$t('bankAccount') }} : {{ row.mainCardBankAccount }}</div>
                    </template>
                    <template #reference>
                      <el-tag>{{ row.mainCardBankOwner }}</el-tag>
                    </template>
                  </el-popover>
                </div>
                <div v-if="row.isDone === 0">
                  <el-tag effect="dark" :type="row.isDone === 1 ? 'success' : 'danger'">
                    {{ formatisDone(row.isDone) }}
                  </el-tag>
                </div>
              </template>
              <!-- <template  v-if="row.isDone === 0">
                <el-tag effect="dark" :type="row.isDone === 1 ? 'success' : 'danger'">
                  {{ formatisDone(row.isDone) }}
                </el-tag>
              </template> -->
            </el-table-column>
            <!-- 結算類型 -->
            <el-table-column prop="isDf" :label="this.$t('settleType')" align="center">
              <template v-slot="{ row }">
                <el-tag effect="dark" :type="row.isDf === 1 ? 'success' : 'warning'">
                  {{ formatisDf(row.isDf) }}
                </el-tag>
              </template>
            </el-table-column>
            <!-- 結算金額 -->
            <el-table-column sortable prop="amount" :label="this.$t('settlement_amount')" align="center" :formatter="stateFormat">
              <!-- <template v-slot="{ row }">
                  <el-tag :type="row.isActive === 1 ? 'success' : 'danger'">
                    {{ formatgmtUsed(row.isActive) }}
                  </el-tag>
                </template> -->
            </el-table-column>
            <!-- 手續費 -->
            <el-table-column prop="bankFee" :label="this.$t('Fee')" align="center" width="100" :formatter="stateFormat">
              <!-- <template v-slot="{ row }">
                <el-tag :type="row.isPaid === 1 ? 'success' : 'danger'">
                  {{ formatisPaid(row.isPaid) }}
                </el-tag>
              </template> -->
            </el-table-column>
            <!-- 實結金額 -->
            <el-table-column prop="amount" :label="this.$t('actualAmount')" align="center" :formatter="stateFormat">
              <!-- <template v-slot="{ row }">
                <el-tag :type="row.isGotReceipt === 1 ? 'success' : 'danger'">
                  {{ formatisGotReceipt(row.isGotReceipt) }}
                </el-tag>
              </template> -->
            </el-table-column>
            <!-- 創建時間 -->
            <el-table-column prop="createdAt" :label="this.$t('creatTime')" align="center">
              <!-- <template v-slot="{ row }">
                <el-tag :type="row.isGotReceipt === 1 ? 'success' : 'danger'">
                  {{ formatisGotReceipt(row.isGotReceipt) }}
                </el-tag>
              </template> -->
            </el-table-column>
            <el-table-column prop="isDone" :label="this.$t('status')" align="center" width="150">
              <template v-slot="{ row }">
                <el-tag effect="dark" :type="row.isDone === 1 ? 'success' : 'danger'">
                  {{ formatisDone(row.isDone) }}
                </el-tag>
                <el-tag v-if="row.isRefund === 1" class="ms-2" effect="dark" :type="row.isRefund === 1 ? '' : 'danger'">
                  {{ formatisRefund(row.isRefund) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="billType" :label="this.$t('operating')" align="center" width="200">
              <template v-slot="{ row }">
                <el-popover trigger="click" v-model="photoVisible" placement="top">
                  <p class="mb-2">#{{ row.id }}的結算憑證</p>
                  <el-image style="width: 100px; height: 100px" :src="row.photos" :zoom-rate="1.5" :preview-src-list="urlList" :initial-index="4" fit="cover" />
                  <template #reference>
                    <div class="setting_style d-flex align-items-center justify-content-center text-yellow">
                      <span ref="buttonRef" @click="doResendNotify(row)" @keydown="doResendNotify(row)">{{ this.$t('checkCertication') }}</span>
                    </div>
                  </template>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分頁套件 -->
          <div class="d-flex justify-content-end mt-4">
            <el-pagination :page-sizes="[10, 30, 50, 100]" layout="sizes,prev, pager, next" :total="totalPage" class="pageStyle d-flex flex-row-reverse" v-model:page-size="pageSize" :current-page="currentPage" @current-change="handleCurrentChange" @size-change="sizeChange"> </el-pagination>
          </div>
          <!-- EXCEL導出彈窗 -->
          <el-dialog class="excelModel_style" v-model="excelDialogVisible" :title="this.$t('choose_range')" center>
            <div class="d-flex flex-column align-items-start">
              <span class="mb-2 fs-5 text-deep2">{{ this.$t('dateRange') }}</span>
              <el-date-picker class="mb-4" v-model="dateRange" type="daterange" range-separator="to" :start-placeholder="this.$t('startTime')" :end-placeholder="this.$t('endTime')" />
              <span class="mb-2 fs-5">{{ this.$t('timeType') }}</span>
              <el-radio-group class="mb-4" v-model="type" @change="timeDate(type)">
                <el-radio-button :label="this.$t('creatTime')" />
                <el-radio-button :label="this.$t('paymentTime')" />
              </el-radio-group>

              <span class="mb-2 fs-5">{{ this.$t('language') }}</span>
              <el-radio-group class="mb-4" v-model="lang" @change="changelang(language)">
                <el-radio-button :label="this.$t('Chinese')" />
                <el-radio-button :label="this.$t('English')" />
              </el-radio-group>

              <span class="mb-2 fs-5">{{ this.$t('quickExport') }}</span>
            </div>
            <div class="d-flex flex-column align-items-center justify-content-center">
              <div class="d-flex justify-content-center">
                <el-button color="#faa30d" class="datePick_btn px-4 py-4 mt-4 fw-bold fs-6" size="small" @click="timeRange(this.$t('today'))">{{ this.$t('today') }}</el-button>
                <el-button color="#faa30d" class="datePick_btn px-4 py-4 mt-4 fw-bold fs-6" size="small" @click="timeRange(this.$t('last3Days'))">{{ this.$t('last3Days') }}</el-button>
                <el-button color="#faa30d" class="datePick_btn px-4 py-4 mt-4 fw-bold fs-6" size="small" @click="timeRange(this.$t('last7Days'))">{{ this.$t('last7Days') }}</el-button>
              </div>
              <div class="d-flex justify-content-center">
                <el-button color="#faa30d" class="export_btn p-4 mt-4 fw-bold fs-5 align-content-center" size="default" @click="getExcel()">{{ this.$t('confirm') }}</el-button>
              </div>
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

// 當前時間
// const nowTime = moment(new Date()).utc().format();

// 千分位
// const comma = /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g;

export default {
  data() {
    return {
      // 搜尋選項
      searchOption: {
        bankAccount: null,
        bankOwner: null,
        startAt: null,
        endAt: null,
        isDone: false,
        limit: 10,
        skip: 0,
        mainCardId: null,
        merchantBillId: null,
      },
      timeValue: '',
      radio2: '今天', // 時間區間
      // 下方訂單Table
      orderTable: [],

      // 分頁參數
      totalPage: 10, // 總共多少頁數
      currentPage: 1, // 當前頁數
      pageSize: 10, // 當前頁顯示多少條

      // 導出EXCEL數據
      excelDialogVisible: false, // excel彈窗
      excelDate_one: '',
      excelDate_two: '',
      type: this.$t('creatTime'),
      lang: this.$t('Chinese'),
      // 加載
      loading_table: false,
      // 查看憑證
      photoVisible: false,
      url: 'http://imgbill.oss-cn-hongkong.aliyuncs.com/6b8533a0-82b0-11ed-921b-f1a45a1c1c52.png', // 憑證圖片地址
      urlList: ['https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'],
    };
  },
  methods: {
    // 過濾支付狀態
    formatisDf(isDf) {
      if (this.$i18n.locale === 'tw') {
        if (isDf === 1) {
          return '代付';
        }
        if (isDf === 0) {
          return '下發';
        }
      }
      if (this.$i18n.locale === 'cn') {
        if (isDf === 1) {
          return '代付';
        }
        if (isDf === 0) {
          return '下发';
        }
      }
      if (this.$i18n.locale === 'en') {
        if (isDf === 1) {
          return 'POBO';
        }
        if (isDf === 0) {
          return 'Withdrawal';
        }
      }
      if (this.$i18n.locale === 'vn') {
        if (isDf === 1) {
          return 'trả thay';
        }
        if (isDf === 0) {
          return 'Withdrawal';
        }
      }
      return '備用';
    },
    // 過濾回執狀態
    formatisGotReceipt(isGotReceipt) {
      if (this.$i18n.locale === 'tw') {
        if (isGotReceipt === 1) {
          return '已收到回執';
        }
        if (isGotReceipt === 0) {
          return '暫無回執';
        }
      }
      if (this.$i18n.locale === 'cn') {
        if (isGotReceipt === 1) {
          return '已收到回执';
        }
        if (isGotReceipt === 0) {
          return '暂无回执';
        }
      }
      if (this.$i18n.locale === 'en') {
        if (isGotReceipt === 1) {
          return 'Received';
        }
        if (isGotReceipt === 0) {
          return 'Not received';
        }
      }
      if (this.$i18n.locale === 'vn') {
        if (isGotReceipt === 1) {
          return 'biên lai nhận được';
        }
        if (isGotReceipt === 0) {
          return 'không nhận';
        }
      }
      return '備用';
    },
    // 過濾通道圖片狀態
    // formatpgType(pgType) {
    //   if (pgType === 'VNMOMO') {
    //     return this.imgSrc === VNMOMO;
    //   }
    //   if (pgType === 0) {
    //     return '暫無回執';
    //   }
    //   return '備用';
    // },

    // 過濾狀態結果
    formatisDone(isDone) {
      if (this.$i18n.locale === 'tw') {
        if (isDone === 1) {
          return '已結算';
        }
        if (isDone === 0) {
          return '未結算';
        }
      }
      if (this.$i18n.locale === 'cn') {
        if (isDone === 1) {
          return '已結算';
        }
        if (isDone === 0) {
          return '未結算';
        }
      }
      if (this.$i18n.locale === 'en') {
        if (isDone === 1) {
          return 'Settled';
        }
        if (isDone === 0) {
          return 'Not Settled';
        }
      }
      if (this.$i18n.locale === 'vn') {
        if (isDone === 1) {
          return 'Định cư';
        }
        if (isDone === 0) {
          return 'bất ổn';
        }
      }
      return '備用';
    },
    // 過濾撤銷狀態
    formatisRefund(isRefund) {
      if (this.$i18n.locale === 'tw') {
        if (isRefund === 1) {
          return '已撤銷';
        }
        if (isRefund === 0) {
          return '未撤銷';
        }
      }
      if (this.$i18n.locale === 'cn') {
        if (isRefund === 1) {
          return '已撤销';
        }
        if (isRefund === 0) {
          return '未撤销';
        }
      }
      if (this.$i18n.locale === 'en') {
        if (isRefund === 1) {
          return 'Revoked';
        }
        if (isRefund === 0) {
          return 'Not Revoked';
        }
      }
      if (this.$i18n.locale === 'vn') {
        if (isRefund === 1) {
          return 'thu hồi';
        }
        if (isRefund === 0) {
          return 'không bị thu hồi';
        }
      }
      return '備用';
    },
    // 支付類型修改
    choosePay_type(item) {
      console.log(item);
      // this.searchOption.isPaid = item.isPaid;
      if (item === true) {
        this.searchOption.isDone = true;
      }
      if (item === 'false') {
        this.searchOption.isDone = false;
      }
      if (item === '') {
        this.searchOption.isDone = null;
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
    // 千分位
    stateFormat(row, column, cellValue) {
      let bellValue = cellValue;
      bellValue += '';
      if (!bellValue.includes('.')) bellValue += '.';
      return bellValue.replace(/(\d)(?=(\d{3})+\.)/g, ($0, $1) => `${$1},`).replace(/\.$/, '');
    },
    timeDate(label) {
      console.log(label);
      if (label === this.$t('creatTime')) {
        this.type = this.$t('creatTime');
      }
      if (label === this.$t('paymentTime')) {
        this.type = this.$t('paymentTime');
      }
    },
    changelang(label) {
      console.log(label);
      if (label === this.$t('Chinese')) {
        this.type = this.$t('Chinese');
      }
      if (label === this.$t('English')) {
        this.type = this.$t('English');
      }
    },
    timeRange(range) {
      if (range === this.$t('today')) {
        this.excelDate_one = this.$filters.dateTime(moment(new Date()).utc().subtract(1, 'days').format());
        this.excelDate_two = this.$filters.dateTime(moment(new Date()).utc().format());
        console.log(this.excelDate_one, this.excelDate_two);
      }
      if (range === this.$t('last3Days')) {
        this.excelDate_one = this.$filters.dateTime(moment(new Date()).utc().subtract(3, 'days').format());
        this.excelDate_two = this.$filters.dateTime(moment(new Date()).utc().format());

        console.log(this.excelDate_one, this.excelDate_two);
      }
      if (range === this.$t('last7Days')) {
        this.excelDate_one = this.$filters.dateTime(moment(new Date()).utc().subtract(7, 'days').format());
        this.excelDate_two = this.$filters.dateTime(moment(new Date()).utc().format());

        console.log(this.excelDate_one, this.excelDate_two);
      }
      window.open(`/api/getOrderExcel/${this.excelDate_one}to${this.excelDate_two}.csv?dateType=${this.type}&lang=${this.lang}`, '_blank;');
    },

    // 重置會員表單
    resetForm() {
      this.$refs.search_form.resetFields();
      this.searchOption.isDone = null;
      this.timeValue = null;
      this.searchOption.bankOwner = '';
      console.log(this.dateRange);
    },
    // 查詢
    doSearch() {
      this.loading_table = true;
      console.log(this.radio2);
      if (this.timeValue === '') {
        this.searchOption.startAt = null;
        this.searchOption.endAt = null;
      } else if (this.timeValue === null) {
        this.searchOption.startAt = null;
        this.searchOption.endAt = null;
      } else {
        this.searchOption.startAt = moment(this.timeValue).utc().format();
        this.searchOption.endAt = moment(this.timeValue).utc().add(1, 'days').format();
      }
      console.log(this.timeValue);
      console.log(this.searchOption.startAt, this.searchOption.endAt);
      this.$http.post('/api/getMyBills', this.searchOption).then((res) => {
        this.loading_table = false;
        console.log(res.data.data);
        this.orderTable = res.data.data.dataset;
        this.totalPage = res.data.data.count;
        _.forEach(this.orderTable, (item) => {
          //   const jsonTest = JSON.stringify(item.photos);
          //   console.log(jsonTest);
          console.log(item.photos.toString());
          this.url = item.photos;
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
      this.photoVisible = true;
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
      console.log(this.dateRange[0], this.dateRange[1]);
      const isTrue = moment(this.dateRange[0]).add(31, 'day').isSameOrAfter(moment(this.dateRange[1]), 'day');
      console.log(isTrue);
      if (this.dateRange[0] || this.dateRange[1] !== undefined) {
        // this.dateRange[0] = moment(this.dateRange[0]).utc().format();
        // this.dateRange[1] = moment(this.dateRange[1]).add(1, 'days').utc().format();
        this.excelDate_one = this.$filters.dateTime(this.dateRange[0]);
        this.excelDate_two = this.$filters.dateTime(this.dateRange[1]);
        console.log(this.excelDate_one);
        console.log(this.excelDate_two);
        if (!isTrue) {
          ElMessage({ showClose: true, message: '最多僅支持導出31天數據', type: 'error' });
          return;
        }
        // if (!this.url) {
        //   ElMessage({ showClose: true, message: '缺少参数，请刷新页面', type: 'error' });
        //   return;
        // }

        window.open(`/api/getBillExcel/${this.excelDate_one}to${this.excelDate_two}.csv?dateType=${this.type}&lang=${this.lang}`, '_blank;');
      } else {
        ElMessage({ showClose: true, message: '請選擇日期', type: 'error' });
      }
    },
    test(row) {
      console.log(row.pgType);
    },
  },
  created() {
    this.doSearch();
  },
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
.bill_table {
  width: 100%;
  // margin: auto;
}
// sortable 樣式
.bill_table .sort-caret.ascending {
  border-bottom-color: rgb(96, 98, 102);
}
.bill_table .sort-caret.descending {
  border-top-color: rgb(96, 98, 102);
}
.notifyList_table .el-table__header-wrapper {
  border-radius: 15px;
}
.bill_table .el-table__header-wrapper {
  border-radius: 15px;
}
.bill_table .el-table,
.el-table__expanded-cell {
  background-color: transparent;
}
.notifyList_table .el-table,
.el-table__expanded-cell {
  // 通知紀錄 - 表格背景色
  background-color: #ffffff;
}
.bill_table .el-table th {
  border-bottom: none !important;
  padding-top: 10px;
}
.bill_table .el-table tr {
  background-color: transparent !important;
  color: white;
}
.notifyList_table .el-table tr {
  background-color: transparent !important;
  color: rgb(0, 0, 0);
}
// 更改表格hover背景色
.bill_table .el-table__body tr:hover {
  border-radius: 15px !important;
}
.bill_table .el-table__body tr:hover > td {
  background-color: #2a5595 !important;
}
.notifyList_table .el-table__body tr:hover > td {
  background-color: #6790ce !important;
}
.bill_table .el-table--enable-row-transition .el-table__body td,
.bill_table .cell {
  background-color: transparent !important;
  border: none !important; //去掉表格的底線
  margin-top: 10px;
  margin-bottom: 10px !important;
}
.bill_table .el-table::before {
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
