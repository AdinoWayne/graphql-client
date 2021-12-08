import { Button, Input, Modal, Row, Space, Typography } from 'antd';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useStoreSenior } from 'services/seniorService';
interface PostRegistrationPopupProps {
    isOpenRegister: boolean;
    setRegisterSenior: Function;
    runRegister?: Function;
}

const SeniorRegistrationPopup = ({
    isOpenRegister,
    setRegisterSenior,
    runRegister
}:PostRegistrationPopupProps):React.ReactElement => {
    
    const handleChangeText = (e: ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        setName(val);
        setErrorStore("");

        if (!val.trim()) {
            setValid(false);
        } else {
            setValid(true);
        }
    }

    const [name, setName] = useState<string>('');
    const [errorStore, setErrorStore] = useState<string>('');
    const { error, mutate, isLoading } = useStoreSenior();
    const [isValid, setValid] = useState(true)

    const shouldClose = useRef<boolean>(false);

    const handleRegisterSenior = () => {
        mutate({name: name.trim()});
        shouldClose.current = true;
    }

    const handleCallback = (value: boolean):void => {
        if (runRegister) {
            runRegister(value);
        }
    }

    useEffect(() => {
        if (error) {
            setErrorStore(error.message)
        }
    }, [error])

    useEffect(() => {
        if (!isOpenRegister) {
            setName("");
            setErrorStore("");
        } else if (!isLoading) {
            shouldClose.current = false;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpenRegister])

    useEffect(() => {
        if (isLoading) {
            handleCallback(isLoading);
        } else if (!isLoading && shouldClose.current) {
            handleCallback(isLoading);
            if (!error?.status) {
                setName("");
                setRegisterSenior(false);
                shouldClose.current = false;
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading])

    return (
        <>
        <RegisterModal
            title={LANG.LABEL_DIALOG_TITLE_REGISTER}
            visible={isOpenRegister}
            onCancel={() => setRegisterSenior(false)}
            footer={[
            <Button key="back" disabled={isValid === false || name.length === 0} onClick={() => handleRegisterSenior()} loading={isLoading} type="primary" className="btn-save">
                {LANG.LABEL_BUTTON_SAVE}
            </Button>
            ]}
            >
            <Row>
                <Space>
                    <Typography>{LANG.LABEL_NAME_TEXT}</Typography>
                    <Input placeholder="Name" value={name} maxLength={128} bordered={false} onChange={handleChangeText} className="register-input"/>
                </Space>
            </Row>
            <Row>
                <Space>
                    <Typography>{LANG.LABEL_SITE_TEXT}</Typography>
                    <PlusCircleOutlined disabled style={{ marginLeft: 24 }}/>
                </Space>
            </Row>
            {!!errorStore ? <ErrorText>{errorStore}</ErrorText> : null}
        </RegisterModal>
    </>
    )
}

const LANG = {
    LABEL_BUTTON_DOWNLOAD_LIST: 'Download list',
    LABEL_DIALOG_TITLE_REGISTER: 'Senior Registration',
    LABEL_BUTTON_FW_UPDATE: 'FW update',
    LABEL_BUTTON_BATCH_REGISTRATION: 'Batch Registration',
    LABEL_BUTTON_REGISTER: 'Register',
    LABEL_BUTTON_DELETE: 'Delete',
    LABEL_BUTTON_SAVE: 'Save',
    LABEL_DEVICES: 'Devices',
    LABEL_FILTER_SITE: 'Site',
    LABEL_FILTER_WEARER: 'Wearer',
    LABEL_NAME_TEXT: 'Name',
    LABEL_SITE_TEXT: 'Site',
}

const RegisterModal = styled(Modal)`
`

const ErrorText = styled(Typography.Text)`
    color: #ff0000;
    font-size: 12px;
`


export default SeniorRegistrationPopup;