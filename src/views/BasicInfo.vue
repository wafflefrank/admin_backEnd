<template>
  <div class="row">
    <!-- 通道訊息 -->
    <div class="col-12 col-lg-9 col-xl-9">
      <div class="card_outStyle radius-10 p-3">
        <!-- 標題 -->
        <div class="mx-4">
          <h4 class="text-white d-flex flex-start my-4">{{ this.$t('tunnelMsg') }}</h4>
          <!-- 內容 -->
          <div class="user_skills">
            <el-table :data="tableData" :header-cell-style="{ background: 'linear-gradient(180deg, rgba(252, 240, 255, 1) 0%, rgba(89, 160, 182, 0.597) 100%)', color: '#606266' }">
              <el-table-column prop="payGateCode" :label="this.$t('tunnelName')" align="center" width="180">
                <template v-slot="{ row }">{{ formatName(row.payGateCode) }} </template>
              </el-table-column>
              <el-table-column prop="rate" :label="this.$t('ratePercent')" width="180" align="center">
                <template v-slot="{ row }">{{ formatRate(row.rate) }}</template>
              </el-table-column>
              <el-table-column prop="isActive" :label="this.$t('rate')" width="180" align="center">
                <template v-slot="{ row }">
                  <el-tag :type="row.isActive === 1 ? 'success' : 'danger'">
                    {{ formatgmtUsed(row.isActive) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="billType" :label="this.$t('billType')" align="center" />
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <!-- 基本訊息 -->
    <div class="col-12 col-lg-3 col-xl-3">
      <div class="card_outStyle radius-10 p-3">
        <!-- 標題 -->
        <div class="d-flex align-items-center justify-content-between mx-4">
          <h4 class="text-white d-flex flex-start my-4">{{ this.$t('basicMsg') }}</h4>
        </div>
        <!-- 商戶卡訊息 -->
        <div class="card_lightStyle mx-4">
          <div class="mb-4 mx-4">
            <div class="px-3 card-body">
              <div class="text-center bg-gradient-primary d-flex align-items-center justify-content-center mb-3">
                <!-- <i class="fa-solid fa-user"></i> -->
                <img src="../assets/view3.jpg" class="merchant-icon" alt="#" />
              </div>
              <div class="d-flex flex-row-reverse justify-content-center">
                <div>
                  <div class="text-start">
                    <!-- ID -->
                    <p class="mb-1 fs-5 text-sm font-weight-bold fw-bold">
                      {{ this.$t('merchantID') }} : <span class="ms-2">{{ this.memberID }}</span>
                    </p>
                    <!-- key -->
                    <div class="d-flex align-items-center">
                      <p class="mb-0 fs-5 text-sm font-weight-bold fw-bold">{{ this.$t('key') }} :</p>
                      <span class="ms-2 fw-bold">******</span>
                      <el-button class="check_key_btn fw-bold ms-2" color="#faa30d" size="small" @click="centerDialogVisible = true">{{ this.$t('check') }}</el-button>
                    </div>
                    <!-- name -->
                    <div class="mb-1 mt-1 fs-5 text-sm font-weight-bold fw-bold d-flex">
                      <p class="fw-bold me-2">{{ this.$t('name') }} :</p>
                      <span class="fw-bold">{{ this.memberName }}</span>
                    </div>
                    <!-- account -->
                    <div class="mb-1 mt-1 fs-5 text-sm font-weight-bold fw-bold d-flex">
                      <p class="fw-bold me-2">{{ this.$t('account') }} :</p>
                      <span class="fw-bold">{{ this.memberPhone }}</span>
                    </div>
                    <!-- bank card -->
                    <div class="mb-1 mt-1 fs-5 text-sm font-weight-bold fw-bold d-flex align-items-center">
                      <p class="fw-bold">
                        {{ this.$t('bankCard') }} : <span class="text-deep2-danger">{{ this.bankNums }}</span> {{ this.$t('cards') }}
                      </p>
                      <el-button class="invite_friend_btn fw-bold ms-2" color="#faa30d" size="small" @click="checkBank()">{{ this.$t('check') }}</el-button>
                    </div>

                    <!-- 密鑰彈窗 -->
                    <el-dialog class="key_style" v-model="centerDialogVisible" :title="this.$t('key')" width="30%" center>
                      <div class="d-flex justify-content-center align-items-center">
                        <span id="copyText"> {{ this.memberSign }} </span>
                        <i class="fa-regular fa-copy text-yellow ms-2 fs-4" @click="copyText()" @keydown="copyText()"></i>
                      </div>
                    </el-dialog>
                    <!-- 登入紀錄彈窗 -->
                    <el-dialog class="loginHistory_style" v-model="loginDialogVisible" :title="this.$t('loginHistory')" width="40%" center>
                      <div class="loginHyTable_style">
                        <el-table :data="loginHistory_Data" :header-cell-style="{ background: 'linear-gradient(180deg, rgba(252, 240, 255, 1) 0%, rgba(115, 111, 159, 0.46) 100%)', color: '#606266' }">
                          <el-table-column prop="createdAt" :label="this.$t('loginHistory')" width="180" align="center">
                            <!-- <template v-slot="{ row }">{{ formatdfRate(row.dfRate) }}</template> -->
                          </el-table-column>
                          <el-table-column prop="ipLocation" :label="this.$t('loginLocation')" align="center">
                            <!-- <template v-slot="{ row }">{{ formatdfStatus(row.isDfActive) }}</template> -->
                          </el-table-column>
                          <el-table-column prop="ip" label="IP" align="center">
                            <!-- <template v-slot="{ row }">{{ formatdfStatus(row.isDfActive) }}</template> -->
                          </el-table-column>
                        </el-table>
                      </div>
                    </el-dialog>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="mx-4 d-flex justify-content-center px-3 pb-2">
            <p class="fw-bold">{{ this.$t('name') }}:</p>
            <span class="fw-bold">{{ this.memberName }}</span>
          </div> -->
          <!-- <div class="mx-4 d-flex justify-content-center px-3 pb-2">
            <p class="fw-bold">{{ this.$t('account') }}:</p>
            <span class="fw-bold">{{ this.memberPhone }}</span>
          </div> -->
          <!-- <div class="mx-4 d-flex justify-content-evenly px-3 pb-2 align-items-center">
            <p class="fw-bold">
              {{ this.$t('bankCard') }} <span class="text-deep2-danger">{{ this.bankNums }}</span> {{ this.$t('cards') }}
            </p>
            <el-button class="invite_friend_btn fw-bold" color="#faa30d" size="default" @click="checkBank()">{{ this.$t('check') }}</el-button>
          </div> -->
          <div class="d-flex justify-content-center">
            <el-button class="invite_friend_btn mt-1 px-4 py-4 fw-bold mb-4" color="#faa30d" size="default" @click="loginDialogVisible = true">{{ this.$t('loginHistory') }}</el-button>
          </div>
        </div>

        <span class="text-deep2">{{ this.$t('registTime') }} : {{ this.registTime }} </span>
      </div>
    </div>
  </div>
  <!-- 代付 -->
  <div class="row justify-content-start mt-4">
    <div class="col-9">
      <div class="card_outStyle radius-10 p-3">
        <!-- 標題 -->
        <div class="mx-4">
          <h4 class="text-white d-flex flex-start my-4">{{ this.$t('bill') }}</h4>
        </div>
        <!-- 內容 -->
        <div class="user_skills">
          <el-table :data="dfData" :header-cell-style="{ background: 'linear-gradient(180deg, rgba(252, 240, 255, 1) 0%, rgba(89, 160, 182, 0.597) 100%)', color: '#606266' }">
            <el-table-column prop="dfRate" :label="this.$t('rate')" width="180" align="center">
              <template v-slot="{ row }">{{ formatdfRate(row.dfRate) }}</template>
            </el-table-column>
            <el-table-column prop="isDfActive" :label="this.$t('status')" align="center">
              <template v-slot="{ row }">{{ formatdfStatus(row.isDfActive) }}</template>
            </el-table-column>
          </el-table>
          <div class="d-flex mx-4 mt-5">
            <span class="fs-6 text-deep-danger fw-bold me-2">※</span>
            <span class="fs-6 text-light2">Payments On Behalf Of (POBO) AND Collections On Behalf Of (COBO)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus';

export default {
  data() {
    return {
      centerDialogVisible: false,
      loginDialogVisible: false,
      memberID: '',
      memberName: '',
      memberSign: '',
      memberPhone: '',
      registTime: '',
      // 通道資料
      tableData: [],
      // 代付資料
      dfData: [],
      // 銀行卡張數
      bankNums: 0,
      // 登入紀錄資料
      loginHistory_Data: [],
    };
  },
  methods: {
    // 取得銀行卡清單
    getBankList() {
      this.$http.get('/api/getMyBanks').then((res) => {
        console.log(res.data.data);
        this.bankNums = res.data.data.length;
      });
    },
    // 取得登入紀錄
    getLoginHistory() {
      this.$http.get('/api/getMyRecentLogins').then((res) => {
        console.log(res.data.data);
        this.loginHistory_Data = res.data.data;
      });
    },
    // 商戶資料
    getMyInfo() {
      this.$http.get('/api/myInfo').then((res) => {
        console.log(res.data.data);
        this.dfData.push(res.data.data);
        this.memberID = res.data.data.id;
        this.memberName = res.data.data.name;
        this.memberSign = res.data.data.sign;
        this.memberPhone = res.data.data.phone;
        this.registTime = res.data.data.createdAt;
        console.log(this.memberID, this.memberName, this.memberSign, this.memberPhone);
        this.memberPhone = this.memberPhone.replace(this.memberPhone.substr(3, 4), '****');
        // this.OrderTotal.dayTotal = res.data.data.dayTotalOrderAmount;
        // this.OrderTotal.monthTotal = res.data.data.monthTotalOrderAmount;
      });
    },
    // 通道訊息
    getTunnelInfo() {
      this.$http.get('/api/getMyTunnelInfo').then((res) => {
        console.log(res.data.data);
        this.tableData = res.data.data;
        // this.memberID = res.data.data.id;
        // this.memberName = res.data.data.name;
        // this.memberSign = res.data.data.sign;
        // this.memberPhone = res.data.data.phone;
        // this.registTime = res.data.data.createdAt;
        console.log(this.memberID, this.memberName, this.memberSign, this.memberPhone);
      });
    },
    // 過濾通道名稱
    formatName(payGateCode) {
      if (this.$i18n.locale === 'tw') {
        if (payGateCode === 'VNBANK') {
          return '越南卡轉卡';
        }
        if (payGateCode === 'VNZALO') {
          return '越南ZALO';
        }
        if (payGateCode === 'VNBANKQR') {
          return '越南銀行掃碼';
        }
        if (payGateCode === 'VNMOMO') {
          return '越南MOMO';
        }
        if (payGateCode === 'VNDIRECT') {
          return '越南直連';
        }
        if (payGateCode === 'VNVIETTEL') {
          return '越南ViettelPay';
        }
        if (payGateCode === 'INTER_CHARGE') {
          return '內充';
        }
        if (payGateCode === 'PHGCASH') {
          return 'PHGCASH';
        }
        if (payGateCode === 'PHGCASHQR') {
          return 'PHGCASH掃碼';
        }
        if (payGateCode === 'PHGCASHDIRECT') {
          return 'PHGCASH直連';
        }
      }
      if (this.$i18n.locale === 'en') {
        if (payGateCode === 'VNBANK') {
          return 'VNBANK';
        }
        if (payGateCode === 'VNZALO') {
          return 'VNZALO';
        }
        if (payGateCode === 'VNBANKQR') {
          return 'Vietnam bank scan code';
        }
        if (payGateCode === 'VNMOMO') {
          return 'Vietnam MOMO';
        }
        if (payGateCode === 'VNDIRECT') {
          return 'Vietnam Direct';
        }
        if (payGateCode === 'VNVIETTEL') {
          return 'Vietnam ViettelPay';
        }
        if (payGateCode === 'INTER_CHARGE') {
          return 'Internal top-up';
        }
        if (payGateCode === 'PHGCASH') {
          return 'PHGCASH';
        }
        if (payGateCode === 'PHGCASHQR') {
          return 'PHGCASH scan code';
        }
        if (payGateCode === 'PHGCASHDIRECT') {
          return 'PHGCASH Direct';
        }
      }
      if (this.$i18n.locale === 'cn') {
        if (payGateCode === 'VNBANK') {
          return '越南卡转卡';
        }
        if (payGateCode === 'VNZALO') {
          return '越南ZALO';
        }
        if (payGateCode === 'VNBANKQR') {
          return '越南银行扫码';
        }
        if (payGateCode === 'VNMOMO') {
          return '越南MOMO';
        }
        if (payGateCode === 'VNDIRECT') {
          return '越南直连';
        }
        if (payGateCode === 'VNVIETTEL') {
          return '越南ViettelPay';
        }
        if (payGateCode === 'INTER_CHARGE') {
          return '内充';
        }
        if (payGateCode === 'PHGCASH') {
          return 'PHGCASH';
        }
        if (payGateCode === 'PHGCASHQR') {
          return 'PHGCASH扫码';
        }
        if (payGateCode === 'PHGCASHDIRECT') {
          return 'PHGCASH直连';
        }
      }
      if (this.$i18n.locale === 'vn') {
        if (payGateCode === 'VNBANK') {
          return 'Chuyển thẻ việt nam';
        }
        if (payGateCode === 'VNZALO') {
          return 'ZALO Việt Nam';
        }
        if (payGateCode === 'VNBANKQR') {
          return 'Mã quét ngân hàng việt nam';
        }
        if (payGateCode === 'VNMOMO') {
          return 'MOMO Việt Nam';
        }
        if (payGateCode === 'VNDIRECT') {
          return 'Trực tiếp Việt Nam';
        }
        if (payGateCode === 'VNVIETTEL') {
          return 'ViettelPay Việt Nam';
        }
        if (payGateCode === 'INTER_CHARGE') {
          return 'Phí nội bộ';
        }
        if (payGateCode === 'PHGCASH') {
          return 'PHGCASH';
        }
        if (payGateCode === 'PHGCASHQR') {
          return 'Mã quét PHGCASH';
        }
        if (payGateCode === 'PHGCASHDIRECT') {
          return 'PHGCASH kết nối trực tiếp';
        }
      }
      return '測試用';
    },
    // 過濾費率%比率
    formatRate(rate) {
      return `${(rate * 100).toFixed(2)} %`;
    },
    // 過濾開通狀態
    formatgmtUsed(isActive) {
      if (this.$i18n.locale === 'tw') {
        if (isActive === 1) {
          return '已開通';
        }
        if (isActive === 0) {
          return '未開通';
        }
      }
      if (this.$i18n.locale === 'en') {
        if (isActive === 1) {
          return 'Opened';
        }
        if (isActive === 0) {
          return 'Closed';
        }
      }
      if (this.$i18n.locale === 'vn') {
        if (isActive === 1) {
          return 'Đã mở';
        }
        if (isActive === 0) {
          return 'đã đóng';
        }
      }
      if (this.$i18n.locale === 'cn') {
        if (isActive === 1) {
          return '已开通';
        }
        if (isActive === 0) {
          return '未开通';
        }
      }
      return '備用';
    },
    // 過濾代付費率狀態
    formatdfRate(dfRate) {
      return `${(dfRate * 100).toFixed(2)} %`;
    },
    // 過濾代付狀態
    formatdfStatus(isDfActive) {
      if (this.$i18n.locale === 'tw') {
        if (isDfActive === 1) {
          return '開啟';
        }
        if (isDfActive === 0) {
          return '關閉';
        }
      }
      if (this.$i18n.locale === 'en') {
        if (isDfActive === 1) {
          return 'Active';
        }
        if (isDfActive === 0) {
          return 'Closed';
        }
      }
      if (this.$i18n.locale === 'vn') {
        if (isDfActive === 1) {
          return 'Tích cực';
        }
        if (isDfActive === 0) {
          return 'Tắt';
        }
      }
      if (this.$i18n.locale === 'cn') {
        if (isDfActive === 1) {
          return '开启';
        }
        if (isDfActive === 0) {
          return '关闭';
        }
      }
      return '測試用';
    },
    // 複製功能
    copyText() {
      const range = document.createRange();
      range.selectNode(document.getElementById('copyText'));
      const selection = window.getSelection();
      if (selection.rangeCount > 0) selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand('copy');
      ElMessage({ showClose: true, message: 'Copied!', type: 'success' });
    },
    // 查看銀行卡
    checkBank() {
      this.$router.push('/bankList');
    },
  },
  created() {
    this.getMyInfo();
    this.getTunnelInfo();
    this.getBankList();
    this.getLoginHistory();
  },
};
</script>

<style lang="scss">
.merchant_style {
  -webkit-box-shadow: 0px 0px 50px -11px rgba(56, 166, 207, 1);
  -moz-box-shadow: 0px 0px 50px -11px rgba(56, 166, 207, 1);
  box-shadow: 0px 0px 50px -11px rgb(164, 184, 192);
  background: rgb(240, 251, 255);
  background: linear-gradient(90deg, rgba(240, 251, 255, 1) 0%, rgba(114, 225, 255, 0.544) 100%);
  border: 0;
}
.merchant-icon {
  max-width: 100px;
  max-height: 100px;
  border-radius: 50%;
  margin: auto;
  width: 100px;
  height: auto;
  box-shadow: 0px 1px 10px 2px rgba(31, 30, 30, 0.61);
  -webkit-box-shadow: 0px 1px 10px 2px rgba(31, 30, 30, 0.61);
  -moz-box-shadow: 0px 1px 10px 2px rgba(31, 30, 30, 0.61);
}
// 卡片最外框底樣式
.card_outStyle {
  background-color: rgb(0 0 0 / 20%);
  // box-shadow: 0 0.3rem 0.8rem rgb(0 0 0 / 12%);
  box-shadow: 0px 0px 10px 2px rgba(242, 242, 242, 0.61);
  -webkit-box-shadow: 0px 0px 19px 2px rgba(242, 242, 242, 0.61);
  -moz-box-shadow: 0px 0px 19px 2px rgba(242, 242, 242, 0.61);
  margin-bottom: 1.5rem;
  border: 0 solid transparent;
}
// 卡片長條樣式
.card_lightStyle {
  padding: 15px 0;
  border-radius: 10px;
  background: rgb(252, 240, 255);
  background: linear-gradient(90deg, rgb(214, 208, 215) 0%, rgba(89, 160, 182, 0.597) 100%);
  box-shadow: 0 0.3rem 0.8rem rgb(0 0 0 / 12%);
  margin-bottom: 1.5rem;
  border: 0 solid transparent;
}
.radius-10 {
  border-radius: 20px;
}
.key_style .el-dialog__title {
  font-size: 20px;
  font-weight: bold;
}
.user_skills {
  width: 100%;
  // margin: auto;
}
.user_skills .el-table__header-wrapper {
  border-radius: 15px;
}
.user_skills .el-table,
.el-table__expanded-cell {
  background-color: transparent;
}
.user_skills .el-table th {
  border-bottom: none !important;
  padding-top: 10px;
}
.user_skills .el-table tr {
  background-color: transparent !important;
  color: white;
}
// 更改表格hover背景色
.user_skills .el-table__body tr:hover {
  border-radius: 15px !important;
}
.user_skills .el-table__body tr:hover > td {
  background-color: #2a5595 !important;
}
.user_skills .el-table--enable-row-transition .el-table__body td,
.el-table .cell {
  background-color: transparent;
  border: none !important; //去掉表格的底線
  margin-top: 10px;
  margin-bottom: 10px !important;
}
.user_skills :deep(.el-table::before) {
  //去除底部白线
  height: 0px !important;
  background-color: transparent !important;
}
.loginHistory_style {
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
.loginHyTable_style {
  width: 100%;
  // margin: auto;
}
.loginHyTable_style .el-table__header-wrapper {
  border-radius: 15px;
}
.loginHyTable_style .el-table,
.el-table__expanded-cell {
  background-color: transparent;
}
.loginHyTable_style .el-table th {
  border-bottom: none !important;
  padding-top: 10px;
}
.loginHyTable_style .el-table tr {
  background-color: transparent !important;
  color: white;
}
// 更改表格hover背景色
.loginHyTable_style .el-table__body tr:hover {
  border-radius: 15px !important;
}
.loginHyTable_style .el-table__body tr:hover > td {
  background-color: #2a5595 !important;
}
.loginHyTable_style .el-table--enable-row-transition .el-table__body td,
.el-table .cell {
  background-color: transparent;
  border: none !important; //去掉表格的底線
  margin-top: 10px;
  margin-bottom: 10px !important;
}
.loginHyTable_style :deep(.el-table::before) {
  //去除底部白线
  height: 0px !important;
  background-color: transparent !important;
}
// .check_key_btn {
// }
</style>
