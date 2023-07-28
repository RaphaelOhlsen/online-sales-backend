export const toLowerCaseString = (value: string) => {
  if (typeof value !== 'string') {
    throw new Error('Value must be a string');
  }
  return value.toLowerCase();
};
