<template>
  <div class="row">
    <!-- 基本訊息 -->
    <div class="col-12">
      <div class="card_outStyle radius-10 p-3 pb-4">
        <!-- 標題 -->
        <div class="d-flex align-items-center justify-content-between mx-4">
          <h4 class="text-white d-flex flex-start my-4">{{ this.$t('bankCardInfo') }}</h4>
        </div>
        <div class="d-flex justify-content-between">
          <!-- 交易類型 -->
          <div class="d-flex align-items-center mx-4">
            <el-checkbox class="checkCard_style" v-model="checked2" @change="test(checked2)">{{ this.$t('showNum') }}</el-checkbox>
          </div>
          <!-- 新增 & 刪除 -->
          <div class="d-flex flex-column">
            <el-button color="#faa30d" class="search_btn px-4 fw-bold me-3" size="default" @click="openADD_modal()">{{ this.$t('add') }}</el-button>
            <el-popconfirm :title="this.$t('delete_sure')" @confirm="confirmEvent()">
              <template #reference><el-button color="rgba(209, 49, 40, 1)" class="mt-3 px-4 fw-bold me-3" size="default" @click="deleteBank()">{{ this.$t('delete') }}</el-button></template>
            </el-popconfirm>
          </div>
          <!-- 新增彈窗 -->
          <el-dialog class="addModel_style" v-model="addBankVisible" :title="this.$t('addBankCard')" width="70%" center>
            <!-- <el-input class="bankName_style" v-model="google_code" placeholder="銀行名稱"> </el-input> -->

            <el-input class="bankName_style mt-3" v-model="addForm.bankAccount" :placeholder="this.$t('bankAccount')">
              <template #prepend>{{ this.$t('bankAccount') }}</template>
              <template #append>
                <el-select class="chooseBank_style" v-model="addForm.bankName" :placeholder="this.$t('choose_bank')" @change="chooseBank_name(addForm.bankName)" clearable>
                  <el-option label="AGRIBANK" value="AGRIBANK"></el-option>
                  <el-option label="BIDV" value="BIDV"></el-option>
                  <el-option label="VIETINBANK" value="VIETINBANK"></el-option>
                  <el-option label="VPBANK" value="VPBANK"></el-option>
                  <el-option label="VCB" value="VCB"></el-option>
                  <el-option label="ACB" value="ACB"></el-option>
                  <el-option label="ABBANK" value="ABBANK"></el-option>
                  <el-option label="NASB" value="NASB"></el-option>
                  <el-option label="VIETCAPITAL" value="VIETCAPITAL"></el-option>
                  <el-option label="VIB" value="VIB"></el-option>
                  <el-option label="BVB" value="BVB"></el-option>
                  <el-option label="LPB" value="LPB"></el-option>
                  <el-option label="CIMB" value="CIMB"></el-option>
                  <el-option label="PVCOMBANK" value="PVCOMBANK"></el-option>
                  <el-option label="OCEANBANK" value="OCEANBANK"></el-option>
                  <el-option label="GPB" value="GPB"></el-option>
                  <el-option label="DONGABANK" value="DONGABANK"></el-option>
                  <el-option label="SEABANK" value="SEABANK"></el-option>
                  <el-option label="MSB" value="MSB"></el-option>
                  <el-option label="INDOVINA" value="INDOVINA"></el-option>
                  <el-option label="IBK" value="IBK"></el-option>
                  <el-option label="KIENLONG" value="KIENLONG"></el-option>
                  <el-option label="TECHCOMBANK" value="TECHCOMBANK"></el-option>
                  <el-option label="VRB" value="VRB"></el-option>
                  <el-option label="NAMABANK" value="NAMABANK"></el-option>
                  <el-option label="HDB" value="HDB"></el-option>
                  <el-option label="OCB" value="OCB"></el-option>
                  <el-option label="PBVN" value="PBVN"></el-option>
                  <el-option label="MB" value="MB"></el-option>
                  <el-option label="NCB" value="NCB"></el-option>
                  <el-option label="SHB" value="SHB"></el-option>
                  <el-option label="SAIGONBANK" value="SAIGONBANK"></el-option>
                  <el-option label="SACOMBANK" value="SACOMBANK"></el-option>
                  <el-option label="TPBANK" value="TPBANK"></el-option>
                  <el-option label="UOB" value="UOB"></el-option>
                  <el-option label="VAB" value="VAB"></el-option>
                  <el-option label="VIETBANK" value="VIETBANK"></el-option>
                  <el-option label="WOORIBANK" value="WOORIBANK"></el-option>
                  <el-option label="PGBANK" value="PGBANK"></el-option>
                  <el-option label="EXIMBANK" value="EXIMBANK"></el-option>
                </el-select>
              </template>
            </el-input>
            <el-input class="addInfo_style mt-3" v-model="addForm.bankOwner" :placeholder="this.$t('bankOwner')"> <template #prepend>{{ this.$t('bankOwner') }}</template> </el-input>
            <el-input class="addInfo_style mt-3" v-model="addForm.googleVerifyCode" :placeholder="this.$t('googleCode')"> <template #prepend>{{ this.$t('googleCode') }}</template> </el-input>

            <div class="d-flex justify-content-center">
              <el-button color="#faa30d" class="save_btn p-4 mt-4 fw-bold fs-5 align-self-center" size="default" @click="saveBank()">{{ this.$t('Save') }}</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
  <!-- 查詢內容table -->
  <div class="row">
    <div class="col-12">
      <div v-if="isRouterAlive" class="card_outStyle d-flex flex-wrap radius-10 p-4">
        <div class="bankCard_style my-2 mx-4" v-for="item in bankCard" :key="item" :class="active === item.id ? 'active' : ''" @click="clickScript(item)" @keydown="clickScript(item)">
          <div class="card-body">
            <!-- 銀行卡內容 -->
            <!-- <div class="card-title d-flex align-items-center justify-content-between">
              <span class="text-white fw-bold py-2">{{ item.name }}</span>
              <i class="edit_Style fs-3 fa-solid fa-ellipsis" @click="editModal(item)" @keydown="editModal(item)"></i>
            </div> -->
            <!-- 可用金額 & 委託交易中 🥞-->
            <el-row class="mt-3">
              <el-col :span="24">
                <span class="fw-bold">{{ item.bankName }}</span>
              </el-col>
            </el-row>
            <el-row class="text-start" style="margin-top: 80px">
              <el-col :span="24">
                <span v-if="checked2 === true" class="fw-bold">{{ item.bankOwner }}</span>
                <span v-if="checked2 === false" class="fw-bold">{{ item.replaceBankOwner }}</span>
              </el-col>
            </el-row>
            <!-- xx Bank -->
            <el-row class="mt-1 text-start">
              <el-col :span="24">
                <span v-if="checked2 === true" class="fw-bold">{{ item.bankAccount }}</span>
                <span v-if="checked2 === false" class="fw-bold">{{ item.replaceBankAccount }}</span>
              </el-col>
            </el-row>
          </div>
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
const nowTime = moment(new Date()).utc().format();
// 千分位
// const comma = /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g;

