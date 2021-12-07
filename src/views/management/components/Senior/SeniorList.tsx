import Button from 'components/Button/Button';
import { RightOutlined } from '@ant-design/icons';
import { Col, Row, Space, Typography } from 'antd';
import React, { useState, useRef, useEffect, useContext } from 'react';
import 'antd/dist/antd.css';
import BaseTable from 'components/Table/BaseTable';
import styled from 'styled-components';
import Searchbox from 'components/Searchbox/Searchbox';
import useSeniors from 'hooks/useSeniors';
import SeniorRegistrationPopup from "views/management/components/Senior/SeniorRegistrationPopup";
import queryClient from 'queryClient';
import DeviceFilterDate from 'views/management/components/DeviceFilterDate';
import { ManagementContext } from 'contexts/ManagementContext';
import { useHistory } from 'react-router-dom';
import { useDeleteListSenior } from "services/seniors/seniorService";
import format from 'date-fns/format';
import { Senior } from 'services/types';

const SeniorList: React.FC = () => {
    const history = useHistory();
    const { data, isFetching } = useSeniors();

    const [listDelete, setListDelete] = useState<Array<string>>([]);

    let wearerIdConnectRef = useRef("");

    const { isLoading: deleteLoading, mutate: removeSeniors} = useDeleteListSenior();

    const context = useContext(ManagementContext);
    const [isOpenRegister, setRegisterSenior] = useState<boolean>(false);

    const [isFreezing, setIsFreezing] = useState<boolean>(false);

    const [isStoreLoading, setIsStoreLoading] = useState<boolean>(false);

    useEffect(() => {
        setIsFreezing(deleteLoading)
    }, [deleteLoading])

    const columns = [
        {
            title: 'Created At',
            dataIndex: 'date',
            key: 'date',
            render: (text: string, record: Object) => {
                return <div>{format(new Date(text), 'LLL dd yyyy, hh:mmaaa')}</div>
            }
        },
        {
            title: 'Senior ID',
            dataIndex: '_id',
            key: '_id',
        },
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Content',
          dataIndex: 'text',
          key: 'text',
        },
        {
          title: 'More',
          dataIndex: 'action',
          render: (_text: string, row: any) => (
            <Space className="table-col-more">
                <Button onClick={() => history.push('/management/seniors/' + row.wearerId)}>{LANG.LABEL_BUTTON_DETAIL}</Button>
                <RightOutlined />
            </Space>
          ),
          key: 'action',
        }
    ];

    const handleRegister = ():void => {
        setRegisterSenior(true);
    };
    const handleDelete = ():void => {
        if (listDelete.length > 0) {
            context.shouldIsOpen(true, {
                title: 'Delete Seniors',
                message: 'Are you sure you want to delete it?',
                onCancel: () => {},
                onConfirm: () => {
                    removeSeniors(listDelete, {
                        onSuccess: () => {
                            setListDelete([]);
                        }
                    });
                },
            });

        }
    };

    const handleShouldLoading = (value: boolean) => {
        setIsStoreLoading(value);
        setIsFreezing(value);
    }

    const handleCheckboxTable = (_selectedRowKeys: React.Key[], selectedRows: any[]) => {
        setListDelete(selectedRows.map((el: Senior) => el.wearerId));
    }

    console.log(data);

    return (
        <>
            <SeniorListContainer>
                <Space className="space-filter-wrapper">
                    <Col>
                        <DeviceFilterDate></DeviceFilterDate>
                    </Col>
                    <Col className="space-filter-search">
                        <Row>
                            <Searchbox 
                                paramName="postName"
                                placeholder="Post Name"
                            />
                        </Row>
                    </Col>
                </Space>
                <SpaceTable>
                  <Typography>{LANG.LABEL_SENIOR_LIST_TOTAL} {data && data.posts ? data.posts.length : 0} {LANG.LABEL_SENIORS}</Typography>
                  <Row>
                    <Button disabled={isFreezing} loading={isStoreLoading} type="primary" onClick={handleRegister}>{LANG.LABEL_BUTTON_REGISTER}</Button>
                    <Button disabled={isFreezing || !listDelete.length} loading={deleteLoading} type="primary" danger onClick={handleDelete}>{LANG.LABEL_BUTTON_DELETE}</Button>
                  </Row>
                </SpaceTable>
                <BaseTable
                    columns={columns}
                    total={data && data.posts ? data.posts.length : 0}
                    dataSource={data && data.posts ? data.posts : []}
                    loading={isFetching}
                    rowSelection={{preserveSelectedRowKeys: true, onChange: handleCheckboxTable}}
                    rowKey={'wearerId'}
                />
                <SeniorRegistrationPopup
                    isOpenRegister={isOpenRegister}
                    setRegisterSenior={setRegisterSenior}
                    runRegister={handleShouldLoading}
                ></SeniorRegistrationPopup>
            </SeniorListContainer>
        </>
    )
};

const LANG = {
    LABEL_BUTTON_DOWNLOAD_LIST: 'Download list',
    LABEL_BUTTON_BATCH_REGISTRATION: 'Batch Registration',
    LABEL_BUTTON_REGISTER: 'Register',
    LABEL_BUTTON_DELETE: 'Delete',
    LABEL_BUTTON_DETAIL: 'Detail',
    LABEL_BUTTON_SAVE: 'Save',
    LABEL_BUTTON_DEVICE: 'Device',
    LABEL_BUTTON_CONNECT_DEVICE: 'Connect Device',
    LABEL_SENIOR_LIST_TOTAL: 'Senior List - Total',
    LABEL_SENIORS: 'seniors',
    LABEL_FILTER_SITE: 'Site',
    LABEL_FILTER_TAG: "Tag",
    LABEL_FILTER_WEARER: 'Wearer',
    LABEL_IMEI_TEXT: 'IMEI'
}

const SeniorListContainer = styled.div`
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

    & .space-download-wrapper {
        display: flex;
        height: 32px;
        position: relative;
        & button {
            position: absolute;
            top: -50px;
            right: 16px;
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

export default SeniorList;