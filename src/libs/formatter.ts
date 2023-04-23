export const convertToCurrency = (
  num: number,
  currencyString: string = 'USD'
) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyString,
  });

  return formatter.format(num / 100);
};

export const capitalizeAllWords = (str: string) => {
  const newStr = str
    .split(' ')
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
  return newStr;
};

export const snakeToCamel = (
  str: string,
  capitalizeFirsLetterOnLeadingString: boolean = false
) => {
  let newStr = '';
  const strArr = str.split('_');
  for (let word of strArr) {
    newStr += word.charAt(0).toUpperCase() + word.slice(1);
  }
  if (!capitalizeFirsLetterOnLeadingString) {
    newStr = newStr.charAt(0).toLocaleLowerCase() + newStr.slice(1);
  }

  return newStr;
};

export const mutatePropertyName = (oldName: string, obj: object, fn: Function) => {
  obj[fn(oldName)] = obj[oldName];
  delete obj[oldName];
}

export const mutatePropertyNames = (obj: object, fn: Function) => {
  for (let key of Object.keys(obj)) {
    const newWord: string = fn(key);
    if (newWord !== key) {
      obj[fn(key)] = obj[key];
      delete obj[key];
    }
  }
}