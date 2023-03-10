<template>
  <header class="main-head" :class="[isExpand === false ? 'main_expand' : 'main-head']">
    <img v-if="isExpand === true" class="home_logo" :src="logoSrc" alt="#" />
    <img v-if="isExpand === false" class="home_logo_close" :src="logoSrc" alt="#" />
    <hr class="mt-0 horizontal dark bg-white" style="height: 2px" />
    <nav class="head-nav">
      <ul class="menu">
        <li :class="active === 1 ? 'isActive' : ''" @click="clickScript(1)" @keydown="clickScript(1)">
          <a href="#" @click.prevent="goMyaccount()">
            <i class="fa-solid fa-house-user fs-2 ms-3"></i><span class="list_name">{{ this.$t('myAccount') }}</span></a
          >
        </li>
        <li :class="active === 2 ? 'isActive' : ''" @click="clickScript(2)" @keydown="clickScript(2)">
          <a href="#" @click.prevent="goBasic()">
            <i class="fa-solid fa-user fs-2 ms-3"></i><span class="list_name">{{ this.$t('bassicInfo') }}</span></a
          >
        </li>
        <li :class="active === 3 ? 'isActive' : ''" @click="clickScript(3)" @keydown="clickScript(3)">
          <a href="#" @click.prevent="goBank()">
            <i class="fa-solid fa-money-check-dollar fs-2 ms-3"></i><span class="list_name">{{ this.$t('bankList') }}</span></a
          >
        </li>
        <li :class="active === 4 ? 'isActive' : ''" @click="clickScript(4)" @keydown="clickScript(4)">
          <a href="#" @click.prevent="goDailyReport()">
            <i class="fa-solid fa-list-check fs-2 ms-3"></i><span class="list_name">{{ this.$t('dailyReport') }}</span></a
          >
        </li>
        <li :class="active === 5 ? 'isActive' : ''" @click="clickScript(5)" @keydown="clickScript(5)">
          <a href="#" @click.prevent="goOrderhistory()">
            <i class="fa-solid fa-list-ol fs-2 ms-3"></i><span class="list_name">{{ this.$t('orderHistory') }}</span></a
          >
        </li>
        <li :class="active === 6 ? 'isActive' : ''" @click="clickScript(6)" @keydown="clickScript(6)">
          <a href="#" @click.prevent="goOrderFlow()">
            <i class="fa-solid fa-list-ul fs-2 ms-3"></i><span class="list_name">{{ this.$t('orderFlow') }}</span></a
          >
        </li>
        <li :class="active === 7 ? 'isActive' : ''" @click="clickScript(7)" @keydown="clickScript(7)">
          <a href="#" @click.prevent="goBillHistory()">
            <i class="fa-solid fa-sack-dollar fs-2 ms-3"></i><span class="list_name">{{ this.$t('billHistory') }}</span></a
          >
        </li>
        <li :class="active === 8 ? 'isActive' : ''" @click="clickScript(8)" @keydown="clickScript(8)">
          <a href="#" @click.prevent="openGoogle_QR()">
            <i class="fa-solid fa-unlock fs-2 ms-3"></i><span class="list_name">{{ this.$t('googleAuthenticator') }}</span></a
          >
        </li>
      </ul>
    </nav>
    <span v-if="isExpand === true" class="expand_btn" @click="clickExpand()" @keydown="clickExpand()"><i class="fa-solid fa-angles-left"></i></span>
    <span v-if="isExpand === false" class="expand_btn" @click="clickExpand()" @keydown="clickExpand()"><i class="fa-solid fa-angles-right"></i></span>
  </header>
  <el-dialog class="QRModel_style" v-model="QRDialogVisible" :title="this.$t('googleAuthenticator')" width="50%" center>
    <div class="d-flex justify-content-center align-items-center mb-3">
      <span class="text-white">{{ this.$t('LoginVerification') }}</span>
      <el-switch class="google_switch" v-model="isGoogleOn.isLoginGoogleVerify" style="--el-switch-on-color: #faa30d; --el-switch-off-color: #2c2c2c" @change="toggleMode(isGoogleOn.isLoginGoogleVerify)" />
    </div>
    <div class="d-flex justify-content-center align-items-center">
      <qrcode-vue v-if="googleAuthLabel === null" :value="image_QR" :size="size" level="H" />
    </div>
    <div class="d-flex flex-column" v-if="googleAuthLabel !== null">
      <el-input class="googleCode_style" v-model="google_code" :placeholder="this.$t('googleCode')"> <template #prepend>{{ this.$t('googleAuthenticator') }}</template> </el-input>
      <el-button color="#faa30d" class="getCode_btn mt-2 px-1 fw-bold" size="default" @click="getCode()">{{ this.$t('getCode') }}</el-button>
    </div>
    <div class="d-flex mx-4 mt-5">
      <span class="fs-6 text-deep-danger fw-bold me-2">※</span>
      <span class="fs-6 text-white">{{ this.$t('googleMemo') }}</span>
    </div>
  </el-dialog>
