import axios from 'axios';
import { createHmac } from './utils/crypto.js';

export const cryptocurrencyPrice = async (ticker) => {
  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ticker}&vs_currencies=usd`;
    const { data } = await axios.get(url, {
      headers: { 'Content-Type': 'application/json' },
    });
    const usdValue = Object.values(data).find(
      (obj) => typeof obj === 'object'
    )?.usd;
    return usdValue;
  } catch (error) {
    throw new Error(error);
  }
};

export const openOrder = async (
  apiSecret,
  apiKey,
  passphrase,
  params,
  apiText
) => {
  const url = `https://api.kucoin.com/api/v1/${apiText}`;
  const now = Date.now();
  const {
    clientOid,
    typeOfTrading,
    size,
    kindOrder,
    tradePair,
    price,
    cryptoCurrancy,
  } = params;
  try {
    const priceCurrancyUSDT = await cryptocurrencyPrice(cryptoCurrancy);
    const totalPrice = String((size / priceCurrancyUSDT).toFixed(8));
    const data = {
      clientOid: clientOid,
      side: kindOrder,
      symbol: tradePair,
      type: 'market',
      funds: size,
    };
    if (typeOfTrading == 'limit') {
      delete data.funds;
      data.type = typeOfTrading;
      data.price = price;
      data.size = totalPrice;
    }

    const dataJson = JSON.stringify(data);
    const strToSign = now + 'POST' + `/api/v1/${apiText}` + dataJson;
    const headers = createHmac(
      apiSecret,
      strToSign,
      apiKey,
      passphrase,
      now,
      'application/json'
    );
    await axios.post(url, dataJson, { headers: headers });
  } catch (error) {
    throw new Error(error);
  }
};

export const withdraw = async (apiSecret, apiKey, passPhrase, params) => {
  const url = 'https://api.kucoin.com/api/v1/withdrawals';
  const now = new Date();
  const { currancy, withdrawalAddress, amount } = params;
  data = {
    currancy: currancy,
    address: withdrawalAddress,
    amount: amount,
  };

  const dataJson = JSON.stringify(data);
  const strToSign = now + 'POST' + '/api/v1/withdrawals' + dataJson;

  const headers = createHmac(
    apiSecret,
    strToSign,
    apiKey,
    passPhrase,
    now,
    'application/json'
  );
  try {
    await axios.post(url, dataJson, { headers: headers });
  } catch (error) {
    throw new Error(error);
  }
};

export const listAllOrders = async (apiSecret, apiKey, passPhrase, params) => {
  let url = 'https://api.kucoin.com/api/v1/orders?';
  const now = Date.now();
  let strSign = '/api/v1/orders?';
  const { status, tradePair, kindOfOrders, typeOfOrders, typeOfTrading } =
    params;

  const data = {
    status: status,
    symbol: tradePair,
    side: kindOfOrders,
    type: typeOfOrders,
    tradeType: typeOfTrading,
  };

  Object.keys(data).forEach(
    (key) => data[key] === undefined && delete data[key]
  );
 
  let isFirst = true;
  for (const [key, value] of Object.entries(data)) {
    if (isFirst) {
      url += `${key}=${value}`;
      strSign += `${key}=${value}`;
      isFirst = false;
    } else {
      url += `&${key}=${value}`;
      strSign += `&${key}=${value}`;
    }
  }

  const strToSign = now + 'GET' + strSign;
  console.log(strToSign)
  const headers = createHmac(apiSecret, strToSign, apiKey, passPhrase, now);
 
  try {
    
    const response = await axios.get(url, { headers:headers });
   
    console.log(response.data.data.items)
    return response.data.data.items;
  } catch (error) {
    throw new Error(error);
  }
};

export const cancelOrder = async (dataAuth, orderId) => {
  const url = `https://api.kucoin.com/api/v1/orders/${orderId}`;
  const now = Date.now();
  const { apiSecret, apiKey, passPhrase } = dataAuth;

  const strToSign = now + 'DELETE' + `/api/v1/orders/${orderId}`;
  const headers = createHmac(apiSecret, strToSign, apiKey, passPhrase, now);
  try {
    await axios.delete(url, { headers: headers });
  } catch (error) {
    throw new Error(error);
  }
};
