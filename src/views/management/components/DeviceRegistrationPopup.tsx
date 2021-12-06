import { Button, Input, Modal, Row, Space, Typography } from 'antd';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useStoreDevice } from 'services/devices/deviceService';
import styled from 'styled-components';

interface DeviceRegistrationPopupProps {
    handleRegister: Function;
    isOpenRegister: boolean;
    setRegisterDevice: Function;
    runRegister?: Function;
}

const DeviceRegistrationPopup = ({
    handleRegister,
    isOpenRegister,
    setRegisterDevice,
    runRegister
}:DeviceRegistrationPopupProps):React.ReactElement => {
    
    const handleChangeText = (e: ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        setImei(val);
        setErrorStore("");
        if (!val.trim()) {
            setValid(false);
        } else {
            setValid(true);
        }
    }

    const handleCallback = (value: boolean):void => {
        if (runRegister) {
            runRegister(value);
        }
    }

    const [imei, setImei] = useState('');
    const [errorStore, setErrorStore] = useState<string>('');
    const shouldClose = useRef<boolean>(false);
    const { error, isLoading, mutate } = useStoreDevice();
    const [isValid, setValid] = useState(true);

    const handleRegisterDevice = () => {
        mutate({imei});
        shouldClose.current = true;
        handleRegister();
    }

    useEffect(() => {
        if (error) {
            setErrorStore(error.message)
        }
    }, [error])

    useEffect(() => {
        if (isLoading) {
            handleCallback(isLoading);
        } else if (!isLoading && shouldClose.current) {
            handleCallback(isLoading);
            if (!error?.status) {
                setImei("");
                setRegisterDevice(false);
                shouldClose.current = false;
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading])

    useEffect(() => {
        if (!isOpenRegister) {
            setImei("");
            setErrorStore("");
        } else if (!isLoading) {
            shouldClose.current = false;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpenRegister])

    return (
        <>
        <RegisterModal
            title={LANG.LABEL_DIALOG_TITLE_REGISTER}
            visible={isOpenRegister}
            onCancel={() => setRegisterDevice(false)}
            footer={[
            <Button disabled={isValid === false || imei.length === 0} key="back" onClick={() => handleRegisterDevice()} loading={isLoading} type="primary" className="btn-save">
                {LANG.LABEL_BUTTON_SAVE}
            </Button>
            ]}
            >
            <Row>
                <Space>
                    <Typography>{LANG.LABEL_IMEI_TEXT}</Typography>
                    <Input placeholder="IMEI" value={imei} maxLength={15} bordered={false} onChange={handleChangeText} className="register-input" />
                </Space>
            </Row>
            {!!errorStore ? <ErrorText>{errorStore}</ErrorText> : null}
        </RegisterModal>
    </>
    )
}

const LANG = {
    LABEL_BUTTON_DOWNLOAD_LIST: 'Download list',
    LABEL_DIALOG_TITLE_REGISTER: 'Device Registration',
    LABEL_BUTTON_FW_UPDATE: 'FW update',
    LABEL_BUTTON_BATCH_REGISTRATION: 'Batch Registration',
    LABEL_BUTTON_REGISTER: 'Register',
    LABEL_BUTTON_DELETE: 'Delete',
    LABEL_BUTTON_SAVE: 'Save',
    LABEL_DEVICE_LIST_TOTAL: 'Device List - Total',
    LABEL_DEVICES: 'Devices',
    LABEL_FILTER_SITE: 'Site',
    LABEL_FILTER_DEVICE_TYPE: 'Device type',
    LABEL_FILTER_WEARER: 'Wearer',
    LABEL_IMEI_TEXT: 'IMEI'
}

const RegisterModal = styled(Modal)`
    .register-input {
        width: 255px;
        margin-bottom: 0px;
    }
`

const ErrorText = styled(Typography.Text)`
    color: #ff0000;
    font-size: 12px;
`


export default DeviceRegistrationPopup;