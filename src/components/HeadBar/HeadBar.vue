<template>
  <header class="navbar">
    <div class="l-content"></div>
    <div class="r-content">
      <div class="d-flex align-items-center">
        <div class="me-2"><el-color-picker v-model="color" show-alpha /></div>
        <div class="moon_style d-flex align-items-center">
          <!-- <i class="fa-solid fa-moon fs-4 ms-3"></i
          > -->
          <el-switch class="dark_switch" :class="[isDark === true ? 'dark_switch' : 'white_switch']" v-model="isDark" style="--el-switch-on-color: #f2f2f2; --el-switch-off-color: #2c2c2c" @change="toggleMode(isDark)" />
        </div>
        <el-dropdown class="ms-3" size="small">
          <span class="el-dropdown-link">
            <el-icon class="el-icon--right">
              <i class="fa-solid fa-bars fs-2"></i>
              <arrow-down class="arrow"></arrow-down>
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="changePwd = true">修改密碼</el-dropdown-item>
              <el-dropdown-item @click="logout">登出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </header>
  <!-- 修改登入密碼彈窗 -->
  <el-dialog class="changePwdModel_style" v-model="changePwd" title="修改密碼" width="50%" center>
    <el-input class="addInfo_style mt-3" v-model="changePwd_Form.oldPassword" placeholder="舊密碼" type="password"> <template #prepend>舊密碼</template> </el-input>

    <el-input class="addInfo_style mt-3" v-model="changePwd_Form.newPassword" placeholder="新密碼" type="password"> <template #prepend>新密碼</template> </el-input>

    <el-input class="addInfo_style mt-3" v-model="changePassword_sec" placeholder="確認密碼" type="password"> <template #prepend>確認密碼</template> </el-input>

    <el-input class="addInfo_style mt-3" v-model="changePwd_Form.googleVerifyCode" placeholder="Google驗證碼"> <template #prepend>Google驗證碼</template> </el-input>

    <div class="d-flex justify-content-center">
      <el-button color="#faa30d" plain class="cancel_btn p-4 mt-4 fw-bold fs-5 align-self-center" size="default" @click="cancelBill()">取消</el-button>
      <el-button color="#faa30d" class="confirm_btn p-4 mt-4 fw-bold fs-5 align-self-center" size="default" @click="conFirmBill()">確定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import _ from 'lodash';
import { ElMessage } from 'element-plus';

export default {
  data() {
    return {
      // dark mode
      isDark: true,
      color: 'rgba(19, 206, 102, 0.8)',
      // 修改密碼彈窗
      changePwd: false,
      // 修改密碼表單
      changePwd_Form: {
        googleVerifyCode: '',
        oldPassword: '',
        newPassword: '',
      },
      // 再次確認密碼
      changePassword_sec: '',
      errorMsg: {
        googleVerifyCode: '',
      },
    };
  },
  methods: {
    clickExpand() {
      if (this.isExpand === true) {
        this.isExpand = false;
      } else {
        this.isExpand = true;
      }
    },
    // 切換Dark模式
    toggleMode(isDark) {
      console.log(isDark);
      if (this.isDark === false) {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        document.getElementsByTagName('body')[0].className = 'lightBg';
      } else if (this.isDark === true) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        document.getElementsByTagName('body')[0].className = 'darkBg';
      }
    },
    logout() {
      this.$http.get('/open/logout/').then((res) => {
        if (res.data.code === 200) {
          this.$router.push('/login');
          ElMessage({ showClose: true, message: '已登出!', type: 'success' });
        } else {
          this.$swal.fire('登出失敗!', `${res.data.msg}`, 'error');
        }
      });
    },
    // 確認提交
    conFirmBill() {
      this.$http.post('/api/updateMyPassword', this.changePwd_Form).then((res) => {
        console.log(res.data.code);
        console.log(res.data.msg);
        const addMsg = res.data.msg;
        if (this.changePwd_Form.newPassword !== this.changePassword_sec) {
          ElMessage({ showClose: true, message: '二次密碼不一致', type: 'warning' });
        }
        if (res.data.code === 200) {
          this.changePwd = false;
          this.$swal.fire('密碼更改成功!', `${res.data.msg}`, 'success');
          this.changePwd_Form.oldPassword = '';
          this.changePwd_Form.newPassword = '';
        } else if (res.data.code === 422) {
          this.errorMsg.googleVerifyCode = _.findKey(addMsg, ['param', 'googleVerifyCode']);
          console.log(this.errorMsg.googleVerifyCode);
          if (this.errorMsg.googleVerifyCode !== undefined) {
            ElMessage({ showClose: true, message: `${res.data.msg.googleVerifyCode.msg}`, type: 'error' });
          }
        } else {
          ElMessage({ showClose: true, message: `${res.data.msg}`, type: 'error' });
        }
      });
    },
    // 取消提交
    cancelBill() {
      this.changePwd = false;
    },
  },
  created() {
    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
    console.log(currentTheme);
    if (currentTheme) {
      document.documentElement.setAttribute('data-theme', currentTheme);

      if (currentTheme === 'dark') {
        this.isDark = true;
        // toggleSwitch.checked = true;
      } else {
        this.isDark = false;
      }
    }
  },
  mounted() {
    document.getElementsByTagName('body')[0].className = 'darkBg';
  },
};
</script>

<style lang="scss" scoped>
.el-button {
  padding: 5px 5px;
}
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  background: rgb(0 0 0 / 20%);
  //   margin-left: 30px;
}
.arrow {
  font-size: 20px;
  color: white;
}

.l-content,
.r-content {
  display: flex;
  align-items: center;
}
.el-dropdown-link {
  margin-right: 30px;
}
.el-icon--right i {
  color: var(--font-color);
}
.moon_style {
  :deep(.el-switch__core .el-switch__action) {
    background-image: url('../../assets/Logo/icons8-moon-and-stars-30.png') !important;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }
}
// 新增資訊樣式
.addInfo_style {
  width: 90%;
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
</style>

<style lang="scss">
.changePwdModel_style {
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
