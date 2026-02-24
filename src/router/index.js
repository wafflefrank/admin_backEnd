import { createRouter, createWebHashHistory } from 'vue-router';
import { ElMessage } from 'element-plus';
// import axios from 'axios';
import mockHttp from '../mockApi';
import HomeView from '../views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'Waffle管理後台',
    component: HomeView,
    redirect: { name: '我的帳號' },
    meta: {
      requireAuth: false, // 判斷是否需要驗證會員登入
    },
    children: [
      {
        path: 'account',
        name: '我的帳號',
        component: () => import('../views/My_Account.vue'),
        meta: { title: '我的帳號' },
      },
      {
        path: 'basicinfo',
        name: '基本訊息',
        component: () => import('../views/BasicInfo.vue'),
        meta: { title: '基本訊息' },
      },
      {
        path: 'bankList',
        name: '銀行卡訊息',
        component: () => import('../views/BankList.vue'),
        meta: { title: '銀行卡訊息' },
      },
      {
        path: 'dailyReport',
        name: '對帳日報',
        component: () => import('../views/DailyReport.vue'),
        meta: { title: '對帳日報' },
      },
      {
        path: 'orderHistory',
        name: '訂單紀錄',
        component: () => import('../views/OrderHistory.vue'),
        meta: { title: '訂單紀錄' },
      },
      {
        path: 'orderFlow',
        name: '訂單流水',
        component: () => import('../views/OrderFlow.vue'),
        meta: { title: '訂單流水' },
      },
      {
        path: 'billHistory',
        name: '結算紀錄',
        component: () => import('../views/BillHistory.vue'),
        meta: { title: '結算紀錄' },
      },
    ],
  },
  {
    path: '/livechart',
    name: 'livechart',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../components/LiveChart/LiveChart.vue'),
  },
  // 登入
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/Login.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  // 原本透過 axios 取得站點資訊，已改為使用本地 mockHttp
  // axios.get('/open/siteInfo').then((res) => {
  //   console.log(res.data.data.name);
  //   document.title = `${res.data.data.name}後臺管理系統`;
  // });
  mockHttp.get('/open/siteInfo').then((res) => {
    console.log(res.data.data.name);
    document.title = `${res.data.data.name}後臺管理系統`;
  });
  if (to.matched.some((m) => m.meta.requireAuth)) {
    // 原本用 axios 檢查登入狀態，現在一樣走 mockHttp 但流程保持不變
    mockHttp.get('/api/myInfo').then((res) => {
      console.log('抓到後台登入狀態了 (mock)', res.data);
      if (res.data.code === 200) {
        console.log('後臺成功登入 (mock)', res.data);
        next();
      } else {
        ElMessage({ showClose: true, message: '已登出,請先登入!', type: 'warning' });
        next({ path: '/login' });
      }
    });
    // console.log(document.cookie);
    // console.log(localStorage.getItem('user'));
  } else {
    next();
  }
});

export default router;
