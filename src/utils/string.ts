export const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

export const checkDate = (data: string):string => {
    const regEx = /^\d{4}-\d{1,2}-\d{1,2}$/;
    if(!data.match(regEx)) return '';
    const d = new Date(data);
    const dNum = d.getTime();
    if(!dNum && dNum !== 0) return '';
    return data;
}

export const bytesToSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const decimals = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

export const isNumeric = (value:any): boolean => {
    return /^\d+$/.test(value);
}
