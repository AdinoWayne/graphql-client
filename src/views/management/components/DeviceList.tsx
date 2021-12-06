import Button from 'components/Button/Button';
import { ControlOutlined, RightOutlined } from '@ant-design/icons';
import { Col, Row, Space, Typography } from 'antd';
import React, { useState, useContext, useRef, useEffect } from 'react';
import 'antd/dist/antd.css';
import BaseTable from 'components/Table/BaseTable';
import styled from 'styled-components';
import Searchbox from 'components/Searchbox/Searchbox';
import { useDownloadDevices, useDevicesDate } from 'hooks/useDevices';
import SelectorFilterTop from "views/management/components/SelectorFilterTop";
import DeviceRegistrationPopup from "views/management/components/DeviceRegistrationPopup";
import { ManagementContext } from 'contexts/ManagementContext';
import queryClient from 'queryClient';
import DeviceFilterDate from 'views/management/components/DeviceFilterDate';
import { useHistory } from 'react-router-dom';
import { Device } from 'services/types';
import format from 'date-fns/format';
import BatchRegistrationPopup from './BatchRegistrationPopup';
import { useDeleteListDevice } from 'hooks/useDeleteDevices';
import ConnectSeniorPopup from './Device/ConnectSeniorPopup';
import { useDisconnectSenior } from 'services/devices/deviceService';
import { addMinutes } from 'date-fns';