export default {
  data() {
    return {
      isRouterAlive: true,
      // 是否顯示卡號
      checked2: true,
      // 加載
      loading_table: false,
      loading: false,
      childBorder: true,
      //   是否開起彈窗
      addBankVisible: false,

      //   新增資訊
      addForm: {
        bankName: '',
        bankAccount: '',
        bankOwner: '',
        googleVerifyCode: '',
        bankType: '1',
      },
      errorMsg: {
        bankAccount: '',
        bankName: '',
        bankOwner: '',
        googleVerifyCode: '',
      },
      //   銀行卡列表
      bankCard: [],
      //   銀行卡點擊新增
      active: '',
      // 欲刪除銀行卡
      deleteBank_choose: {
        id: '',
      },
    };
  },
  methods: {
    // 取得銀行卡清單
    getBankList() {
      this.$http.get('/api/getMyBanks').then((res) => {
        console.log(res.data.data);
        this.bankCard = res.data.data;
      });
    },
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
    // 選擇銀行
    chooseBank_name(item) {
      console.log(item);
      this.addForm.bankName = item;
    },
    test(checked2) {
      console.log(checked2);
      if (checked2 === false) {
        _.forEach(this.bankCard, (item, key) => {
          this.bankCard[key].replaceBankOwner = item.bankOwner.replace(item.bankOwner.substr(3, 4), '****');
          this.bankCard[key].replaceBankAccount = item.bankAccount.replace(item.bankAccount.substr(3, 4), '****');
          return this.bankCard;
        });
      }
    },
    clickScript(item) {
      this.active = item.id;
      console.log(item.id);
      console.log(item);
    },
    // 新增銀行卡彈窗
    openADD_modal() {
      this.addBankVisible = true;
    },
    // 保存
    saveBank() {
      this.$http.post('/api/addMyBank', this.addForm).then((res) => {
        console.log(res.data.code);
        console.log(res.data.msg);
        const addMsg = res.data.msg;
        if (res.data.code === 200) {
          this.addBankVisible = false;
          this.reload_bankList();
          this.$swal.fire(`${this.$t('addSuccess')}!`, `${this.$t('addSuccess')}`, 'success');
        } else if (res.data.code === 422) {
          this.errorMsg.bankAccount = _.findKey(addMsg, ['param', 'bankAccount']);
          console.log(this.errorMsg.bankAccount);
          if (this.errorMsg.bankAccount !== undefined) {
            ElMessage({ showClose: true, message: `${res.data.msg.bankAccount.msg}`, type: 'error' });
          }
          this.errorMsg.bankName = _.findKey(addMsg, ['param', 'bankName']);
          console.log(this.errorMsg.bankName);
          if (this.errorMsg.bankName !== undefined) {
            ElMessage({ showClose: true, message: `${res.data.msg.bankName.msg}`, type: 'error' });
          }
          this.errorMsg.bankOwner = _.findKey(addMsg, ['param', 'bankOwner']);
          console.log(this.errorMsg.bankOwner);
          if (this.errorMsg.bankOwner !== undefined) {
            ElMessage({ showClose: true, message: `${res.data.msg.bankOwner.msg}`, type: 'error' });
          }
          this.errorMsg.googleVerifyCode = _.findKey(addMsg, ['param', 'googleVerifyCode']);
          console.log(this.wrongMsg);
          if (this.errorMsg.googleVerifyCode !== undefined) {
            ElMessage({ showClose: true, message: `${res.data.msg.googleVerifyCode.msg}`, type: 'error' });
          }
        } else {
          ElMessage({ showClose: true, message: `${this.$t('googleCodeMsg')}`, type: 'error' });
        }
      });
    },
    // 刪除銀行卡
    deleteBank() {},
    // 確認刪除
    confirmEvent() {
      if (this.active === '') {
        ElMessage({ showClose: true, message: `${this.$t('choose_oneCard')}`, type: 'warning' });
      } else if (this.active !== '') {
        this.deleteBank_choose.id = this.active;
        this.$http.post('/api/deleteMyBank', this.deleteBank_choose).then((res) => {
          console.log(res.data.code);
          this.$swal.fire(`${this.$t('deleteSuccess')}!`, `${res.data.msg}`, 'success');
          this.reload_bankList();
          this.active = '';
          return this.active;
        });
      }
    },
    // 重新刷新銀行表
    reload_bankList() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        // 刷新後執行
        this.isRouterAlive = true;
        this.getBankList();
      });
    },
  },
  created() {
    this.getBankList();
  },
};
</script>