</template>

<script>
import { defineComponent } from 'vue';
import { ElMessage } from 'element-plus';
import QrcodeVue from 'qrcode.vue';
// import { Location, Document, Menu as IconMenu, Setting } from '@element';
export default defineComponent({
  components: {
    QrcodeVue,
  },
  emits: ['changeWidth'],
  setup() {
    const handleOpen = (key, keyPath) => {
      console.log(key, keyPath);
    };
    const handleClose = (key, keyPath) => {
      console.log(key, keyPath);
    };
    return {
      handleOpen,
      handleClose,
    };
  },
  computed: {
    // 获取菜单对象中不包含子级的菜单
    noChildren() {
      return this.asideMenu.filter((item) => !item.children);
    },
    // 获取菜单对象中包含子级的菜单
    hasChildren() {
      return this.asideMenu.filter((item) => item.children);
    },
  },
  data() {
    return {
      // logo樣式
      logoSrc: '',
      // 是否擴展
      isExpand: true,
      // 新增選取後樣式
      active: -1,
      // QR碼彈窗
      QRDialogVisible: false,
      googleAuthLabel: '', // 是否第一次登入
      image_QR: '',
      google_code: '', // 重新獲取驗證碼
      size: 200, // qr碼大小
      isGoogleOn: { isLoginGoogleVerify: '' }, // 驗證登入
      // ConKey: '我是子组件传给父级的内容',
    };
  },
  methods: {
    clickMenu(item) {
      this.$store.commit('selectMenu', item);
    },
    clickExpand() {
      if (this.isExpand === true) {
        this.isExpand = false;
        this.$emit('changeWidth', this.isExpand);
      } else {
        this.isExpand = true;
        this.$emit('changeWidth', this.isExpand);
      }
    },
    clickScript(index) {
      this.active = index;
    },
    goBasic() {
      this.$router.push('/basicinfo');
    },
    goMyaccount() {
      this.$router.push('/account');
    },
    goBank() {
      this.$router.push('/bankList');
    },
    goDailyReport() {
      this.$router.push('/dailyReport');
    },
    goOrderhistory() {
      this.$router.push('/orderHistory');
    },
    goOrderFlow() {
      this.$router.push('/orderFlow');
    },
    goBillHistory() {
      this.$router.push('/billHistory');
    },
    // googe驗證碼彈窗
    openGoogle_QR() {
      this.QRDialogVisible = true;
      if (this.googleAuthLabel === null) {
        this.$http.get('/api/getGoogleAuthCode').then((res) => {
          console.log(res.data.data.authQR);
          this.image_QR = res.data.data.authQR;
        });
      }
      console.log(this.isGoogleOn.isLoginGoogleVerify);
    },
    // getCode
    getCode() {
      this.$http.get(`/api/getGoogleAuthCode?authCode=${this.google_code}`).then((res) => {
        if (res.data.code === 200) {
          console.log(res.data.data.googleAuthLabel);
          this.googleAuthLabel = null;
          this.image_QR = res.data.data.authQR;
        }
        if (res.data.code === 500) {
          ElMessage({ showClose: true, message: '驗證失敗', type: 'error' });
        }
      });
    },
    // 獲取是否第一次登入帳號
    getUser_info() {
      this.$http.get('/api/myInfo').then((res) => {
        console.log(res.data.data.bizInfo.isLoginGoogleVerify);
        this.isGoogleOn.isLoginGoogleVerify = res.data.data.bizInfo.isLoginGoogleVerify;
        console.log(res.data.data.googleAuthLabel);
        this.googleAuthLabel = res.data.data.googleAuthLabel;
      });
    },
    // 切換Dark模式
    toggleMode() {
      console.log(this.isGoogleOn.isLoginGoogleVerify);
      if (this.isGoogleOn.isLoginGoogleVerify === true) {
        ElMessage({ showClose: true, message: '開啟登入驗證', type: 'success' });
      } else if (this.isGoogleOn.isLoginGoogleVerify === false) {
        ElMessage({ showClose: true, message: '關閉驗證登入', type: 'warning' });
      }
      this.$http.post('/api/updateGoogleVerifyLogin', this.isGoogleOn).then((res) => {
        console.log(res.data.code);
      });
    },
    // 獲取LOGO
    getSiteInfo() {
      this.$http.get('/open/siteInfo').then((res) => {
        console.log(res.data.data);
        this.logoSrc = res.data.data.logo;
      });
    },
  },
  created() {
    this.getSiteInfo();
    this.getUser_info();
  },
});
</script>

<style lang="scss" scoped>
$color-1: #1a1a1a;
$color-2: #fefefe;
$pad: 0.925rem;

