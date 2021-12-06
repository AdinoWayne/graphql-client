import React, { ChangeEvent, useEffect, useState } from 'react';
import { Input, Menu, Space, Select } from 'antd';
import Button from 'components/Button/Button';
import { useQueryString, useSetQueryParam } from 'services/queryString';
import { checkEmailOrPhoneValidate } from 'services/formServices';
import InputSearch from 'components/Input/InputSearch';
interface SearchboxProps {
    paramName: string;
    placeholder: string;

}
const SearchTop = ({ paramName, placeholder }: SearchboxProps) => {
    const setQueryParam = useSetQueryParam();

    const value = useQueryString(paramName);
    const [text, setText] = useState('');
    const [selectValue, setSelectValue] = useState(LANG.TEXT_B2B_OR_B2C);
    useEffect(() => {
        setText(value);
    }, [value])

    const handleChangeText = (e: ChangeEvent<HTMLInputElement>) => setText(e.target.value);
    const handleChangeFilter = (value: string) => setSelectValue(value);
    const handleClickSearch = () => {
        setQueryParam(paramName, text);
        // const { isValid } = checkEmailOrPhoneValidate(text);
        // if (isValid || !text) {
        // }
    }

    return (
        <>
            <Space>
                <Select disabled defaultValue={selectValue} style={{ width: 120 }} onChange={handleChangeFilter}>
                    <Select.Option value={LANG.TEXT_B2B_OR_B2C}>{LANG.TEXT_B2B_OR_B2C}</Select.Option>
                    <Select.Option value={LANG.TEXT_B2B}>{LANG.TEXT_B2B}</Select.Option>
                    <Select.Option value={LANG.TEXT_B2C}>{LANG.TEXT_B2C}</Select.Option>
                </Select>
                <InputSearch
                    name="email"
                    value={text}
                    placeholder={placeholder}
                    onChange={handleChangeText}
                />
                <Button type="primary"
                    onClick={handleClickSearch}
                >Search</Button>
            </Space>
        </>
    )
}

const LANG = {
    TEXT_B2B_OR_B2C: 'B2B or B2C',
    TEXT_B2B: 'B2B',
    TEXT_B2C: 'B2C',
}

export default SearchTop;