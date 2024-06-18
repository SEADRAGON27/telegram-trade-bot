import crypto from 'crypto';

export const createHmac = (
  apiSecret,
  strToSign,
  apiKey,
  pass_phrase,
  now,
  headersType
) => {
  const signature = crypto
    .createHmac('sha256', apiSecret)
    .update(strToSign)
    .digest('base64');
    
  const passPhrase = crypto
    .createHmac('sha256', apiSecret)
    .update(pass_phrase)
    .digest('base64');
    

  const headers = {
    'KC-API-SIGN': signature,
    'KC-API-TIMESTAMP': now,
    'KC-API-KEY': apiKey,
    'KC-API-PASSPHRASE': passPhrase,
    'KC-API-KEY-VERSION': '2',
  };
  headersType !== undefined ? (headers['Content-Type'] = headersType) : '';
  return headers;
};
