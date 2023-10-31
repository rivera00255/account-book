export const addComma = (value: string) => {
  const comma = (str: string) => str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
  const uncomma = (str: string) => str.replace(/[^\d]+/g, '');
  return comma(uncomma(value));
};

export const strToUnccoma = (value: string) => {
  if (!value.toString().includes(',')) return value;
  return value
    .toString()
    .split(',')
    .reduce((curr, acc) => curr + acc, '');
};
