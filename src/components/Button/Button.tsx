import React from 'react';
import styled from 'styled-components';
import { Button as AntdButton} from 'antd';

type Props = React.ComponentProps<typeof AntdButton>
const Button = (props: Props) => {
    return <StyledButton {...props} />
}


const StyledButton = styled(AntdButton)`
    min-width: 80px;
    border-radius: 6px;
    font-size: 13px;

    &.success:not(:disabled) {
        background-color: var(--green);
        border-color: var(--green);
        color: #fff;
        &:hover {
            background-color: var(--green);
        }
        &:active {
            background-color: var(--green);
        }
    }

    &.danger:not(:disabled) {
        background-color: var(--red);
        border-color: var(--red);
        color: #fff;
        &:hover {
            background-color: var(--red);
        }
        &:active {
            background-color: var(--red);
        }
    }

    /* &.ant-btn-primary {
        background-color: var(--purple-1);
        border-color: var(--primary-1)
    } */

`

export default Button;