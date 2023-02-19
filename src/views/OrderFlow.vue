<template>
  <div class="row">
    <!-- 基本訊息 -->
    <div class="col-12">
      <div class="card_outStyle radius-10 p-3 pb-4">
        <!-- 標題 -->
        <div class="d-flex align-items-center justify-content-between mx-4">
          <h4 class="text-white d-flex flex-start my-4">篩選</h4>
        </div>
        <div class="d-flex justify-content-between">
          <!-- 交易類型 -->
          <div class="d-flex align-items-center mx-4">
            <span class="text-light2 me-3">交易類型:</span>
            <el-radio-group class="orderType_list" v-model="orderType" @change="searchDate(orderType)">
              <el-radio-button label="訂單" />
              <el-radio-button label="內充" />
              <el-radio-button label="結算" />
            </el-radio-group>
          </div>
          <!-- 導出數據 -->
          <el-button color="#faa30d" class="search_btn px-5 fw-bold me-5" size="default" @click="openExcelModal()">導出數據</el-button>
        </div>
      </div>
    </div>
  </div>
  <!-- 查詢內容table -->
  <div class="row">
    <div class="col-12">
      <div class="card_outStyle radius-10 p-4">
        <!-- 標題 -->
        <div class="d-flex align-items-center justify-content-between mx-4">
          <h4 class="text-white d-flex flex-start my-4">商戶明細</h4>
        </div>

        <!-- 查詢內容 -->
        <div class="merchant_table mt-3">
          <el-table
            id="excelTable"
            :data="orderTable"
            :header-cell-style="{ background: 'linear-gradient(180deg, rgba(252, 240, 255, 1) 0%, rgba(89, 160, 182, 0.597) 100%)', color: '#606266' }"
            row-key="targetId"
            @expand-change="
              (row, expandedRows) => {
                expandOrder(row, expandedRows, index);
              }
            "
            @cell-click="clickTable"
            v-loading="loading_table"
            element-loading-background="rgba(122, 122, 122, 0.1)"
          >
            <el-table-column label="展開" type="expand" align="center" width="80">
              <template #default="props">
                <!-- 訂單類型 -->
                <div v-if="searchOption.type === 'order'" class="d-flex py-3 expand_borderStyle" style="margin-left: 130px" v-loading="loading" element-loading-background="rgba(122, 122, 122, 0.0)">
                  <div class="me-4" style="margin-left: 50px">
                    <p @click="test(props)" @keydown="test(props)">商戶訂單ID : {{ props.row.merchant_order_id }}</p>
                    <p class="mt-2">訂單ID : {{ props.row.targetId }}</p>
                    <!-- <p class="mt-2">訂單ID : {{ props.$index }}</p> -->
                  </div>
                  <div class="me-4" style="margin-left: 120px">
                    <p>
                      手續費 : <span class="text-deep-danger fw-bold">{{ props.row.costFee }}</span>
                    </p>
                    <p class="mt-2">
                      訂單金額 : <span class="text-deep-danger fw-bold">{{ props.row.allAmount }}</span>
                    </p>
                  </div>
                  <div class="me-4" style="margin-left: 120px">
                    <p>創建時間 : {{ props.row.createdAt }}</p>
                    <p class="mt-2">支付時間 : {{ props.row.paidAt }}</p>
                  </div>
                  <div style="margin-left: 120px">
                    <p>
                      支付狀態 :
                      <el-tag :type="props.row.isPaid === 1 ? 'success' : 'danger'"> {{ formatisPaid(props.row.isPaid) }} </el-tag>
                    </p>
                    <p class="mt-2">
                      通知狀態 : <el-tag :type="props.row.isGotReceipt === 1 ? 'success' : 'danger'"> {{ formatisGotReceipt(props.row.isGotReceipt) }} </el-tag>
                    </p>
                  </div>
                </div>
                <!-- 內充類型 -->
                <div v-if="searchOption.type === 'interCharge'" class="d-flex py-3 expand_borderStyle" style="margin-left: 130px" v-loading="loading" element-loading-background="rgba(122, 122, 122, 0.0)">
                  <div class="me-4" style="margin-left: 50px">
                    <p class="mt-2">訂單ID : {{ props.row.targetId }}</p>
                    <!-- <p class="mt-2">訂單ID : {{ props.$index }}</p> -->
                  </div>
                  <div class="me-4" style="margin-left: 120px">
                    <p>
                      手續費 : <span class="text-deep-danger fw-bold">{{ props.row.fee }}</span>
                    </p>
                    <p class="mt-2">
                      金額 : <span class="text-deep-danger fw-bold">{{ props.row.innerAmount }}</span>
                    </p>
                  </div>
                  <div class="me-4" style="margin-left: 120px">
                    <p>內充時間 : {{ props.row.createdAt }}</p>
                    <p class="mt-2">內充備註 : {{ props.row.memo }}</p>
                  </div>
                </div>
                <!-- 結算類型 -->
                <div v-if="searchOption.type === 'bill'" class="d-flex py-3 expand_borderStyle" style="margin-left: 130px" v-loading="loading" element-loading-background="rgba(122, 122, 122, 0.0)">
                  <div class="me-4" style="margin-left: 50px">
                    <!-- <p @click="test(props)" @keydown="test(props)">商戶收款信 : {{ props.row.bankOwner }}</p> -->
                    <p @click="test(props)" @keydown="test(props)">
                      商戶收款信 :
                      <el-popover effect="light" trigger="hover" placement="top" width="auto">
                        <template #default>
                          <div>持卡人: {{ props.row.bankOwner }}</div>
                          <div>銀行名稱: {{ props.row.bankName }}</div>
                          <div>支行名稱: {{ props.row.bankSubName }}</div>
                          <div>銀行卡號: {{ props.row.bankAccount }}</div>
                        </template>
                        <template #reference>
                          <el-tag>{{ props.row.bankOwner }}</el-tag>
                        </template>
                      </el-popover>
                    </p>
                    <p class="mt-2">
                      平台出款信息 :
                      <el-tag v-if="props.row.isDone === 0" effect="dark" type="danger"> {{ formatbillType(props.row.isDone) }} </el-tag>
                      <el-popover v-if="props.row.isDone === 1" effect="light" trigger="hover" placement="top" width="auto">
                        <template #default>
                          <div>持卡人: {{ props.row.mainCardBankOwner }}</div>
                          <div>銀行名稱: {{ props.row.mainCardBankName }}</div>
                          <div>支行名稱: {{ props.row.mainCardBankSubName }}</div>
                          <div>銀行卡號: {{ props.row.mainCardBankAccount }}</div>
                        </template>
                        <template #reference>
                          <el-tag effect="dark" type="success">{{ props.row.bankOwner }}</el-tag>
                        </template>
                      </el-popover>
                    </p>
                    <!-- <p class="mt-2">訂單ID : {{ props.$index }}</p> -->
                  </div>
                  <div class="me-4" style="margin-left: 120px">
                    <p>
                      結算金額 : <span class="text-deep-danger fw-bold">{{ props.row.billAmount }}</span>
                    </p>
                    <p class="mt-2">
                      手續費 : <span class="text-deep-danger fw-bold">{{ props.row.bankfee }}</span>
                    </p>
                    <p class="mt-2">
                      實結金額 : <span class="text-deep-danger fw-bold">{{ props.row.totalAmount }}</span>
                    </p>
                  </div>
                  <div class="me-4" style="margin-left: 120px">
                    <p>
                      結算類型 : <el-tag type="warning" effect="dark">{{ props.row.billType }}</el-tag>
                    </p>
                    <p class="mt-2">支付時間 : {{ props.row.paidAt }}</p>
                  </div>
                  <div style="margin-left: 120px">
                    <p>
                      結算狀態 :
                      <el-tag :type="props.row.isDone === 1 ? 'success' : 'danger'"> {{ formatbillType(props.row.isDone) }} </el-tag>
                    </p>
                  </div>
                </div>
                <!-- <el-table :data="expandTable">
                  <el-table-column label="商戶訂單ID" prop="merchant_order_id" />
                  <el-table-column label="訂單ID" prop="id" />
                </el-table> -->
              </template>
            </el-table-column>
            <el-table-column prop="merchantName" label="商戶名稱" width="260" align="center">
              <!-- <template v-slot="{ row }">{{ formatRate(row.rate) }}</template> -->
            </el-table-column>
            <el-table-column prop="amount" label="交易金額" align="center" :formatter="stateFormat" sortable width="260">
              <template v-slot="{ row }">
                <div class="me-2">
                  <div>
                    <span class="me-1 text-deep-danger fw-bold fs-6">{{ row.amount }}</span>
                    <span>元</span>
                    <span v-if="searchOption.type === 'interCharge'" class="ms-3" @click="test(row)" @keydown="test(row)"
                      >手續費 : <span class="text-deep-danger fw-bold" style="font-size: 14px">{{ row.innerFee }}</span></span
                    >
                    <span v-if="searchOption.type === 'interCharge'">元</span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="創建時間" align="center" sortable> </el-table-column>
            <el-table-column prop="balance" label="商戶當前餘額" align="center" :formatter="stateFormat" sortable>
              <template v-slot="{ row }">
                <div class="me-2">
                  <span class="me-1 text-deep-danger fw-bold fs-6">{{ row.balance }}</span>
                  <span>元</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="交易類型" align="center">
              <template v-slot="{ row }">
                <div v-if="searchOption.type === 'order'">
                  <span><i class="fa-solid fa-bag-shopping fs-5 me-2"></i>{{ formatPaidStatus(row.type) }}</span>
                </div>
                <div v-if="searchOption.type === 'interCharge'">
                  <span><i class="fa-brands fa-invision fs-5 me-2"></i>{{ formatPaidStatus(row.type) }}</span>
                </div>
                <div v-if="searchOption.type === 'bill'">
                  <span><i class="fa-solid fa-money-bill-wave fs-5 me-2"></i>{{ formatPaidStatus(row.type) }}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分頁套件 -->
          <div class="d-flex justify-content-end mt-4">
            <el-pagination :page-sizes="[10, 30, 50, 100]" layout="sizes,prev, pager, next" :total="totalPage" class="pageStyle d-flex flex-row-reverse" v-model:page-size="pageSize" :current-page="currentPage" @current-change="handleCurrentChange" @size-change="sizeChange"> </el-pagination>
          </div>
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
                <el-button color="#faa30d" class="datePick_btn py-4 px-5 mt-4 fw-bold fs-6 align-self-center" size="small" @click="openExcelModal()">當日</el-button>
                <el-button color="#faa30d" class="datePick_btn py-4 px-5 mt-4 fw-bold fs-6 align-self-center" size="small" @click="openExcelModal()">近三天</el-button>
                <el-button color="#faa30d" class="datePick_btn py-4 px-5 mt-4 fw-bold fs-6 align-self-center" size="small" @click="openExcelModal()">近7天</el-button>
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
// import { ElMessage } from 'element-plus';
// import table2excel from 'js-table2excel';
import moment from 'moment';

