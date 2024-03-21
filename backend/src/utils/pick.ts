/* eslint-disable @typescript-eslint/no-explicit-any */

// Create an object composed of the picked object properties
const pick = (object: { [key: string]: any }, keys: string[]) => {
  return keys.reduce((obj: { [key: string]: any }, key) => {
    if (object && Object.hasOwn(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

export default pick;
