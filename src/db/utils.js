export const findUserInfo = (userId) => {
    return {
      $and: [
        { userId: userId },
        { passPhrase: { $exists: true } },
        { apiSecret: { $exists: true } },
        { apiKey: { $exists: true } },
      ],
    };
  };
  
  export const deleteUserInfo = (cryptocurrancy, price, id) => {
    return {
      cryptocurrancy: cryptocurrancy,
      price: price,
      userId: id,
    };
  };
  