<style lang="scss" scoped>
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
// 顯示卡號樣式
.checkCard_style {
  color: rgb(172, 174, 174);
  & :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
    color: #ededed;
  }
  --el-checkbox-checked-bg-color: #faa30d;
  --el-checkbox-checked-input-border-color: #faa30d;
}
.el-button + .el-button {
  margin-left: 0px;
}
// 新增資訊樣式
.addInfo_style {
  width: 100%;
  --el-input-focus-border-color: #faa30d;
  padding: 10px 200px;
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
// 銀行名稱樣式
.bankName_style {
  width: 100%;
  --el-input-focus-border-color: #faa30d;
  padding: 10px 200px;
  border: none;

  & :deep(.el-input__inner) {
    padding: 25px 0 25px 0px;
    // border-radius: 50px;
  }
  & :deep(.el-input__wrapper) {
    // border-top-right-radius: 50px;
    // border-bottom-right-radius: 50px;
    padding-left: 10px;
  }
  & :deep(.el-input-group__prepend) {
    border-top-left-radius: 50px;
    border-bottom-left-radius: 50px;
  }
  & :deep(.el-input-group__append) {
    border-top-right-radius: 50px;
    border-bottom-right-radius: 50px;
    // & .el-input-group__append .el-select .el-input .el-input__wrapper {
    //   border-top-right-radius: 50px !important;
    //   border-bottom-right-radius: 50px !important;
    // }
  }
  & :deep(.el-select .el-input.is-focus .el-input__wrapper) {
    box-shadow: none;
  }
}
.chooseBank_style {
  & :deep(.el-input__wrapper) {
    border-top-right-radius: 25px;
    border-bottom-right-radius: 25px;
  }
}
.bankCard_style {
  // position: relative;
  cursor: pointer;
  //   background: linear-gradient(to bottom right, #7c8086 10%, #dededf 100%);
  box-shadow: 0 0 0 2px rgba(220, 219, 219, 0.3);
  background: url('../assets/bank/Card2.png') no-repeat;
  background-size: 100%;
  height: 100%;
  border-radius: 33px;
  width: 400px;

  //   width: 65vh;
  //   height: 65vh / 1.5;
  & .card-title {
    border-bottom: 2px dashed #fff;
  }
  & .card-body {
    padding: 15px 20px 20px;
  }
  & .card-text {
    font-size: 14px;
    font-weight: bold;
    color: #9c9eb6;
  }
}
// 卡片選取添加樣式
.active {
  box-shadow: 2px -2px 23px 4px rgba(171, 47, 47, 0.75);
  -webkit-box-shadow: 2px -2px 23px 4px rgba(171, 47, 47, 0.75);
  -moz-box-shadow: 2px -2px 23px 4px rgba(171, 47, 47, 0.75);
}
// 新增卡片保存樣式
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
.addModel_style {
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
