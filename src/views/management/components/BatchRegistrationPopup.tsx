import React from 'react';
import { Button, Modal, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from "react-query";
import styled from 'styled-components';
import { parseExcel, useDownloadSampleDevice } from 'services/parseExcel';
import { useBatchInsertDevice } from 'hooks/useBatchInsertDevice';
interface DeviceBatchRegistrationPopupProps {
    isOpen: boolean;
    setIsOpen: Function;

}

interface DeviceUploadDto {
    DEVICE_UID: string;
    MODEL_ID: string;
    DEVICE_VERSION: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}


const BatchRegistrationPopup = (props: DeviceBatchRegistrationPopupProps):React.ReactElement => {

    const { isOpen, setIsOpen } = props;
    const { error, isLoading, mutate } = useBatchInsertDevice();

    const [isOpenResultModal, setIsOpenResultModal] = useState(false);
    const [failItems, setFailItems] = useState<string[]>([])

    const queryClient = useQueryClient();

    const [deviceList, setDeviceList] = useState<{ uid: string, version: string, modelId: string }[]>([]);

    const [uploadState, setUploadState] = useState<{ isError: Boolean, data: DeviceUploadDto[]}>({ isError: false, data: []});

    const [fileName, setFileName] = useState('');

    useEffect(() => {
        if(!isOpen) {
            setFileName('');
            setDeviceList([]);
        }
    }, [isOpen])

    useEffect(() => {
        if(!isOpenResultModal) {
            setFailItems([]);
            setUploadState({ isError: false, data: []});
        }
    }, [isOpenResultModal])

    const handleApply = (): void => {
        if (deviceList.length === 0) {
            setUploadState(pre => ({ ...pre, isError: true}));
            setIsOpenResultModal(true);
            setIsOpen(false);
            return;
        }
        mutate(deviceList, {
            onSuccess: (failItems: string[]) => {
                setFailItems(failItems);
                setIsOpenResultModal(true);
                queryClient.invalidateQueries("devices");
            },
            onError: () => {

            },
            onSettled: () => {
                setIsOpen(false);
            }
        });
    }

    const { downloadSampleDevice, generating } = useDownloadSampleDevice();


    const downloadSample = () => {
        downloadSampleDevice();
    }


    const handleUpload = (e: any) => {
        const files = e.target.files;
        parseExcel<any>(files[0], (data: DeviceUploadDto[]) => {
            if (Array.isArray(data)) {
                const payload = data
                    .map(e => ({
                        uid: e.DEVICE_UID,
                        version: e.DEVICE_VERSION,
                        modelId: e.MODEL_ID
                    }))
                    .filter(e => {
                        return /^\d{15}$/.test(e.uid);
                    });
                if (data.length) {
                    setUploadState(pre => ({ ...pre, data: [...data]}));
                    setFileName(files[0].name);
                    setDeviceList(payload);
                }
            }
        })
    };

    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        inputRef.current?.click();
    }

    return (
        <>
            <Modal
                visible={isOpenResultModal}
                title={null}
                destroyOnClose
                onCancel={() => setIsOpenResultModal(false)}
                footer={[
                    <Button type="primary" onClick={() => setIsOpenResultModal(false)} >
                        OK
                    </Button>
                ]}
            >
                <h3> {
                        error || uploadState.isError || uploadState.data.length === failItems.length ? "Applied unsuccessfully"
                        : "Applied successfully"
                    }</h3>
                {
                    uploadState.isError ? <div>
                        Please edit the file and upload it again
                    </div> : null
                }
                <div>
                    Total failure items: <b>{uploadState.isError ? uploadState.data.length : failItems.length}</b>
                </div>
                <div>
                    List failure items:
                    <ul>
                        {
                            failItems.length > 0 ? failItems.map((e, index) => (
                                <li key={index}>{e}</li>
                            )) : null
                        }
                    </ul>
                </div>
            </Modal>
            <RegisterModal
                title={LANG.LABEL_DIALOG_TITLE_REGISTER}
                visible={isOpen}
                onCancel={() => setIsOpen(false)}
                footer={[
                    <Button disabled={uploadState.data.length === 0} key="back"  type="primary" onClick={() => handleApply()} loading={isLoading}>
                        {LANG.LABEL_BUTTON_APPLY}
                    </Button>
                ]}
                destroyOnClose
            >

                <div className="text-center mb24">
                    <Space
                        align={"center"}
                        direction="horizontal"

                    >
                        <div className="excel-button"
                            onClick={downloadSample}
                        >
                            <span className="icon-excel text20" />
                            excel</div>
                    </Space>
                </div>
                <ol>
                    <li>Download the above Excel form and fill in the details.</li>
                    <li>Write the file name according to the format.</li>
                    <li>Click the Upload button below, upload the Excel form you created, and then click Apply</li>
                </ol>

                <Space className="upload-inner">
                    <label className="filename">{fileName || 'File name'}</label>
                    <label htmlFor="contained-button-file">
                        <Button
                            onClick={handleClick}
                            icon={<span className="icon-upload mr8" />}
                        >Upload</Button>
                    </label>
                    <input
                        ref={inputRef}
                        type="file"
                        accept=".xlsx, .xls, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        hidden
                        onChange={handleUpload}
                    />
                </Space>
            </RegisterModal>

        </>
    )
}

export default BatchRegistrationPopup;


const RegisterModal = styled(Modal)`
    .ant-modal-content {
        margin: auto;
        max-width: 400px;
    }
    .ant-modal-footer {
        text-align: center
    }

    .excel-button {
        width: 80px;
        height: 80px;
        border: 1px solid #ccc;
        cursor: pointer;
        display: grid;
        place-content: center;
    }

    .upload-inner {
        label.filename {
            border: 1px solid #ddd;
            width: 200px;
            display: block;
            height: 32px;
            padding: 4px 10px;
        }
    }
`

const LANG = {
    LABEL_BUTTON_DOWNLOAD_LIST: 'Download list',
    LABEL_DIALOG_TITLE_REGISTER: 'Batch Registration',
    LABEL_BUTTON_FW_UPDATE: 'FW update',
    LABEL_BUTTON_BATCH_REGISTRATION: 'Batch Registration',
    LABEL_BUTTON_REGISTER: 'Register',
    LABEL_BUTTON_DELETE: 'Delete',
    LABEL_BUTTON_APPLY: 'Apply',
    LABEL_DEVICE_LIST_TOTAL: 'Device List - Total',
    LABEL_DEVICES: 'Devices',
    LABEL_FILTER_SITE: 'Site',
    LABEL_FILTER_DEVICE_TYPE: 'Device type',
    LABEL_FILTER_WEARER: 'Wearer',
    LABEL_IMEI_TEXT: 'IMEI'
}