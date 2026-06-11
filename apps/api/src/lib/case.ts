function toCamel(str: string): string {
  return str.replace(/([-_][a-z])/gi, (group) =>
    group.toUpperCase().replace('-', '').replace('_', '')
  );
}

export default function keysToCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => keysToCamelCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result: any, key) => {
      const camelKey = toCamel(key);
      result[camelKey] = keysToCamelCase(obj[key]);
      return result;
    }, {});
  }
  return obj;
};