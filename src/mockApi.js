import moment from 'moment';

// 共用的小工具：包裝成 axios 風格的回傳物件
function wrap(data) {
  return { data };
}

// GET 類別的假資料
function handleGet(url) {
  // 去掉查詢參數，方便比對
  const [path] = url.split('?');

  switch (path) {
    case '/open/siteInfo':
      return wrap({
        code: 200,
        data: {
          name: '測試商戶後台',
          logo: 'https://via.placeholder.com/200x200?text=TEST+LOGO',
        },
      });

    case '/api/myInfo': {
      const now = moment().utc().format();
      return wrap({
        code: 200,
        data: {
          id: 1,
          name: '測試商戶',
          sign: 'TEST_SIGN_123456',
          phone: '0912345678',
          createdAt: now,
          billableAmount: 123456.78,
          lockedAmount: 8888.88,
          xfRate: 0.01,
          dfRate: 0.02,
          isDfActive: 1,
          bizInfo: {
            isLoginGoogleVerify: false,
          },
          googleAuthLabel: null,
        },
      });
    }

    case '/api/getMyBanks':
      return wrap({
        code: 200,
        data: [
          {
            id: 1,
            bankName: 'TEST BANK',
            bankAccount: '1234567890123',
            bankOwner: '測試戶名',
            bankType: '1',
            merchantId: 1,
          },
          {
            id: 2,
            bankName: 'MOCK BANK',
            bankAccount: '9876543210000',
            bankOwner: '第二個帳戶',
            bankType: '1',
            merchantId: 1,
          },
        ],
      });

    case '/api/getMyRecentLogins': {
      const now = moment().utc();
      return wrap({
        code: 200,
        data: [
          {
            createdAt: now.clone().subtract(1, 'days').format(),
            ipLocation: 'Taiwan / Taipei',
            ip: '127.0.0.1',
          },
          {
            createdAt: now.clone().subtract(2, 'days').format(),
            ipLocation: 'Taiwan / Kaohsiung',
            ip: '10.0.0.1',
          },
        ],
      });
    }

    case '/api/getMyTunnelInfo':
      return wrap({
        code: 200,
        data: [
          {
            payGateCode: 'VNBANK', rate: 0.01, isActive: 1, billType: 'T0',
          },
          {
            payGateCode: 'VNMOMO', rate: 0.015, isActive: 1, billType: 'T1',
          },
          {
            payGateCode: 'INTER_CHARGE', rate: 0, isActive: 1, billType: 'T0',
          },
        ],
      });

    case '/api/getDayMonthOrderTotal':
      return wrap({
        code: 200,
        data: {
          dayTotalOrderAmount: 8888.88,
          monthTotalOrderAmount: 123456.78,
        },
      });

    case '/api/getGoogleAuthCode': {
      // 基本 QR 資訊（第一次開啟）
      return wrap({
        code: 200,
        data: {
          authQR: 'otpauth://totp/TEST:demo@example.com?secret=TESTSECRET&issuer=TEST',
          googleAuthLabel: null,
        },
      });
    }

    case '/open/logout/':
      return wrap({
        code: 200,
        msg: '已於測試環境登出',
      });

    default:
      // 未定義的 GET，都回傳一個通用成功物件避免程式報錯
      return wrap({
        code: 200,
        msg: `Mock GET: ${url}`,
      });
  }
}