const DeviceList: React.FC = () => {
    const history = useHistory();
    
    const { data, isFetching } = useDevicesDate();

    const [listDelete, setListDelete] = useState<Array<string>>([]);

    const [openConnectPopup, setOpenConnectPopup] = useState(false);

    const { isLoading: deleteLoading, mutate } = useDeleteListDevice();

    const devicesOption = [{ value: "watch", title: "watch"}, { value: "hub", title: "hub"}];

    const context = useContext(ManagementContext);

    const wearerOption =[{ value: "true", title: "connected"}, { value: "false", title: "not connected"}];
    const [isOpenRegister, setRegisterDevice] = useState<boolean>(false);
    const [isOpenBatchRegister, setIsOpenBatchRegister] = useState(false);

    const [filterSite, ] = useState<boolean>(false);
    const [filterDeviceType, setFilterDeviceType] = useState<string>("");
    const [filterWearer, setFilterWearer] = useState<string>("");

    const [isFreezing, setIsFreezing] = useState<boolean>(false);
    const [haveDeleteConnection, setHaveDeleteConnection] = useState<boolean>(false);

    const [isStoreLoading, setIsStoreLoading] = useState<boolean>(false);

    let deviceIdRef = useRef("");

    const openConnectSeniorPopup = (deviceId: string) : void => {
        setOpenConnectPopup(true);
        deviceIdRef.current = deviceId;
    }

    const closePopup = (selectedSenior: any) => {
        if (selectedSenior && selectedSenior.wearerId) {
          queryClient.invalidateQueries('devices')
        }
        setOpenConnectPopup(false);
    };
    const { mutate: disconnectSenior, isLoading: disconnectSeniorLoading } = useDisconnectSenior();

    const disconnectToSenior = (deviceId: string, seniorId: string) : void => {
        if (deviceId && seniorId) {
            disconnectSenior({
                deviceId: deviceId,
                seniorId: seniorId
            });
        }
    };
    
    useEffect(() => {
        setIsFreezing(deleteLoading)
    }, [deleteLoading])

    const columns = [
        {
            title: 'Activated At',
            dataIndex: 'createdDate',
            key: 'createdDate',
            render: (text: string, record: Object) => {
                return <div>{format(new Date(text), 'LLL dd yyyy, hh:mmaaa')}</div>
            }
        },
        {
            title: 'IMEI',
            dataIndex: 'deviceUid',
            render: (imei: string) => <span>{imei}</span>,
            key: 'deviceUid',
        },
        {
          title: 'Site',
          dataIndex: 'site',
          render: (text: string) => <span>{text}</span>,
          key: 'site',
        },
        {
          title: 'Device type',
          dataIndex: 'deviceType',
          render: (text: string) => <span>VitaSense Watch</span>,
          key: 'deviceType',
        },
        {
          title: 'More',
          dataIndex: 'action',
          render: (text: string, row: any) => (
            <Space className="table-col-more">
                <Button onClick={() => history.push('/management/devices/' + row.deviceId)}>Detail</Button>
                {
                    row.wearers.length !== 0 ? 
                    (
                        <>
                            <Button danger type="primary" onClick={() => disconnectToSenior(row.deviceId, row.wearers[0].wearerId) }>Disconnect</Button>
                            <Button type="primary"  onClick={() => history.push('/management/seniors/' + row.wearers[0].wearerId)}>Senior</Button>
                        </>
                    ) :
                    <Button onClick={() => openConnectSeniorPopup(row.deviceId)}>Connect Senior</Button>
                }
                <RightOutlined />
            </Space>
          ),
          key: 'action',
        }
    ];

    const handleFWUpdate = ():void => {};
    const handleBatchRegistration = ():void => {
        setIsOpenBatchRegister(true);
    };
    const handleRegister = ():void => {
        setRegisterDevice(true);
    };
    const handleDelete = ():void => {
        if (listDelete.length > 0) {
            context.shouldIsOpen(true, {
                title: 'Delete Devices',
                message: `${haveDeleteConnection ? "The connection to the senior will break. " : ""} Are you sure you want to delete it?`,
                onCancel: () => {},
                onConfirm: () => {
                    mutate(listDelete, {
                        onSuccess: () => {
                            //reset selection
                            setListDelete([]);
                        }
                    });
                },
            });
        }
    };
    const handleSite = ():void => {};

    const handleRegistration = () => {
        queryClient.invalidateQueries('devices');
    }

    const handleCheckboxTable = (selectedRowKeys: React.Key[], selectedRows: any[]) => {
        setHaveDeleteConnection(selectedRows.some((element: Device) => element?.wearers && element?.wearers.length !== 0))
        setListDelete(selectedRows.map((el: Device) => el.deviceId))
    }

    const handleShouldLoading = (value: boolean) => {
        setIsStoreLoading(value);
        setIsFreezing(value);
    }

    const showFilterDevice = ():React.ReactElement => {
        const typography : any[]  = [];
        const showResultFilter = (value: string, list: Array<{ value: string; title: string}>) => {
            const result:Array<{ value: string; title: string}> = list.filter(el => el.value === value);
            if (result && result.length > 0) {
                return result[0].title;
            }
            return "-";
        }
        if (!!filterSite) {
            typography.push(<Typography key={1}>[{LANG.LABEL_FILTER_SITE}] {filterSite}</Typography>);
        }
        if (devicesOption.map(el => el.value).includes(filterDeviceType)) {
            typography.push(
            <Typography key={2}>
                [{LANG.LABEL_FILTER_DEVICE_TYPE}] {showResultFilter(filterDeviceType, devicesOption)}
            </Typography>
            );
        }
        if (wearerOption.map(el => el.value).includes(filterWearer)) {
            typography.push(
            <Typography key={3}>
                [{LANG.LABEL_FILTER_WEARER}] {showResultFilter(filterWearer, wearerOption)}
            </Typography>
            );
        }
        return (
            <Space className="space-filter-text">
                {typography.map((el:React.ReactElement) => el)}
            </Space>
        )
    }

    const { download, downloading } = useDownloadDevices();
    const onClickDownload = () => {
        download();
    }

    return (
        <>
            <DeviceListContainer>
                <Space className="space-filter-wrapper">
                    <Col>
                        <DeviceFilterDate></DeviceFilterDate>
                    </Col>
                    <Col className="space-filter-search">
                        <Row className="filter-site-tag">
                            <Button icon={<ControlOutlined />} onClick={handleSite}>{LANG.LABEL_FILTER_SITE}</Button>
                            <SelectorFilterTop
                                defaultValue={"Device Type"}
                                option={devicesOption}
                                paramName="deviceType"
                                callback={setFilterDeviceType}
                            />
                            <SelectorFilterTop
                                defaultValue={"Wearer"}
                                option={wearerOption}
                                paramName="wearer"
                                callback={setFilterWearer}
                            />
                        </Row>
                        <Row>
                            <Searchbox 
                                paramName="imei"
                                placeholder="IMEI"
                            />
                        </Row>
                    </Col>
                </Space>
                {showFilterDevice()}
                <SpaceTable>
                  <Typography>{LANG.LABEL_DEVICE_LIST_TOTAL} {data ? data.total : 0} {LANG.LABEL_DEVICES}</Typography>
                  <Row>
                    <Button disabled={true} onClick={handleFWUpdate}>{LANG.LABEL_BUTTON_FW_UPDATE}</Button>
                    <Button disabled={isFreezing} onClick={handleBatchRegistration}>{LANG.LABEL_BUTTON_BATCH_REGISTRATION}</Button>
                    <Button disabled={isFreezing} type="primary" loading={isStoreLoading} onClick={handleRegister}>{LANG.LABEL_BUTTON_REGISTER}</Button>
                    <Button disabled={isFreezing || !listDelete.length} type="primary" loading={deleteLoading} danger onClick={handleDelete}>{LANG.LABEL_BUTTON_DELETE}</Button>
                  </Row>
                </SpaceTable>
                <BaseTable columns={columns} rowSelection={{ preserveSelectedRowKeys: true, onChange: handleCheckboxTable}} total={data ? data.total : 0} dataSource={data ? data.data : data} loading={isFetching} 
                    rowKey={'deviceId'}
                    onClickDownload={onClickDownload}
                    downloading={downloading}
                />
                <DeviceRegistrationPopup
                    handleRegister={handleRegistration}
                    isOpenRegister={isOpenRegister}
                    setRegisterDevice={setRegisterDevice}
                    runRegister={handleShouldLoading}
                ></DeviceRegistrationPopup>
                <BatchRegistrationPopup 
                    isOpen={isOpenBatchRegister}
                    setIsOpen={setIsOpenBatchRegister}
                />
                {
                    openConnectPopup && 
                    <ConnectSeniorPopup
                        deviceId={deviceIdRef.current}
                        onClose={closePopup}
                        isOpen={openConnectPopup}
                        setIsOpen={openConnectSeniorPopup} 
                    />
                }
            </DeviceListContainer>
        </>
    )
};

const LANG = {
    LABEL_BUTTON_DOWNLOAD_LIST: 'Download list',
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

const DeviceListContainer = styled.div`
    & .space-filter-wrapper {
        display: flex;
        justify-content: space-between;
    }

    & .table-col-more .anticon-right{
        visibility: hidden;
    }

    & .ant-table-row:hover .table-col-more .anticon-right{
        visibility: visible;
    }

    & .ant-select {
        margin-left: 8px;
    }

    & .space-filter-text {
        margin: 32px 0 16px 0;
        padding: 8px;
        display: flex;
        background-color: #5b5b5b;
        border-radius: 5px;
        & span, article {
            color: #fff;
        }
    }

    & .space-filter-search {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        margin: 16px 0;
        & .filter-site-tag {
            margin-bottom: 10px;
        }

        & button {
            margin-left: 5px;
        }
    }
`


const SpaceTable = styled(({children, ...rest}) => <Space {...rest} >{children}</Space>)`
    display: flex;
    justify-content: space-between;
    & button {
      margin-left: 5px;
    }
`

export default DeviceList;