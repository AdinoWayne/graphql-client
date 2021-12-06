import { useState, useEffect } from "react"
import { Input as AntInput } from 'antd';
import styled from "styled-components";
type Props = React.ComponentProps<typeof AntInput>
const InputSearch = (props: Props) => {
    return (
        <>
            <StyledInput {...props} prefix={<span className="icon icon-search" />} allowClear/>
        </>
    )
}
export default InputSearch;
const StyledInput = styled(AntInput)`
    width: auto;
    border: 1px solid var(--border-strong) !important;
    border-radius: 98px;
    span.icon {
        font-size: 14px;
        color: var(--text-secondary);
    }
    .ant-input-prefix {
        margin-right: 8px;
    }
    &.ant-input-affix-wrapper:focus, &.ant-input-affix-wrapper-focused {
        outline: none!important;
        box-shadow: 0 0 0 3px rgb(164,202,254, 0.45);
        border-color: #A4CAFE!important;
        outline-offset: 0;
    }
`