// POST 類別的假資料
function handlePost(url, data) {
  switch (url) {
    case '/open/checkIsGoogleLogin':
      return wrap({
        code: 200,
        data: {
          isGoogleLogin: false,
        },
      });

    case '/open/login':
      return wrap({
        code: 200,
        msg: '測試登入成功',
      });

    case '/api/getOrders': {
      const now = moment().utc().format();
      // expand 用（單筆）
      if (data && data.id) {
        return wrap({
          code: 200,
          data: {
            dataset: {
              id: data.id,
              merchant_order_id: `MOCK_ORDER_${data.id}`,
              costFee: 12.34,
              amount: 5678.9,
              paidAt: now,
              isPaid: 1,
              isGotReceipt: 1,
            },
          },
        });
      }
      // 一般列表用
      return wrap({
        code: 200,
        data: {
          dataset: [
            {
              id: 1001,
              merchantName: '測試商戶 A',
              merchant_order_id: 'MOCK-ORDER-1001',
              payMethodId: 9,
              pgType: 'VNMOMO',
              costFee: 1.23,
              amount: 1000,
              createdAt: now,
              isPaid: 1,
              isGotReceipt: 1,
              merchant_notify_url: 'https://example.com/notify',
              merchant_return_url: 'https://example.com/return',
            },
            {
              id: 1002,
              merchantName: '測試商戶 B',
              merchant_order_id: 'MOCK-ORDER-1002',
              payMethodId: 7,
              pgType: 'VNBANK',
              costFee: 0.5,
              amount: 500,
              createdAt: now,
              isPaid: 0,
              isGotReceipt: 0,
              merchant_notify_url: 'https://example.com/notify2',
              merchant_return_url: 'https://example.com/return2',
            },
          ],
          totalAmount: 1500,
          totalCostFee: 1.73,
          count: 2,
        },
      });
    }

    case '/api/getOrderNotifies': // 不會直接這樣被呼叫，但保留一個兜底
    default:
      break;
  }

  // 動態路由：通知紀錄
  if (url.startsWith('/api/getOrderNotifies/')) {
    const now = moment().utc().format();
    return wrap({
      code: 200,
      data: {
        dataset: [
          {
            isSuccess: 1,
            request: '{"amount":1000}',
            response: '{"status":"OK"}',
            createdAt: now,
          },
          {
            isSuccess: 0,
            request: '{"amount":2000}',
            response: '{"status":"FAILED"}',
            createdAt: now,
          },
        ],
      },
    });
  }

  // 重新發送通知
  if (url === '/api/resendNotify') {
    return wrap({
      code: 200,
      msg: '已於測試環境補發通知',
    });
  }

  // 商戶資金明細總表（OrderFlow）
  if (url === '/aze_api/api/getMerchantDetail') {
    const baseRow = {
      merchantName: '測試商戶',
      balance: 200000.12,
      createdAt: moment().utc().format(),
    };
    const type = data && data.type ? data.type : 'order';
    let rows = [];
    if (type === 'order') {
      rows = [
        {
          ...baseRow, targetId: 1, amount: 1000, type: 'order',
        },
        {
          ...baseRow, targetId: 2, amount: 2000, type: 'order',
        },
      ];
    } else if (type === 'interCharge') {
      rows = [
        {
          ...baseRow, targetId: 3, amount: 3000, innerAmount: 3000, type: 'interCharge',
        },
      ];
    } else {
      rows = [
        {
          ...baseRow, targetId: 4, amount: 4000, type: 'bill',
        },
      ];
    }
    return wrap({
      code: 200,
      rows: {
        data: rows,
        count: rows.length,
      },
    });
  }

  // 內充詳情
  if (url === '/api/getInterChargeList') {
    const now = moment().utc().format();
    return wrap({
      code: 200,
      data: {
        dataset: {
          id: data && data.id ? data.id : 1,
          fee: 10,
          amount: 3000,
          createdAt: now,
          memo: '測試內充備註',
        },
      },
    });
  }

  // 結算列表 & 展開詳情
  if (url === '/api/getMyBills') {
    const now = moment().utc().format();
    // 展開詳情：limit=1
    if (data && data.limit === 1) {
      return wrap({
        code: 200,
        data: {
          dataset: {
            id: data.id || 1,
            bankOwner: '結算收款人',
            bankName: 'TEST BANK',
            bankSubName: 'TEST BRANCH',
            bankAccount: '1234567890123',
            mainCardBankOwner: '平台出款帳戶',
            mainCardBankName: 'PLATFORM BANK',
            mainCardBankSubName: 'PLATFORM BRANCH',
            mainCardBankAccount: '9999999999',
            isDone: 1,
            bankfee: 5,
            amount: 5000,
            billType: 'T0',
            paidAt: now,
          },
          totalAmount: 5000,
        },
      });
    }

    // 歷史結算列表（BillHistory）
    return wrap({
      code: 200,
      data: {
        dataset: [
          {
            id: 1,
            merchant_bill_id: 'POBO-0001',
            bankOwner: '收款戶名一',
            bankName: 'TEST BANK',
            bankAccount: '1234567890123',
            mainCardBankOwner: '平台出款帳戶',
            mainCardBankName: 'PLATFORM BANK',
            mainCardBankAccount: '9999999999',
            isDone: 1,
            isDf: 1,
            isRefund: 0,
            amount: 5000,
            bankFee: 5,
            createdAt: now,
            photos: 'https://via.placeholder.com/100x100?text=Bill',
          },
        ],
        count: 1,
      },
    });
  }

  // 修改支付密碼
  if (url === '/api/updateMyPaidPassword') {
    return wrap({
      code: 200,
      msg: '測試環境：支付密碼已更新',
    });
  }

  // 建立結算申請
  if (url === '/api/bill') {
    return wrap({
      code: 200,
      msg: '測試環境：結算申請成功',
    });
  }

  // 日、月報（My_Account、折線圖、今日報表）
  if (url === '/api/getMyOrderDailyReport') {
    const startAt = data && data.startAt ? moment(data.startAt) : moment().utc();
    const rows = [
      {
        date: startAt.clone().subtract(2, 'days').format(),
        totalAmount: 1000,
        orderCount: 5,
      },
      {
        date: startAt.clone().subtract(1, 'days').format(),
        totalAmount: 2000,
        orderCount: 8,
      },
      {
        date: startAt.clone().format(),
        totalAmount: 1500,
        orderCount: 6,
      },
    ];
    return wrap({
      code: 200,
      data: rows,
    });
  }

  // 對帳日報
  if (url === '/api/duiZhangDayReport') {
    return wrap({
      code: 200,
      data: [
        {
          id: 1,
          name: '測試商戶',
          firstBalance: { balance: 100000 },
          lastBalance: { balance: 95000 },
          icAddAmount: 5000,
          icSubAmount: 1000,
          icFee: 50,
          successItems: 10,
          successAmount: 20000,
          orderFee: 200,
          daiFuOrders: 3,
          daiFuAmount: 6000,
          daiFuSuccessOrders: 2,
          daiFuSuccessAmount: 4000,
          daiFuFailOrders: 1,
          daiFuFailAmount: 2000,
          daiFuSuccessFee: 40,
          xiaFaOrders: 4,
          xiaFaAmount: 8000,
          xiaFaSuccessOrders: 3,
          xiaFaSuccessAmount: 6000,
          xiaFaFailOrders: 1,
          xiaFaFailAmount: 2000,
          xiaFaSuccessFee: 60,
        },
      ],
    });
  }

  // 新增銀行卡
  if (url === '/api/addMyBank') {
    return wrap({
      code: 200,
      msg: '測試環境：新增銀行卡成功',
    });
  }

  // 刪除銀行卡
  if (url === '/api/deleteMyBank') {
    return wrap({
      code: 200,
      msg: '測試環境：刪除銀行卡成功',
    });
  }

  // Google 驗證碼（帶 authCode）
  if (url.startsWith('/api/getGoogleAuthCode')) {
    return wrap({
      code: 200,
      data: {
        googleAuthLabel: null,
        authQR: 'otpauth://totp/TEST:demo@example.com?secret=TESTSECRET&issuer=TEST',
      },
    });
  }

  // 切換是否開啟 Google 登入驗證
  if (url === '/api/updateGoogleVerifyLogin') {
    return wrap({
      code: 200,
      msg: '測試環境：登入驗證狀態已更新',
    });
  }

  // 修改登入密碼
  if (url === '/api/updateMyPassword') {
    return wrap({
      code: 200,
      msg: '測試環境：登入密碼已更新',
    });
  }

  // 其他未定義的 POST，一律回傳成功
  return wrap({
    code: 200,
    msg: `Mock POST: ${url}`,
  });
}

// 對外提供的 mock http（模擬 axios）
export default {
  get(url, config) {
    return Promise.resolve(handleGet(url, config));
  },
  post(url, data, config) {
    return Promise.resolve(handlePost(url, data, config));
  },
};
