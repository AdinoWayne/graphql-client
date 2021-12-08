import { Button, Modal, Row, Typography } from 'antd';
import { ManagementContext } from 'contexts/ManagementContext';
import React, { useContext } from 'react';
import styled from 'styled-components';

const ConfirmPopup:React.FC = () => {
    
    const context = useContext(ManagementContext);

    const { isOpen, data, shouldIsOpen } = context;

    const handleCancel = ():void => {
        if (data.onCancel) {
            data.onCancel();
        }
        shouldIsOpen(false);
    }

    const handleConfirm = ():void => {
        if (data.onConfirm) {
            data.onConfirm();
        }
        shouldIsOpen(false);
    }

    const isDanger = data.isConfirm ? {} : { danger: true };

    const isDelete = data.isConfirm ? 'Confirm' : 'Delete';

    return (
        <>
        <RegisterModal
            title={data.title}
            visible={isOpen}
            onCancel={handleCancel}
            footer={[
            <Button key="back" onClick={handleCancel}>
                {LANG.LABEL_BUTTON_CANCEL}
            </Button>,
            <Button key="confirm" {...isDanger} type="primary" danger onClick={handleConfirm}>
                {isDelete}
            </Button>
            ]}
            >
            <Row>
                <Typography>{data.message}</Typography>
            </Row>
        </RegisterModal>
    </>
    )
}

const LANG = {
    LABEL_BUTTON_CANCEL: 'Cancel',
    LABEL_BUTTON_CONFIRM: 'Confirm'
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