import { useQuery } from "react-query";
import api from "api";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import qs from 'query-string';
import { useGenerateExcel } from "services/parseExcel";
import { camelToSnakeCase } from "services/string";
import { getDate, getDateObj, getDateUtc, getMonth } from "services/date";
import format from 'date-fns/format';
import { addMinutes } from 'date-fns';

type Device = {
    deviceId: string;
    deviceUid: string,
    deviceName: string,
    status: string[],
    statusLevel: string,
    battery: number,
    imei: string,
    initialize: boolean,
    deviceImgUrl: null | string,
    createdDate: string,
    modifiedDate: string,
    landLine: null | string,
    activated: boolean,
    step: number,
    healthRate: number,
    sleep: number,
    beacon: null | string
};

type Response = {
    total: number,
    data: Device[]
}

const getDevices = async (queryString: string): Promise<Response> => {

    let params: string = queryString;
    const [PAGE, DEVICE_URL] = ['page', '/devices'];
    if (queryString) {
        let queryURl = new URLSearchParams(queryString);
        let page: (string | null | number) = queryURl.get(PAGE);
        if (page) {
            page = parseInt(page, 10) - 1;
            if (page < 0) {
                page = 0;
            }
            queryURl.set(PAGE, page.toString());
        }
        params = '?' + queryURl.toString();
    }

    const { data } = await api.get(
        `${DEVICE_URL}${params}`
    );

    return data;
};


export default function useDevices(config?: { wearer: boolean }) {
    const location = useLocation();

    const [queryString, setQueryString] = useState(config?.wearer ? 'wearer=true': '');

    useEffect(() => {
        let query = location.search;
        const parsed = qs.parse(location.search, { arrayFormat : "comma"});
        if(config?.wearer) {
            parsed["wearer"] = "true";
        }
        query = qs.stringify(parsed, { arrayFormat: "comma"});
        setQueryString(query);
    }, [location])

    return useQuery(['devices', queryString], () => getDevices(queryString), { retry: 1, refetchOnWindowFocus: false, keepPreviousData: true })
}

export function useDevicesDate() {
    const location = useLocation();

    const [queryString, setQueryString] = useState('');

    useEffect(() => {
        let query = location.search;
        const parsed = qs.parse(location.search, { arrayFormat : "comma"});
        if (!parsed["startDate"]) {
            const day = getDateUtc(true , [0,0,0,0]);
            parsed["startDate"] = day.toISOString();
        } else {
            const date = parsed["startDate"];
            const day = getDateUtc(false, [0,0,0,0], date);
            const beforeMonth = getDateUtc(true, [0,0,0,0]);
            parsed["startDate"] = getDateObj(day) ? day.toISOString() : beforeMonth.toISOString();
        }
        if (!parsed["endDate"]) {
            const day = getDateUtc(false , [23,59,59,999]);;
            parsed["endDate"] = day.toISOString();
        } else {
            const date = parsed["endDate"];
            const day = getDateUtc(false, [23,59,59,999], date);
            const newDate = getDateUtc(false, [23,59,59,999]);
            parsed["endDate"] = getDateObj(day) ? day.toISOString() : newDate.toISOString();
        }
        query = qs.stringify(parsed, { arrayFormat: "comma"});
        setQueryString(query);
    }, [location])

    return useQuery(['devices', queryString], () => getDevices(queryString), { retry: 1, refetchOnWindowFocus: false, keepPreviousData: true })
}

export const generateColumns = (data: any[]) => {
    if(data.length === 0) return [];
    const item = data[0];
    const keys = Object.keys(item);
    const columns = keys.map(key => {
        return (
            {
                header: camelToSnakeCase(key).toUpperCase(),
                key,
                width: 30
            }
        )
    })

    return columns;
}
export function useDownloadDevices() {

    const [downloading, setDownloading] = useState(false);
    const { generate } = useGenerateExcel(() => { setDownloading(false) });
    const MAX_ROW_SIZE = 50000;
    const parsed = qs.parse(window.location.search, { arrayFormat: "comma" });
    parsed['size'] = `${MAX_ROW_SIZE}`;
    if (!!parsed['page']) {
        delete parsed['page'];
    }
    if (!parsed["startDate"]) {
        const day = getDateUtc(true , [0,0,0,0]);
        parsed["startDate"] = day.toISOString();
    } else {
        const date = parsed["startDate"];
        const day = getDateUtc(false, [0,0,0,0], date);
        const beforeMonth = getDateUtc(true, [0,0,0,0]);
        parsed["startDate"] = getDateObj(day) ? day.toISOString() : beforeMonth.toISOString();
    }
    if (!parsed["endDate"]) {
        const day = getDateUtc(false , [23,59,59,999]);;
        parsed["endDate"] = day.toISOString();
    } else {
        const date = parsed["endDate"];
        const day = getDateUtc(false, [23,59,59,999], date);
        const newDate = getDateUtc(false, [23,59,59,999]);
        parsed["endDate"] = getDateObj(day) ? day.toISOString() : newDate.toISOString();
    }
    const stringified = qs.stringify(parsed, { arrayFormat: "comma" });



    const download = () => {
        setDownloading(true);
        getDevices(stringified).then((res) => {
            console.log("devices:", res);
            if(res && Array.isArray(res.data)) {
                let result = res.data.map(e => {
                    return ({
                        activated_at: format(new Date(e.createdDate), 'LLL dd yyyy, hh:mmaaa'),
                        imei: e.deviceUid || '',
                        site: '',
                        device_type: 'Watch'
                    })
                })
                generate({
                    columns: generateColumns(result),
                    data: result,
                    fileName: 'device_list',
                    sheetName: 'Device List'
                })
            }
        })
    }

    return {
        download,
        downloading
    }
}

export function useDownloadStatuses() {

    const [downloading, setDownloading] = useState(false);
    const { generate } = useGenerateExcel(() => { setDownloading(false) });
    const MAX_ROW_SIZE = 50000;
    const parsed = qs.parse(window.location.search, { arrayFormat: "comma" });
    parsed['size'] = `${MAX_ROW_SIZE}`;
    if (!!parsed['page']) {
        delete parsed['page'];
    }
    const stringified = qs.stringify(parsed, { arrayFormat: "comma" });

    const download = () => {
        setDownloading(true);
        getDevices(stringified).then((res) => {
            generate({
                columns: generateColumns(res.data),
                data: res.data,
                fileName: 'Status_list',
                sheetName: 'Status List'
            })
        })
    }

    return {
        download,
        downloading
    }
}