import { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import qs from 'query-string';


export const useQueryString = (paramName: string) => {
    const location = useLocation();
    const [value, setValue] = useState('')
    useEffect(() => {
         const parsed = qs.parse(location.search, { arrayFormat: "bracket"});
        let param = parsed[paramName];
        setValue(param ? param.toString() : '');

     }, [location.search])
     return value;
}
export const useQueryNumber = (paramName: string, defaultValue: number) => {
    const location = useLocation();
    const [value, setValue] = useState(defaultValue)
    useEffect(() => {
         const parsed = qs.parse(location.search, { arrayFormat: "comma"});
        let param = parsed[paramName] as string;
        const paramNum = parseInt(param) || defaultValue;
        setValue(paramNum);

     }, [location.search])
     return value;
}

export const useSetQueryParam = () => {
    const location = useLocation();
    const history = useHistory();
    const setQueryParam = (name: string, value: string) => {
        const parsed = qs.parse(location.search, { arrayFormat : "comma"});
        parsed[name] = value;
        const stringified = qs.stringify(parsed, { arrayFormat: "comma"});
        history.push({ search: stringified })
    }
    return setQueryParam;
}

export const useSetMultiQueryParam = () => {
    const location = useLocation();
    const history = useHistory();
    const setQueryParam = (names: Array<string>, value: Array<string>) => {
        const parsed = qs.parse(location.search, { arrayFormat : "comma"});
        for (let i = 0; i < names.length; i++) {
            parsed[names[i]] = value[i];
        }
        const stringified = qs.stringify(parsed, { arrayFormat: "comma"});
        history.push({ search: stringified })
    }
    return setQueryParam;
}

export const useRemoveQueryParam = () => {
    const location = useLocation();
    const history = useHistory();
    const setQueryParam = (name: string, value: string) => {
        const parsed = qs.parse(location.search, { arrayFormat : "comma"});
        if (!value) {
            delete parsed[name];
        }
        const stringified = qs.stringify(parsed, { arrayFormat: "comma"});
        history.push({ search: stringified })
    }
    return setQueryParam;
}

export const updateQueryParamResetPage = (history: any, paramName: string, value: any) => {
    const location = window.location;
    const parsed = qs.parse(location.search);
    parsed[paramName] = value;
    parsed['page'] = '1';

    const stringified = qs.stringify(parsed, { arrayFormat: "comma"});
    history.push({ search: stringified })
}

export const updateQueryParam = (history: any, paramName: string, value: string) => {
    const location = window.location;
    const parsed = qs.parse(location.search);
    parsed[paramName] = value;

    const stringified = qs.stringify(parsed, { arrayFormat: "comma"});
    history.push({ search: stringified })
}