.head-nav {
  padding: 10px 20px 60px;
  li {
    position: relative;
    clear: both;
    width: 100%;
    padding: 0;
    transition: background 0.5s ease-out;
    & a {
      display: flex;
      padding: {
        top: 2vh;
        bottom: 2vh;
      }
      list-style: none;
      height: 100%;
      background-color: transparent;
      display: flex;
      align-items: center;
      height: 100%;
      width: 100%;
      border-radius: 6px;
      text-decoration: none;
      transition: var(--tran-03);
    }
    &:hover {
      // background: linear-gradient(90deg, rgba(238, 133, 46, 0.19091386554621848) 0%, rgba(252, 241, 69, 0.05926120448179273) 100%);
      & i::before {
        color: #faa30d;
      }
      a {
        color: #faa30d;
        background-color: var(--text-color);
      }
    }
    // icon寬度
    i {
      // margin: 0 auto;
      position: absolute;
      left: -40px;
      text-align: center;
      width: 100px;
      // margin-right: 50px;
    }
  }
  ul {
    margin: {
      top: $pad * 2;
      right: 0;
      bottom: 0;
      left: 0;
    }
    padding: 0;
    list-style: none;
  }
  a {
    align-items: center;
    width: 100%;
    color: var(--font-color);
    text-decoration: none;
    span {
      position: relative;
      display: block;
      z-index: 0;
      font-family: Roboto;
      // 顯示
      text-indent: -20em;
      white-space: nowrap;
      text-align: left;
      margin-left: 50px;
      transition: text-indent 400ms ease-in-out;
    }
  }
}
// 預設樣式
.main-head {
  position: fixed;
  height: 100%;
  // bottom: 0
  // border-top-right-radius: 45px;
  // border-top-left-radius: 45px;
  // 展開後樣式
  width: 250px;
  // height: 100%;
  z-index: 1;
  background: rgb(0 0 0 / 20%);
  transition: width 400ms; //寬度延伸效果
  box-shadow: 13px 1px 13px -6px rgba(0, 0, 0, 0.75);
  .head-nav {
    ul {
      margin-top: 0;
      margin-bottom: 0;
    }
    // 展開文字動畫(1~8)延遲
    li {
      @for $i from 1 through 8 {
        &:nth-of-type(#{$i}) {
          span {
            transition-delay: 50ms * $i;
          }
        }
      }
    }
    span {
      text-indent: 1em;
    }
  }
}
// 縮小後樣式
.main_expand {
  width: 90px;
  a {
    align-items: center;
    width: 100%;
    color: var(--font-color);
    text-decoration: none;
    // transition: color 400ms;
    span {
      position: relative;
      display: block;
      z-index: 0;
      font-family: Roboto;
      // 顯示
      text-indent: -20em;
      white-space: nowrap;
      text-align: left;
      margin-left: 70px;
      transition: text-indent 400ms ease-in-out;
    }
  }
  //Logo隱藏
  & .home_logo {
    visibility: hidden;
  }
  & .list_name {
    visibility: hidden;
  }
  // 深色模式switch隱藏
  & .dark_switch {
    visibility: hidden;
  }
}
// LOGO樣式
.home_logo {
  border-radius: 10px;
  width: 100px;
  margin: 24px 25px 24px 40px;
  background: black;
  box-shadow: -1px 1px 24px 4px var(--logo-shadow-color);
  -webkit-box-shadow: -1px 1px 24px 4px var(--logo-shadow-color);
  -moz-box-shadow: -1px 1px 24px 4px var(--logo-shadow-color);
}
.home_logo_close {
  border-radius: 10px;
  width: 50px;
  margin: 50px 0;
  // margin-right: 50px;
  background: black;
  box-shadow: -1px 1px 24px 4px var(--logo-shadow-color);
  -webkit-box-shadow: -1px 1px 24px 4px var(--logo-shadow-color);
  -moz-box-shadow: -1px 1px 24px 4px var(--logo-shadow-color);
}
hr.horizontal {
  background-color: transparent;
}
hr.horizontal.dark {
  background-image: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.4), transparent);
}
// 按鈕樣式
.expand_btn {
  position: absolute;
  border: none;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  color: #fff;
  background: #082635;
  box-shadow: 2px 1px 3px 3px rgba(0, 0, 0, 0.3);
  left: 100%;
  top: 8.5rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateX(-50%);
  cursor: pointer;
}
.dark_switch {
  & :deep(.el-switch__action) {
    background: #000 !important;
  }
}
.white_switch {
  & :deep(.el-switch__action) {
    background: #f2f2f2 !important;
  }
}
.isActive {
  & i::before {
    color: #faa30d;
  }
  a {
    color: #faa30d;
    background-color: var(--text-color);
  }
}
// google驗證器樣式
.googleCode_style {
  width: 50%;
  --el-input-focus-border-color: #faa30d;
}
// 獲取驗證碼樣式
.getCode_btn {
  width: 120px;
}
</style>

<style lang="scss">
.QRModel_style {
  background: linear-gradient(270deg, rgb(12, 49, 88) 0%, rgba(64, 121, 139, 0.95) 100%) !important;
  font-size: 20px;
  font-weight: bold;
  & .el-dialog__title {
    font-size: 20px;
    font-weight: bold;
    color: #fff;
  }
}
</style>
