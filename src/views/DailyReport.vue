<template>
  <div class="row">
    <!-- 基本訊息 -->
    <div class="col-12">
      <div class="card_outStyle radius-10 p-3 pb-4">
        <!-- 標題 -->
        <div class="d-flex align-items-center mx-4 mb-4">
          <h4 class="text-white d-flex flex-start my-4 me-2">對帳日報</h4>
          <h4 class="my-4 me-2 text-light2"># {{ this.merchantID }}</h4>
          <h4 class="my-4 me-5 text-light2">- {{ this.merchantName }}</h4>
          <div class="block date_Style">
            <!-- <span class="demonstration text-white">Month</span> -->
            <el-date-picker v-model="timeValue" type="date" placeholder="Pick a month" @change="getDate()" />
          </div>
        </div>
        <div class="itemList_outStyle">
          <div class="now_level mb-3">
            <span>代付</span>
          </div>
          <!-- 內容1 -->
          <div class="d-flex mx-4">
            <!-- <div class="d-flex itemList_style justify-content-between flex-fill px-3 me-3">
            <span class="text-white">內充增加金額</span>
            <span> {{ this.icAddAmount }}</span>
          </div> -->
            <div class="d-flex itemList_style justify-content-between flex-fill px-3 me-3">
              <span class="text-white">代付申請筆數</span>
              <span>{{ this.daiFuOrders || 0 }}</span>
            </div>
            <div class="d-flex itemList_style justify-content-between flex-fill px-3 me-3">
              <span class="text-white">代付申請金額</span>
              <span>{{ this.daiFuAmount }}</span>
            </div>
            <div class="d-flex itemList_style justify-content-between flex-fill px-3 me-3">
              <span class="text-white">代付成功筆數</span>
              <span>{{ this.daiFuSuccessOrders || 0 }}</span>
            </div>
            <!-- <div class="d-flex itemList_style justify-content-between flex-fill px-3">
            <span class="text-white">下發申請筆數</span>
            <span>{{ this.xiaFaOrders || 0 }}</span>
          </div> -->
          </div>
          <!-- 內容2 -->
          <div class="d-flex mx-4">
            <!-- <div class="d-flex itemList_style justify-content-between flex-fill px-3 me-3">
            <span class="text-white">內充減少金額</span>
            <span>{{ this.icSubAmount }}</span>
          </div> -->
            <div class="d-flex itemList_style justify-content-between flex-fill px-3 me-3">
              <span class="text-white">代付成功金額</span>
              <span>{{ this.daiFuSuccessAmount }}</span>
            </div>
            <div class="d-flex itemList_style justify-content-between flex-fill px-3 me-3">
              <span class="text-white">代付撤銷筆數</span>
              <span>{{ this.daiFuFailOrders || 0 }}</span>
            </div>
            <div class="d-flex itemList_style justify-content-between flex-fill px-3 me-3">
              <span class="text-white">代付撤銷金額</span>
              <span>{{ this.daiFuFailAmount }}</span>
            </div>
            <!-- <div class="d-flex itemList_style justify-content-between flex-fill px-3">
            <span class="text-white">下發申請金額</span>
            <span>{{ this.xiaFaAmount }}</span>
          </div> -->
          </div>
          <!-- 內容3 -->
          <div class="d-flex mx-4">
            <!-- <div class="d-flex itemList_style justify-content-between flex-fill px-3 me-3">
            <span class="text-white">內充總手續費</span>
            <span>{{ this.icFee }}</span>
          </div>
          <div class="d-flex itemList_style justify-content-between flex-fill px-3">
            <span class="text-white">下發成功筆數</span>
            <span>{{ this.xiaFaSuccessOrders || 0 }}</span>
          </div> -->
            <div class="d-flex itemList_style justify-content-between flex-fill px-3 me-3 mb-0">
              <span class="text-white">代付總手續費</span>
              <span>{{ this.daiFuSuccessFee }}</span>
            </div>
          </div>
        </div>
        <!-- 內容4 -->
        <div class="d-flex mx-4">
          <div class="d-flex itemList_style justify-content-between flex-fill px-3 me-3">
            <span class="text-white">商戶初始餘額</span>
            <span>{{ this.originBalance }}</span>
          </div>
          <div class="d-flex itemList_style justify-content-between flex-fill px-3">
            <span class="text-white">下發成功金額</span>
            <span>{{ this.xiaFaSuccessAmount }}</span>
          </div>
        </div>
        <!-- 內容5 -->
        <div class="d-flex mx-4">
          <div class="d-flex itemList_style justify-content-between flex-fill px-3 me-3">
            <span class="text-white">商戶結束餘額</span>
            <span>{{ this.endBalance }}</span>
          </div>
          <div class="d-flex itemList_style justify-content-between flex-fill px-3">
            <span class="text-white">下發撤銷筆數</span>
            <span>{{ this.xiaFaFailOrders || 0 }}</span>
          </div>
        </div>
        <!-- 內容6 -->
        <div class="d-flex mx-4">
          <div class="d-flex itemList_style justify-content-between flex-fill px-3 me-3">
            <span class="text-white">代收成功筆數</span>
            <span>{{ this.successItems || 0 }}</span>
          </div>
          <div class="d-flex itemList_style justify-content-between flex-fill px-3">
            <span class="text-white">下發撤銷金額</span>
            <span>{{ this.xiaFaFailAmount }}</span>
          </div>
        </div>
        <!-- 內容7 -->
        <div class="d-flex mx-4">
          <div class="d-flex itemList_style justify-content-between flex-fill px-3 me-3">
            <span class="text-white">代收成功金額</span>
            <span>{{ this.successAmount }}</span>
          </div>
          <div class="d-flex itemList_style justify-content-between flex-fill px-3">
            <span class="text-white">下發總手續費</span>
            <span>{{ this.xiaFaSuccessFee }}</span>
          </div>
        </div>
        <!-- 內容8 -->
        <div class="d-flex justify-content-left mx-4">
          <div class="d-flex lastOne itemList_style justify-content-between px-3">
            <span class="text-white">代收總手續費</span>
            <span>{{ this.orderFee }}</span>
          </div>
        </div>
        <!-- 底部OS -->
        <div class="d-flex mx-4 mt-5">
          <span class="fs-6 text-deep-danger fw-bold me-2">※</span>
          <span class="fs-6 text-light2">Payments On Behalf Of (POBO) AND Collections On Behalf Of (COBO)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash';
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
      // 當前選擇時間
      timeValue: '',
      //   商戶ID
      merchantID: '',
      // 商戶Name
      merchantName: '',
      //   post的資料
      postDate: {
        date: '',
      },
      icAddAmount: 0, // 內充增加金額
      icSubAmount: 0, // 內充減少金額
      icFee: 0, // 內充手續費
      originBalance: 0, // 商戶初始餘額
      endBalance: 0, // 商戶結束餘額
      successItems: 0, // 代收成功筆數
      successAmount: 0, // 代收成功金額
      orderFee: 0, // 代收手續費

      daiFuOrders: 0, // 代付申請筆數
      daiFuAmount: 0, // 代付申請金額
      daiFuSuccessOrders: 0, // 代付成功筆數
      daiFuSuccessAmount: 0, // 代付成功金額
      daiFuFailOrders: 0, // 代付撤銷筆數
      daiFuFailAmount: 0, // 代付撤銷金額
      daiFuSuccessFee: 0, // 代付總手續費

      xiaFaOrders: 0, // 下發申請筆數
      xiaFaAmount: 0, // 下發申請金額
      xiaFaSuccessOrders: 0, // 下發成功筆數
      xiaFaSuccessAmount: 0, // 下發成功金額
      xiaFaFailOrders: 0, // 下發撤銷筆數
      xiaFaFailAmount: 0, // 下發撤銷金額
      xiaFaSuccessFee: 0, // 下發總手續費
    };
  },
  methods: {
    getDate() {
      console.log(this.timeValue);
      this.postDate.date = moment(this.timeValue).utc().format();
      console.log(this.postDate.date);
      this.$http.post('/api/duiZhangDayReport', this.postDate).then((res) => {
        console.log(res.data.data);
        this.merchantID = res.data.data[0].id;
        this.merchantName = res.data.data[0].name;
        // _.mapKeys(res.data.data, (value, key) => key === null);
        if (res.data.data[0].firstBalance === null && res.data.data[0].lastBalance === null) {
          this.originBalance = 0;
          this.endBalance = 0;
        } else {
          this.originBalance = res.data.data[0].firstBalance.balance.toString().replace(comma, ',');
          console.log(this.originBalance);
          this.endBalance = res.data.data[0].lastBalance.balance.toString().replace(comma, ',');
          console.log(this.endBalance);
        }
        if (res.data.data[0].icAddAmount === null) {
          this.icAddAmount = 0;
        } else {
          this.icAddAmount = res.data.data[0].icAddAmount.toString().replace(comma, ',');
        }
        if (res.data.data[0].icSubAmount === null) {
          this.icSubAmount = 0;
        } else {
          this.icSubAmount = res.data.data[0].icSubAmount.toString().replace(comma, ',');
        }
        if (res.data.data[0].icFee === null) {
          this.icFee = 0;
        } else {
          this.icFee = res.data.data[0].icFee.toString().replace(comma, ',');
        }
        if (res.data.data[0].successAmount === null) {
          this.successAmount = 0;
        } else {
          this.successAmount = res.data.data[0].successAmount.toString().replace(comma, ',');
        }
        if (res.data.data[0].orderFee === null) {
          this.orderFee = 0;
        } else {
          this.orderFee = res.data.data[0].orderFee.toString().replace(comma, ',');
        }
        if (res.data.data[0].daiFuAmount === null) {
          this.daiFuAmount = 0;
        } else {
          this.daiFuAmount = res.data.data[0].daiFuAmount.toString().replace(comma, ',');
        }
        if (res.data.data[0].daiFuSuccessAmount === null) {
          this.daiFuSuccessAmount = 0;
        } else {
          this.daiFuSuccessAmount = res.data.data[0].daiFuSuccessAmount.toString().replace(comma, ',');
        }
        if (res.data.data[0].daiFuFailAmount === null) {
          this.daiFuFailAmount = 0;
        } else {
          this.daiFuFailAmount = res.data.data[0].daiFuFailAmount.toString().replace(comma, ',');
        }
        if (res.data.data[0].daiFuSuccessFee === null) {
          this.daiFuSuccessFee = 0;
        } else {
          this.daiFuSuccessFee = res.data.data[0].daiFuSuccessFee.toString().replace(comma, ',');
        }
        if (res.data.data[0].xiaFaAmount === null) {
          this.xiaFaAmount = 0;
        } else {
          this.xiaFaAmount = res.data.data[0].xiaFaAmount.toString().replace(comma, ',');
        }
        if (res.data.data[0].xiaFaSuccessAmount === null) {
          this.xiaFaSuccessAmount = 0;
        } else {
          this.xiaFaSuccessAmount = res.data.data[0].xiaFaSuccessAmount.toString().replace(comma, ',');
        }
        if (res.data.data[0].xiaFaFailAmount === null) {
          this.xiaFaFailAmount = 0;
        } else {
          this.xiaFaFailAmount = res.data.data[0].xiaFaFailAmount.toString().replace(comma, ',');
        }
        if (res.data.data[0].xiaFaSuccessFee === null) {
          this.xiaFaSuccessFee = 0;
        } else {
          this.xiaFaSuccessFee = res.data.data[0].xiaFaSuccessFee.toString().replace(comma, ',');
        }
        // this.icAddAmount = res.data.data[0].icAddAmount;
        // this.icSubAmount = res.data.data[0].icSubAmount;
        // this.icFee = res.data.data[0].icFee;
        this.successItems = res.data.data[0].successOrders;
        // this.successAmount = res.data.data[0].successAmount;
        // this.orderFee = res.data.data[0].orderFee;

        // 代付
        this.daiFuOrders = res.data.data[0].daiFuOrders;
        // this.daiFuAmount = res.data.data[0].daiFuAmount;
        this.daiFuSuccessOrders = res.data.data[0].daiFuSuccessOrders;
        // this.daiFuSuccessAmount = res.data.data[0].daiFuSuccessAmount;
        this.daiFuFailOrders = res.data.data[0].daiFuFailOrders;
        // this.daiFuFailAmount = res.data.data[0].daiFuFailAmount;
        // this.daiFuSuccessFee = res.data.data[0].daiFuSuccessFee;

        // 下發
        this.xiaFaOrders = res.data.data[0].xiaFaOrders;
        // this.xiaFaAmount = res.data.data[0].xiaFaAmount;
        this.xiaFaSuccessOrders = res.data.data[0].xiaFaSuccessOrders;
        // this.xiaFaSuccessAmount = res.data.data[0].xiaFaSuccessAmount;
        this.xiaFaFailOrders = res.data.data[0].xiaFaFailOrders;
        // this.xiaFaFailAmount = res.data.data[0].xiaFaFailAmount;
        // this.xiaFaSuccessFee = res.data.data[0].xiaFaSuccessFee;
        // this.orderTable = res.data.data;
      });
    },
  },
  created() {
    this.timeValue = nowTime;
    this.getDate();
    // 09/29
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
.date_Style {
  & :deep(.el-input__wrapper) {
    border-radius: 10px;
    background: none;
  }
  & :deep(.el-input__inner) {
    color: #fff;
  }
}
.itemList_outStyle {
  // background: rgb(252, 240, 255);
  // background: linear-gradient(200deg, rgba(252, 240, 255, 1) 0%, rgba(53, 124, 210, 0.597) 100%);
  padding: 0px 0px 20px;
  border-radius: 15px;
  background-color: rgb(0 0 0 / 20%);
  box-shadow: 0 0.3rem 0.8rem rgb(0 0 0 / 12%);
  & .now_level {
    width: 120px;
    text-align: center;
    background: rgb(255, 225, 169);
    color: rgb(53, 53, 53);
    font-weight: bold;
    border-top-left-radius: 20px;
    border-bottom-right-radius: 20px;
    padding: 5px 15px;
    box-shadow: rgba(136, 165, 191, 0.48) 0px 0px 2px 0px, rgba(255, 255, 255, 0.419) 0px 2px 10px 0px;
  }
}
.itemList_style {
  // padding: 5px 0;
  border-radius: 10px;
  // background: rgb(252, 240, 255);
  // background: linear-gradient(200deg, rgba(252, 240, 255, 1) 0%, rgba(53, 124, 210, 0.597) 100%);
  // box-shadow: 0 0.3rem 0.8rem rgb(0 0 0 / 12%);
  margin-bottom: 1.5rem;
  border: 0 solid transparent;
  // width: 20%;
  //   金額顏色
  & span {
    color: #e51616;
  }
}
.lastOne {
  width: 32.7%;
}
</style>
