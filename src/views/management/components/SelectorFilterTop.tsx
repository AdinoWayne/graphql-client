import { Select } from 'antd';
import React, { Dispatch, SetStateAction, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useQueryString, useSetQueryParam } from 'utils/queryString';

interface SelectorFilterTopProps {
    paramName: string;
    option: Array<{ value: string, title: string}>;
    defaultValue: string;
    callback: Dispatch<SetStateAction<string>>
}

const SelectorFilterTop:React.FC<SelectorFilterTopProps> = ({ paramName, option, defaultValue, callback }:SelectorFilterTopProps) => {

    const setQueryParam = useSetQueryParam();
    let keyRef = useRef<number>(1);
    const [filterValue, setFilterValue] = useState(defaultValue);

    const value = useQueryString(paramName);

    useEffect(() => {
        if (value) {
            keyRef.current += keyRef.current 
            setFilterValue(value);
            callback(value);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    const handleSelectChange = (value: string) => {
        callback(value);
        setQueryParam(paramName, value);
    }

    return (
        <SelectorFilterComponent>
            <Select
                key={keyRef.current}
                defaultValue={filterValue}
                style={{ width: 120 }}
                allowClear
                onChange={handleSelectChange}>
                    {option.map((el, index) => (<Select.Option value={el.value} key={index}>{el.title}</Select.Option>))}
            </Select>
        </SelectorFilterComponent>
    )
}

const SelectorFilterComponent = styled.div`
    //styling here
`

export default SelectorFilterTop;