import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { getSeniorList } from "services/seniors/seniorService";
import { useGenerateExcel } from "services/parseExcel";
import qs from 'query-string';
import { camelToSnakeCase } from "services/string";
import format from 'date-fns/format';
import { getDateObj, getDateUtc } from "services/date";

const getSeniors = getSeniorList;

export default function useSeniors() {
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
    },[location])

    return useQuery(['seniors', queryString], () => getSeniors(queryString), { retry: 1, refetchOnWindowFocus: false, keepPreviousData: true })
}
export function useDownloadSeniors() {

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

    const generateColumns = (data: any[]) => {
        if(data.length === 0) return [];
        const item = data[0];
        const keys = Object.keys(item);
        const columns = keys.map(key => {
            return (
                {
                    header: updateHeaderName(camelToSnakeCase(key).toUpperCase()),
                    key,
                    width: 30
                }
            )
        })

        return columns;
    }

    const updateHeaderName = (data: string) => {
        if (data === "ACTIVATED_AT") {
           return data = "CREATED_AT";
        } else if (data === "IMEI") {
            return data = "SENIOR_ID";
        } else {
            return data;
        }
    }

    const download = () => {
        setDownloading(true);
        getSeniors(stringified).then((res) => {
            console.log("seniors:", res);
            if(res && Array.isArray(res.data)) {
                let result = res.data.map(e => {
                    return ({
                        activated_at: format(new Date(e.createdDate), 'LLL dd yyyy, hh:mmaaa'),
                        imei: e.wearerId || '',
                        name: e.name || '',
                        site: '',
                        device: e.devices?.length || 0
                    })
                })
                generate({
                    columns: generateColumns(result),
                    data: result,
                    fileName: 'senior_list',
                    sheetName: 'Senior List'
                })
            }
        })
    }

    return {
        download,
        downloading
    }
}