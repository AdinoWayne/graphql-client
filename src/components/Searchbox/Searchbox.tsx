import React, { ChangeEvent, useEffect, useState } from 'react';
import { Space } from 'antd';
import Button from 'components/Button/Button';
import { useQueryString, useSetMultiQueryParam } from 'services/queryString';
import InputSearch from 'components/Input/InputSearch';
interface SearchboxProps {
    paramName: string;
    placeholder: string;

}
const Searchbox = ({ paramName, placeholder }: SearchboxProps):React.ReactElement => {
    const setQueryParam = useSetMultiQueryParam();

    const value = useQueryString(paramName);
    const [text, setText] = useState('');
    useEffect(() => {
        setText(value);
    }, [value])

    const handleChangeText = (e: ChangeEvent<HTMLInputElement>) => setText(e.target.value);
    const handleClickSearch = () => {
        setQueryParam([paramName, "page"], [text, "1"]);
    }

    return (
        <>
            <Space>
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

export default Searchbox;