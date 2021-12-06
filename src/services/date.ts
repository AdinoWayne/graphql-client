import { START_DATE } from "./constants";

export function isInvalidDate(d: any) {
    if(d instanceof Date && !isNaN(d.getDate())) {
        return false;
    }

    return true;
}

export const getDateObj = (s: any) => {
    if(!s) return null;
    let d = new Date(s);
    if(isInvalidDate(d)) {
        return null;
    }

    return d;
}

export const checkDate = (data: string):string => {
    const regEx = /^\d{4}-\d{1,2}-\d{1,2}$/;
    if(!data.match(regEx)) return '';
    const d = new Date(data);
    const dNum = d.getTime();
    if(!dNum && dNum !== 0) return '';
    return data;
}

export const defaultDate = (date: string, type?: string):Date => {
    const value = checkDate(date)
    if (value === "") {
        if (type === START_DATE) {
          const value = new Date(
            new Date().getFullYear(),
            new Date().getMonth() - 1, 
            new Date().getDate()
          );
          return value;
        }
        const value = new Date();
        return value;
    }
    return new Date(date);
}

export const getMonth = (date: Date) => {
    var month = date.getMonth() + 1;
    return month < 10 ? '0' + month : '' + month;
}

export const getDate = (date: Date) => {
    var day = date.getDate();
    return day < 10 ? '0' + day : '' + day;
}

export const getDateUtc = (isLastMonth: boolean, time: [number, number, number, number], value?: any) => {
    if (isLastMonth) {
        const newDate = value ? new Date(value) : new Date(
            new Date().getFullYear(),
            new Date().getMonth() - 1, 
            new Date().getDate()
        );
        newDate.setHours(...time);
        return newDate;
    }
    const newDate = value ? new Date(value) : new Date();
    newDate.setHours(...time);
    return newDate;
}