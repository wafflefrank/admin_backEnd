<template>
  <div class="row">
    <!-- 基本訊息 -->
    <div class="col-12 col-lg-3 col-xl-3">
      <div class="card_outStyle radius-10 p-3">
        <!-- 標題 -->
        <div class="d-flex align-items-center justify-content-between mx-4">
          <h4 class="text-white d-flex flex-start my-4">基本信息</h4>
        </div>
        <!-- 商戶卡訊息 -->
        <div class="mb-4 card merchant_style mx-4">
          <div class="px-3 card-body">
            <div class="d-flex flex-row-reverse justify-content-between">
              <div>
                <div class="text-center merchant-icon bg-gradient-primary d-flex align-items-center justify-content-center">
                  <img src="../assets/avatar.png" class="merchant-icon" alt="#" />
                </div>
              </div>
              <div>
                <div class="text-start">
                  <p class="mb-0 fs-5 text-sm font-weight-bold fw-bold">商戶ID : {{ this.memberID }}</p>
                  <div class="d-flex align-items-center">
                    <p class="mb-0 fs-5 text-sm font-weight-bold fw-bold">密鑰 :</p>
                    <span class="ms-2 fw-bold">******</span>
                  </div>
                  <el-button class="invite_friend_btn mt-1 px-5 fw-bold" color="#faa30d" size="default" @click="centerDialogVisible = true">查看密鑰</el-button>

                  <!-- 密鑰彈窗 -->
                  <el-dialog class="key_style" v-model="centerDialogVisible" title="密鑰" width="30%" center>
                    <div class="d-flex justify-content-center align-items-center">
                      <span id="copyText"> {{ this.memberSign }} </span>
                      <i class="fa-regular fa-copy text-yellow ms-2 fs-4" @click="copyText()" @keydown="copyText()"></i>
                    </div>
                  </el-dialog>
                  <!-- 登入紀錄彈窗 -->
                  <el-dialog class="loginHistory_style" v-model="loginDialogVisible" title="登入紀錄" width="40%" center>
                    <div class="loginHyTable_style">
                      <el-table :data="loginHistory_Data" :header-cell-style="{ background: 'linear-gradient(180deg, rgba(252, 240, 255, 1) 0%, rgba(115, 111, 159, 0.46) 100%)', color: '#606266' }">
                        <el-table-column prop="createdAt" label="登入時間" width="180" align="center">
                          <!-- <template v-slot="{ row }">{{ formatdfRate(row.dfRate) }}</template> -->
                        </el-table-column>
                        <el-table-column prop="ipLocation" label="登入地點" align="center">
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
        <div class="card_lightStyle mx-4 d-flex justify-content-between px-3">
          <p class="fw-bold">姓名:</p>
          <span class="fw-bold">{{ this.memberName }}</span>
        </div>
        <div class="card_lightStyle mx-4 d-flex justify-content-between px-3">
          <p class="fw-bold">帳號:</p>
          <span class="fw-bold">{{ this.memberPhone }}</span>
        </div>
        <div class="card_lightStyle mx-4 d-flex justify-content-between px-3 align-items-center">
          <p class="fw-bold">銀行卡 {{ this.bankNums }} 張</p>
          <el-button class="invite_friend_btn fw-bold" color="#faa30d" size="default" @click="checkBank()">查看</el-button>
        </div>
        <div class="d-flex justify-content-center">
          <el-button class="invite_friend_btn mt-1 px-4 py-4 fw-bold mb-4" color="#faa30d" size="default" @click="loginDialogVisible = true">登入紀錄</el-button>
        </div>

        <span class="text-deep2">註冊時間 : {{ this.registTime }} </span>
      </div>
    </div>
    <!-- 通道訊息 -->
    <div class="col-12 col-lg-9 col-xl-9">
      <div class="card_outStyle radius-10 p-3">
        <!-- 標題 -->
        <div class="mx-4">
          <h4 class="text-white d-flex flex-start my-4">通道訊息</h4>
          <!-- 內容 -->
          <div class="user_skills">
            <el-table :data="tableData" :header-cell-style="{ background: 'linear-gradient(180deg, rgba(252, 240, 255, 1) 0%, rgba(89, 160, 182, 0.597) 100%)', color: '#606266' }">
              <el-table-column prop="payGateCode" label="通道名稱" align="center" width="180">
                <template v-slot="{ row }">{{ formatName(row.payGateCode) }}</template>
              </el-table-column>
              <el-table-column prop="rate" label="費率(%)" width="180" align="center">
                <template v-slot="{ row }">{{ formatRate(row.rate) }}</template>
              </el-table-column>
              <el-table-column prop="isActive" label="費率" width="180" align="center">
                <template v-slot="{ row }">
                  <el-tag :type="row.isActive === 1 ? 'success' : 'danger'">
                    {{ formatgmtUsed(row.isActive) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="billType" label="結算方式" align="center" />
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 代付 -->
  <div class="row justify-content-end">
    <div class="col-9">
      <div class="card_outStyle radius-10 p-3">
        <!-- 標題 -->
        <div class="mx-4">
          <h4 class="text-white d-flex flex-start my-4">代付</h4>
        </div>
        <!-- 內容 -->
        <div class="user_skills">
          <el-table :data="dfData" :header-cell-style="{ background: 'linear-gradient(180deg, rgba(252, 240, 255, 1) 0%, rgba(89, 160, 182, 0.597) 100%)', color: '#606266' }">
            <el-table-column prop="dfRate" label="費率(%)" width="180" align="center">
              <template v-slot="{ row }">{{ formatdfRate(row.dfRate) }}</template>
            </el-table-column>
            <el-table-column prop="isDfActive" label="狀態" align="center">
              <template v-slot="{ row }">{{ formatdfStatus(row.isDfActive) }}</template>
            </el-table-column>
          </el-table>
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
      return '測試用';
    },
    // 過濾費率%比率
    formatRate(rate) {
      return `${(rate * 100).toFixed(2)} %`;
    },
    // 過濾開通狀態
    formatgmtUsed(isActive) {
      if (isActive === 1) {
        return '已開通';
      }
      if (isActive === 0) {
        return '未開通';
      }
      return '備用';
    },
    // 過濾代付費率狀態
    formatdfRate(dfRate) {
      return `${(dfRate * 100).toFixed(2)} %`;
    },
    // 過濾代付狀態
    formatdfStatus(isDfActive) {
      if (isDfActive === 1) {
        return '開啟';
      }
      if (isDfActive === 0) {
        return '關閉';
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
  width: 60px;
  height: 60px;
  background-position: 50%;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
// 卡片最外框底樣式
.card_outStyle {
  background-color: rgb(0 0 0 / 20%);
  box-shadow: 0 0.3rem 0.8rem rgb(0 0 0 / 12%);
  margin-bottom: 1.5rem;
  border: 0 solid transparent;
}
// 卡片長條樣式
.card_lightStyle {
  padding: 15px 0;
  border-radius: 10px;
  background: rgb(252, 240, 255);
  background: linear-gradient(90deg, rgba(252, 240, 255, 1) 0%, rgba(89, 160, 182, 0.597) 100%);
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
</style>
