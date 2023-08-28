import argon2 from "argon2";
export const hashPassword = async (password) => {
  await argon2.hash(password);
};
