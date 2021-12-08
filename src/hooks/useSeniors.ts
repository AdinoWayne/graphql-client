import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { getSeniorList } from "services/seniorService";
import qs from 'query-string';
import { getDateObj, getDateUtc } from "utils/date";

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