// 當前時間
const nowTime = moment(new Date()).utc().format();
// 千分位
const comma = /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g;

export default {
  data() {
    return {
      // 搜尋選項
      searchOption: {
        take: 10,
        skip: 0,
        type: 'order',
      },
      innerOption: {
        id: '',
        limit: 1,
        skip: 0,
      },
      // 展開選項
      expandOption: {
        id: '',
        limit: 1,
        skip: 0,
      },
      // 訂單展開table
      expands: {
        merchant_order_id: '5',
        targetId: '翻斗花园21号',
        costFee: '',
        allAmount: '',
        createdAt: 'wangxiaohu',
        paidAt: '2016-05-01',
        isPaid: '',
        isGotReceipt: '',
      },
      // 內充展開table
      expands_inner: {
        fee: '',
        innerAmount: '',
        memo: '', // 備註
      },
      // 結算展開table
      expands_bill: {
        // 商戶收款訊息
        bankOwner: '',
        bankName: '',
        bankAccount: '',
        bankSubName: '',
        // 平台出款訊息
        mainCardBankAccount: '',
        mainCardBankName: '',
        mainCardBankOwner: '',
        mainCardBankSubName: '',
        isDone: '',
        billAmount: '',
        totalAmount: '',
        billType: '',
        paidAt: '',
        bankfee: '',
      },

      // 交易類型
      orderType: '訂單',

      // 下方訂單Table
      orderTable: [],
      //   圖片來源
      imgSrc: '',

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
      loading: false,
      childBorder: true,
      // excel彈窗
      dateRange: '',
      radio2: '今天', // 時間區間
    };
  },
  methods: {
    // 過濾交易類型
    formatPaidStatus(type) {
      if (type === 'order') {
        return '訂單';
      }
      if (type === 'interCharge') {
        return '內充';
      }
      return '結算';
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
    // 過濾結算類型
    formatbillType(isDone) {
      if (isDone === 1) {
        return '已結算';
      }
      if (isDone === 0) {
        return '未結算';
      }
      return '備用';
    },
    // 選擇交易類型
    searchDate(label) {
      console.log(nowTime);
      console.log(label);
      if (label === '訂單') {
        this.searchOption.type = 'order';
      }
      if (label === '內充') {
        this.searchOption.type = 'interCharge';
      }
      if (label === '結算') {
        this.searchOption.type = 'bill';
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
    // 查詢
    doSearch() {
      this.loading_table = true;
      this.$http.post('/aze_api/api/getMerchantDetail', this.searchOption).then((res) => {
        console.log(res.data.rows);
        this.orderTable = res.data.rows.data;
        this.totalPage = res.data.rows.count;
        this.loading_table = false;
        _.forEach(this.orderTable, (item, key) => {
          this.orderTable[key].amount = this.orderTable[key].amount.toString().replace(comma, ',');
          this.orderTable[key].balance = this.orderTable[key].balance.toString().replace(comma, ',');
          this.innerOption.id = item.targetId;
          console.log(this.innerOption.id);
          if (this.searchOption.type === 'interCharge') {
            this.$http.post('/api/getInterChargeList', this.innerOption).then((res1) => {
              console.log(res1.data.data.dataset.fee);
              this.orderTable[key].innerFee = res1.data.data.dataset.fee.toString().replace(comma, ',');
              console.log(item.innerFee);
            });
          }
        });
      });
    },
    // 展開訂單
    expandOrder(row, expandRows) {
      console.log(row, expandRows);
      if (this.searchOption.type === 'order') {
        if (JSON.stringify(expandRows).includes(JSON.stringify(row)) === true) {
          this.expandOption.id = row.targetId;
          this.loading = true;
          this.$http.post('/api/getOrders', this.expandOption).then((res) => {
            console.log(res.data.data.dataset);
            this.expands.merchant_order_id = res.data.data.dataset.merchant_order_id;
            this.expands.targetId = res.data.data.dataset.id;
            this.expands.costFee = res.data.data.dataset.costFee.toString().replace(comma, ',');
            this.expands.allAmount = res.data.data.dataset.amount.toString().replace(comma, ',');
            this.expands.paidAt = res.data.data.dataset.paidAt;
            this.expands.isPaid = res.data.data.dataset.isPaid;
            this.expands.isGotReceipt = res.data.data.dataset.isGotReceipt;
            console.log(this.expands);
            // 新增orderTable的細項
            _.forEach(this.orderTable, (item, key) => {
              if (item.targetId === row.targetId) {
                this.orderTable[key].merchant_order_id = this.expands.merchant_order_id;
                this.orderTable[key].costFee = this.expands.costFee;
                this.orderTable[key].allAmount = this.expands.allAmount;
                this.orderTable[key].paidAt = this.expands.paidAt;
                this.orderTable[key].isPaid = this.expands.isPaid;
                this.orderTable[key].isGotReceipt = this.expands.isGotReceipt;
                this.loading = false; // 表格加载關
                console.log(item.targetId, row.targetId);
                // this.orderTable[key].merchant_order_id = this.expands.merchant_order_id;
              }
            });
          });
        } else {
          this.loading = false; // 表格加载开
          // 让当前行关闭
        }
      }
      if (this.searchOption.type === 'interCharge') {
        if (JSON.stringify(expandRows).includes(JSON.stringify(row)) === true) {
          this.expandOption.id = row.targetId;
          this.loading = true;
          this.$http.post('/api/getInterChargeList', this.expandOption).then((res) => {
            console.log(res.data.data.dataset);
            this.expands_inner.targetId = res.data.data.dataset.id;
            this.expands_inner.fee = res.data.data.dataset.fee.toString().replace(comma, ',');
            this.expands_inner.innerAmount = res.data.data.dataset.amount.toString().replace(comma, ',');
            this.expands_inner.createdAt = res.data.data.dataset.createdAt;
            console.log(this.expands);
            this.expands_inner.memo = res.data.data.dataset.memo;
            // 新增orderTable的細項
            _.forEach(this.orderTable, (item, key) => {
              if (item.targetId === row.targetId) {
                this.orderTable[key].merchant_order_id = this.expands_inner.merchant_order_id;
                this.orderTable[key].fee = this.expands_inner.fee;
                this.orderTable[key].innerAmount = this.expands_inner.innerAmount;
                this.orderTable[key].createdAt = this.expands_inner.createdAt;
                this.orderTable[key].memo = this.expands_inner.memo;
                this.loading = false; // 表格加载關
                console.log(item.targetId, row.targetId);
                // this.orderTable[key].merchant_order_id = this.expands.merchant_order_id;
              }
            });
          });
        } else {
          this.loading = false; // 表格加载开
          // 让当前行关闭
        }
      }
      if (this.searchOption.type === 'bill') {
        if (JSON.stringify(expandRows).includes(JSON.stringify(row)) === true) {
          this.expandOption.id = row.targetId;
          this.loading = true;
          this.$http.post('/api/getMyBills', this.expandOption).then((res) => {
            console.log(res.data.data.dataset);
            this.expands_bill.bankOwner = res.data.data.dataset.bankOwner;
            this.expands_bill.bankName = res.data.data.dataset.bankName;
            this.expands_bill.bankSubName = res.data.data.dataset.bankSubName;
            this.expands_bill.bankAccount = res.data.data.dataset.bankAccount;
            this.expands_bill.mainCardBankOwner = res.data.data.dataset.mainCardBankOwner;
            this.expands_bill.mainCardBankName = res.data.data.dataset.mainCardBankName;
            this.expands_bill.mainCardBankSubName = res.data.data.dataset.mainCardBankSubName;
            this.expands_bill.mainCardBankAccount = res.data.data.dataset.mainCardBankAccount;
            this.expands_bill.isDone = res.data.data.dataset.isDone;
            this.expands_bill.bankfee = res.data.data.dataset.bankfee;
            this.expands_bill.billAmount = res.data.data.dataset.amount.toString().replace(comma, ',');
            this.expands_bill.totalAmount = res.data.data.totalAmount.toString().replace(comma, ',');
            this.expands_bill.billType = res.data.data.dataset.billType;
            this.expands_bill.paidAt = res.data.data.dataset.paidAt;
            console.log(this.expands_bill);
            // 新增orderTable的細項
            _.forEach(this.orderTable, (item, key) => {
              if (item.targetId === row.targetId) {
                this.orderTable[key].bankOwner = this.expands_bill.bankOwner;
                this.orderTable[key].bankName = this.expands_bill.bankName;
                this.orderTable[key].bankSubName = this.expands_bill.bankSubName;
                this.orderTable[key].bankAccount = this.expands_bill.bankAccount;
                this.orderTable[key].mainCardBankOwner = this.expands_bill.mainCardBankOwner;
                this.orderTable[key].mainCardBankName = this.expands_bill.mainCardBankName;
                this.orderTable[key].mainCardBankSubName = this.expands_bill.mainCardBankSubName;
                this.orderTable[key].mainCardBankAccount = this.expands_bill.mainCardBankAccount;
                this.orderTable[key].isDone = this.expands_bill.isDone;
                this.orderTable[key].billAmount = this.expands_bill.billAmount;
                this.orderTable[key].bankfee = this.expands_bill.bankfee;
                this.orderTable[key].totalAmount = this.expands_bill.totalAmount;
                this.orderTable[key].billType = this.expands_bill.billType;
                this.orderTable[key].paidAt = this.expands_bill.paidAt;
                this.loading = false; // 表格加载關
                console.log(item.targetId, row.targetId);
                // this.orderTable[key].merchant_order_id = this.expands.merchant_order_id;
              }
            });
          });
        } else {
          this.loading = false; // 表格加载开
          // 让当前行关闭
        }
      }

      // this.expands = [];
    },
    getRowKeys(row) {
      console.log(row);
      return row.targetId;
    },
    clickTable(row) {
      console.log(row);
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
    // EXCEL彈窗
    openExcelModal() {
      this.excelDialogVisible = true;
    },
    getExcel() {
      this.dateRange[0] = moment(this.dateRange[0]).utc().format();
      this.dateRange[1] = moment(this.dateRange[1]).utc().format();
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
      console.log(row);
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
  box-shadow: 0 0.3rem 0.8rem rgb(0 0 0 / 12%);
  margin-bottom: 1.5rem;
  border: 0 solid transparent;
  border-radius: 15px;
}
.merchant_table {
  width: 100%;
  // margin: auto;
}
// sortable 樣式
.merchant_table .sort-caret.ascending {
  border-bottom-color: rgb(96, 98, 102);
}
.merchant_table .sort-caret.descending {
  border-top-color: rgb(96, 98, 102);
}
.notifyList_table .el-table__header-wrapper {
  border-radius: 15px;
}
.merchant_table .el-table__header-wrapper {
  border-radius: 15px;
}
.merchant_table .el-table,
.el-table__expanded-cell {
  background-color: transparent;
}
.merchant_table .el-table__expand-icon {
  color: #ffffff;
  font-size: 30px;
}
.notifyList_table .el-table,
.el-table__expanded-cell {
  // 通知紀錄 - 表格背景色
  background-color: #ffffff;
}
.merchant_table .el-table th {
  border-bottom: none !important;
  padding-top: 10px;
}
.merchant_table .el-table tr {
  background-color: transparent !important;
  color: white;
}
.notifyList_table .el-table tr {
  background-color: transparent !important;
  color: rgb(0, 0, 0);
}
// 更改表格hover背景色
.merchant_table .el-table__body tr:hover {
  border-radius: 15px !important;
}
.merchant_table .el-table__body tr:hover > td {
  background-color: #2a559592 !important;
}
.notifyList_table .el-table__body tr:hover > td {
  background-color: #6790ce !important;
}
.merchant_table .el-table--enable-row-transition .el-table__body td,
.merchant_table .cell {
  background-color: transparent !important;
  border: none !important; //去掉表格的底線
  margin-top: 10px;
  margin-bottom: 10px !important;
}
.merchant_table .el-table::before {
  //去除底部白线
  height: 0px !important;
  background-color: transparent !important;
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
// 展開border + 一個遮罩
.expand_borderStyle {
  opacity: 0.8;
}
// 交易類型選擇後樣式
.orderType_list .el-radio-button__original-radio:checked + .el-radio-button__inner {
  background: #faa30d !important;
  border-color: #faa30d !important;
  box-shadow: none;
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
