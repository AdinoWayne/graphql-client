import React from 'react';
import { Input as AntdInput} from 'antd';
import styled from 'styled-components';

type AntInputProp = React.ComponentProps<typeof AntdInput>
interface Props extends AntInputProp {
}
const Input = (props: Props) => {
    return <StyledInput  {...props}  />
}



const StyledInput = styled(AntdInput)`
    border: 1px solid #CCCCCC;
    box-sizing: border-box;
    border-radius: 14px;
    /* height: 32px; */
    input {
        text-indent: 4px;
        font-size: 13px;
    }

    &:focus {
        border-color: #2684FF;
        box-shadow: 0 0 0 1px #2684FF;
    }
`

export default Input;