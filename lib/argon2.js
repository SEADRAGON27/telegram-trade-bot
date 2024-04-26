import argon2 from 'argon2';

export const hashPassword = async (password) => {
  try {
    await argon2.hash(password);
  } catch (error) {
    throw new Error(error);
  }
};
