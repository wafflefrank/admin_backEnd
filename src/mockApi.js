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
      const now = moment().utc();
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
              paidAt: now.format(),
              isPaid: 1,
              isGotReceipt: 1,
            },
          },
        });
      }
      // 一般列表用 - 生成豐富的測試數據
      const orders = [
        // 今天的大額訂單
        {
          id: 1001,
          merchantName: '測試商戶 A',
          merchant_order_id: 'MOCK-ORDER-1001',
          payMethodId: 9,
          pgType: 'VNMOMO',
          costFee: 15.50,
          amount: 15500,
          createdAt: now.clone().subtract(2, 'hours').format(),
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
          costFee: 8.20,
          amount: 8200,
          createdAt: now.clone().subtract(5, 'hours').format(),
          isPaid: 1,
          isGotReceipt: 1,
          merchant_notify_url: 'https://example.com/notify2',
          merchant_return_url: 'https://example.com/return2',
        },
        // 昨天的訂單
        {
          id: 1003,
          merchantName: '電商平台 C',
          merchant_order_id: 'MOCK-ORDER-1003',
          payMethodId: 8,
          pgType: 'VNZALO',
          costFee: 12.30,
          amount: 12300,
          createdAt: now.clone().subtract(1, 'days').subtract(3, 'hours').format(),
          isPaid: 1,
          isGotReceipt: 0,
          merchant_notify_url: 'https://example.com/notify3',
          merchant_return_url: 'https://example.com/return3',
        },
        {
          id: 1004,
          merchantName: '遊戲平台 D',
          merchant_order_id: 'MOCK-ORDER-1004',
          payMethodId: 11,
          pgType: 'QRCODE',
          costFee: 5.50,
          amount: 5500,
          createdAt: now.clone().subtract(1, 'days').subtract(8, 'hours').format(),
          isPaid: 1,
          isGotReceipt: 1,
          merchant_notify_url: 'https://example.com/notify4',
          merchant_return_url: 'https://example.com/return4',
        },
        {
          id: 1005,
          merchantName: '線上商城 E',
          merchant_order_id: 'MOCK-ORDER-1005',
          payMethodId: 12,
          pgType: 'VNVIETTEL',
          costFee: 3.20,
          amount: 3200,
          createdAt: now.clone().subtract(1, 'days').subtract(12, 'hours').format(),
          isPaid: 0,
          isGotReceipt: 0,
          merchant_notify_url: 'https://example.com/notify5',
          merchant_return_url: 'https://example.com/return5',
        },
        // 2天前的訂單
        {
          id: 1006,
          merchantName: '金融服務 F',
          merchant_order_id: 'MOCK-ORDER-1006',
          payMethodId: 7,
          pgType: 'TCB',
          costFee: 25.80,
          amount: 25800,
          createdAt: now.clone().subtract(2, 'days').subtract(2, 'hours').format(),
          isPaid: 1,
          isGotReceipt: 1,
          merchant_notify_url: 'https://example.com/notify6',
          merchant_return_url: 'https://example.com/return6',
        },
        {
          id: 1007,
          merchantName: '旅遊平台 G',
          merchant_order_id: 'MOCK-ORDER-1007',
          payMethodId: 9,
          pgType: 'VNMOMO',
          costFee: 18.90,
          amount: 18900,
          createdAt: now.clone().subtract(2, 'days').subtract(6, 'hours').format(),
          isPaid: 1,
          isGotReceipt: 1,
          merchant_notify_url: 'https://example.com/notify7',
          merchant_return_url: 'https://example.com/return7',
        },
        {
          id: 1008,
          merchantName: '餐飲外送 H',
          merchant_order_id: 'MOCK-ORDER-1008',
          payMethodId: 11,
          pgType: 'QRCODE',
          costFee: 1.50,
          amount: 1500,
          createdAt: now.clone().subtract(2, 'days').subtract(10, 'hours').format(),
          isPaid: 1,
          isGotReceipt: 0,
          merchant_notify_url: 'https://example.com/notify8',
          merchant_return_url: 'https://example.com/return8',
        },
        // 3天前的訂單
        {
          id: 1009,
          merchantName: '測試商戶 A',
          merchant_order_id: 'MOCK-ORDER-1009',
          payMethodId: 8,
          pgType: 'VNZALO',
          costFee: 9.60,
          amount: 9600,
          createdAt: now.clone().subtract(3, 'days').subtract(1, 'hours').format(),
          isPaid: 1,
          isGotReceipt: 1,
          merchant_notify_url: 'https://example.com/notify9',
          merchant_return_url: 'https://example.com/return9',
        },
        {
          id: 1010,
          merchantName: '電商平台 C',
          merchant_order_id: 'MOCK-ORDER-1010',
          payMethodId: 7,
          pgType: 'MBBANK',
          costFee: 42.50,
          amount: 42500,
          createdAt: now.clone().subtract(3, 'days').subtract(5, 'hours').format(),
          isPaid: 1,
          isGotReceipt: 1,
          merchant_notify_url: 'https://example.com/notify10',
          merchant_return_url: 'https://example.com/return10',
        },
        {
          id: 1011,
          merchantName: '遊戲平台 D',
          merchant_order_id: 'MOCK-ORDER-1011',
          payMethodId: 12,
          pgType: 'VNVIETTEL',
          costFee: 2.80,
          amount: 2800,
          createdAt: now.clone().subtract(3, 'days').subtract(9, 'hours').format(),
          isPaid: 0,
          isGotReceipt: 0,
          merchant_notify_url: 'https://example.com/notify11',
          merchant_return_url: 'https://example.com/return11',
        },
        // 4天前的訂單
        {
          id: 1012,
          merchantName: '線上商城 E',
          merchant_order_id: 'MOCK-ORDER-1012',
          payMethodId: 9,
          pgType: 'VNMOMO',
          costFee: 6.40,
          amount: 6400,
          createdAt: now.clone().subtract(4, 'days').subtract(3, 'hours').format(),
          isPaid: 1,
          isGotReceipt: 1,
          merchant_notify_url: 'https://example.com/notify12',
          merchant_return_url: 'https://example.com/return12',
        },
        {
          id: 1013,
          merchantName: '金融服務 F',
          merchant_order_id: 'MOCK-ORDER-1013',
          payMethodId: 11,
          pgType: 'QRCODE',
          costFee: 11.20,
          amount: 11200,
          createdAt: now.clone().subtract(4, 'days').subtract(7, 'hours').format(),
          isPaid: 1,
          isGotReceipt: 0,
          merchant_notify_url: 'https://example.com/notify13',
          merchant_return_url: 'https://example.com/return13',
        },
        {
          id: 1014,
          merchantName: '旅遊平台 G',
          merchant_order_id: 'MOCK-ORDER-1014',
          payMethodId: 7,
          pgType: 'VNBANK',
          costFee: 35.60,
          amount: 35600,
          createdAt: now.clone().subtract(4, 'days').subtract(11, 'hours').format(),
          isPaid: 1,
          isGotReceipt: 1,
          merchant_notify_url: 'https://example.com/notify14',
          merchant_return_url: 'https://example.com/return14',
        },
        // 5天前的訂單
        {
          id: 1015,
          merchantName: '餐飲外送 H',
          merchant_order_id: 'MOCK-ORDER-1015',
          payMethodId: 8,
          pgType: 'VNZALO',
          costFee: 4.50,
          amount: 4500,
          createdAt: now.clone().subtract(5, 'days').subtract(2, 'hours').format(),
          isPaid: 1,
          isGotReceipt: 1,
          merchant_notify_url: 'https://example.com/notify15',
          merchant_return_url: 'https://example.com/return15',
        },
        {
          id: 1016,
          merchantName: '測試商戶 B',
          merchant_order_id: 'MOCK-ORDER-1016',
          payMethodId: 9,
          pgType: 'VNMOMO',
          costFee: 7.80,
          amount: 7800,
          createdAt: now.clone().subtract(5, 'days').subtract(6, 'hours').format(),
          isPaid: 1,
          isGotReceipt: 1,
          merchant_notify_url: 'https://example.com/notify16',
          merchant_return_url: 'https://example.com/return16',
        },
        {
          id: 1017,
          merchantName: '電商平台 C',
          merchant_order_id: 'MOCK-ORDER-1017',
          payMethodId: 12,
          pgType: 'VNVIETTEL',
          costFee: 1.90,
          amount: 1900,
          createdAt: now.clone().subtract(5, 'days').subtract(10, 'hours').format(),
          isPaid: 0,
          isGotReceipt: 0,
          merchant_notify_url: 'https://example.com/notify17',
          merchant_return_url: 'https://example.com/return17',
        },
        // 6天前的訂單
        {
          id: 1018,
          merchantName: '遊戲平台 D',
          merchant_order_id: 'MOCK-ORDER-1018',
          payMethodId: 7,
          pgType: 'TCB',
          costFee: 20.40,
          amount: 20400,
          createdAt: now.clone().subtract(6, 'days').subtract(4, 'hours').format(),
          isPaid: 1,
          isGotReceipt: 1,
          merchant_notify_url: 'https://example.com/notify18',
          merchant_return_url: 'https://example.com/return18',
        },
        {
          id: 1019,
          merchantName: '線上商城 E',
          merchant_order_id: 'MOCK-ORDER-1019',
          payMethodId: 11,
          pgType: 'QRCODE',
          costFee: 3.60,
          amount: 3600,
          createdAt: now.clone().subtract(6, 'days').subtract(8, 'hours').format(),
          isPaid: 1,
          isGotReceipt: 0,
          merchant_notify_url: 'https://example.com/notify19',
          merchant_return_url: 'https://example.com/return19',
        },
        {
          id: 1020,
          merchantName: '金融服務 F',
          merchant_order_id: 'MOCK-ORDER-1020',
          payMethodId: 9,
          pgType: 'VNMOMO',
          costFee: 28.70,
          amount: 28700,
          createdAt: now.clone().subtract(6, 'days').subtract(12, 'hours').format(),
          isPaid: 1,
          isGotReceipt: 1,
          merchant_notify_url: 'https://example.com/notify20',
          merchant_return_url: 'https://example.com/return20',
        },
        // 7天前的訂單
        {
          id: 1021,
          merchantName: '旅遊平台 G',
          merchant_order_id: 'MOCK-ORDER-1021',
          payMethodId: 8,
          pgType: 'VNZALO',
          costFee: 14.20,
          amount: 14200,
          createdAt: now.clone().subtract(7, 'days').subtract(1, 'hours').format(),
          isPaid: 1,
          isGotReceipt: 1,
          merchant_notify_url: 'https://example.com/notify21',
          merchant_return_url: 'https://example.com/return21',
        },
        {
          id: 1022,
          merchantName: '餐飲外送 H',
          merchant_order_id: 'MOCK-ORDER-1022',
          payMethodId: 7,
          pgType: 'MBBANK',
          costFee: 0.80,
          amount: 800,
          createdAt: now.clone().subtract(7, 'days').subtract(5, 'hours').format(),
          isPaid: 1,
          isGotReceipt: 1,
          merchant_notify_url: 'https://example.com/notify22',
          merchant_return_url: 'https://example.com/return22',
        },
      ];

      // 計算總金額和總手續費
      const totalAmount = orders.reduce((sum, order) => sum + order.amount, 0);
      const totalCostFee = orders.reduce((sum, order) => sum + order.costFee, 0);

      return wrap({
        code: 200,
        data: {
          dataset: orders,
          totalAmount,
          totalCostFee,
          count: orders.length,
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
    const now = moment().utc();
    const baseRow = {
      merchantName: '測試商戶',
      balance: 200000.12,
      createdAt: now.format(),
    };
    const type = data && data.type ? data.type : 'order';
    let rows = [];
    if (type === 'order') {
      // 生成更多樣化的訂單流水數據
      rows = [
        {
          ...baseRow,
          targetId: 1001,
          amount: 15500,
          type: 'order',
          createdAt: now.clone().subtract(2, 'hours').format(),
        },
        {
          ...baseRow,
          targetId: 1002,
          amount: 8200,
          type: 'order',
          createdAt: now.clone().subtract(5, 'hours').format(),
        },
        {
          ...baseRow,
          targetId: 1003,
          amount: 12300,
          type: 'order',
          createdAt: now.clone().subtract(1, 'days').subtract(3, 'hours').format(),
        },
        {
          ...baseRow,
          targetId: 1004,
          amount: 5500,
          type: 'order',
          createdAt: now.clone().subtract(1, 'days').subtract(8, 'hours').format(),
        },
        {
          ...baseRow,
          targetId: 1005,
          amount: 3200,
          type: 'order',
          createdAt: now.clone().subtract(1, 'days').subtract(12, 'hours').format(),
        },
        {
          ...baseRow,
          targetId: 1006,
          amount: 25800,
          type: 'order',
          createdAt: now.clone().subtract(2, 'days').subtract(2, 'hours').format(),
        },
        {
          ...baseRow,
          targetId: 1007,
          amount: 18900,
          type: 'order',
          createdAt: now.clone().subtract(2, 'days').subtract(6, 'hours').format(),
        },
        {
          ...baseRow,
          targetId: 1008,
          amount: 1500,
          type: 'order',
          createdAt: now.clone().subtract(2, 'days').subtract(10, 'hours').format(),
        },
        {
          ...baseRow,
          targetId: 1009,
          amount: 9600,
          type: 'order',
          createdAt: now.clone().subtract(3, 'days').subtract(1, 'hours').format(),
        },
        {
          ...baseRow,
          targetId: 1010,
          amount: 42500,
          type: 'order',
          createdAt: now.clone().subtract(3, 'days').subtract(5, 'hours').format(),
        },
        {
          ...baseRow,
          targetId: 1011,
          amount: 2800,
          type: 'order',
          createdAt: now.clone().subtract(3, 'days').subtract(9, 'hours').format(),
        },
        {
          ...baseRow,
          targetId: 1012,
          amount: 6400,
          type: 'order',
          createdAt: now.clone().subtract(4, 'days').subtract(3, 'hours').format(),
        },
        {
          ...baseRow,
          targetId: 1013,
          amount: 11200,
          type: 'order',
          createdAt: now.clone().subtract(4, 'days').subtract(7, 'hours').format(),
        },
        {
          ...baseRow,
          targetId: 1014,
          amount: 35600,
          type: 'order',
          createdAt: now.clone().subtract(4, 'days').subtract(11, 'hours').format(),
        },
        {
          ...baseRow,
          targetId: 1015,
          amount: 4500,
          type: 'order',
          createdAt: now.clone().subtract(5, 'days').subtract(2, 'hours').format(),
        },
        {
          ...baseRow,
          targetId: 1016,
          amount: 7800,
          type: 'order',
          createdAt: now.clone().subtract(5, 'days').subtract(6, 'hours').format(),
        },
        {
          ...baseRow,
          targetId: 1017,
          amount: 1900,
          type: 'order',
          createdAt: now.clone().subtract(5, 'days').subtract(10, 'hours').format(),
        },
        {
          ...baseRow,
          targetId: 1018,
          amount: 20400,
          type: 'order',
          createdAt: now.clone().subtract(6, 'days').subtract(4, 'hours').format(),
        },
        {
          ...baseRow,
          targetId: 1019,
          amount: 3600,
          type: 'order',
          createdAt: now.clone().subtract(6, 'days').subtract(8, 'hours').format(),
        },
        {
          ...baseRow,
          targetId: 1020,
          amount: 28700,
          type: 'order',
          createdAt: now.clone().subtract(6, 'days').subtract(12, 'hours').format(),
        },
        {
          ...baseRow,
          targetId: 1021,
          amount: 14200,
          type: 'order',
          createdAt: now.clone().subtract(7, 'days').subtract(1, 'hours').format(),
        },
        {
          ...baseRow,
          targetId: 1022,
          amount: 800,
          type: 'order',
          createdAt: now.clone().subtract(7, 'days').subtract(5, 'hours').format(),
        },
      ];
    } else if (type === 'interCharge') {
      rows = [
        {
          ...baseRow,
          targetId: 3,
          amount: 3000,
          innerAmount: 3000,
          type: 'interCharge',
          createdAt: now.clone().subtract(1, 'days').format(),
        },
        {
          ...baseRow,
          targetId: 4,
          amount: 5000,
          innerAmount: 5000,
          type: 'interCharge',
          createdAt: now.clone().subtract(2, 'days').format(),
        },
        {
          ...baseRow,
          targetId: 5,
          amount: 2000,
          innerAmount: 2000,
          type: 'interCharge',
          createdAt: now.clone().subtract(3, 'days').format(),
        },
      ];
    } else {
      rows = [
        {
          ...baseRow,
          targetId: 4,
          amount: 4000,
          type: 'bill',
          createdAt: now.clone().subtract(1, 'days').format(),
        },
        {
          ...baseRow,
          targetId: 5,
          amount: 6000,
          type: 'bill',
          createdAt: now.clone().subtract(2, 'days').format(),
        },
        {
          ...baseRow,
          targetId: 6,
          amount: 3500,
          type: 'bill',
          createdAt: now.clone().subtract(3, 'days').format(),
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
