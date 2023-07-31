import * as bcrypt from 'bcrypt';

export const comparePasswords = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const createHashedPassword = async (
  password: string,
): Promise<string> => {
  return bcrypt.hash(password, 10);
};
