/* eslint-disable @typescript-eslint/no-explicit-any */
// Will address typing later but for now, this is a utility function to convert object keys 
// from snake_case to camelCase. Due to the unknown nature of the data being passed in, 
// we will use 'any' type for now.


function toCamel(str: string): string {
	return str.replace(/[-_]+([a-z0-9])/gi, (_, char: string) =>
		/[a-z]/i.test(char) ? char.toUpperCase() : char
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
