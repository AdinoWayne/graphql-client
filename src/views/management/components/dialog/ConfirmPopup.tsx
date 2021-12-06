import { Button, Modal, Row, Typography } from 'antd';
import React from 'react';
import styled from 'styled-components';

interface ConfirmPopupProps {
    title: string;
    setIsOpen: Function;
    isOpen: boolean;
    handleConfirm: Function;
    message: string;
    isConfirm?: boolean;
}

const ConfirmPopup = ({
    title,
    setIsOpen,
    isOpen,
    handleConfirm,
    message,
    isConfirm
}:ConfirmPopupProps):React.ReactElement => {
    
    const isDanger = isConfirm ? {} : { danger: true };

    const isDelete = isConfirm ? 'OK' : 'Delete';

    return (
        <>
        <RegisterModal
            title={title}
            visible={isOpen}
            onCancel={() => setIsOpen(false)}
            footer={[
            <Button key="confirm" {...isDanger} type="primary" onClick={() => {setIsOpen(false);handleConfirm()}}>
                {isDelete}
            </Button>,
            <Button key="back" onClick={() => setIsOpen(false)}>
                {LANG.LABEL_BUTTON_CANCEL}
            </Button>
            ]}
            >
            <Row>
                <Typography>{message}</Typography>
            </Row>
        </RegisterModal>
    </>
    )
}

const LANG = {
    LABEL_BUTTON_CANCEL: 'Cancel',
    LABEL_BUTTON_CONFIRM: 'OK'
}

const RegisterModal = styled(Modal)`
    .ant-modal-content {
        margin: auto;
        max-width: 300px;
    }
    .ant-modal-footer {
        text-align: center
    }
`

export default ConfirmPopup;