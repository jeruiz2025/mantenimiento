import bcrypt from "bcryptjs";

export const hashPassword = (password) => bcrypt.hash(password, 10);

export const verifyPassword = (password, hashed) => bcrypt.compare(password, hashed);