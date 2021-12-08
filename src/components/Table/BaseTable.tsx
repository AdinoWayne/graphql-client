import React from 'react';
import { Button, Col, Space, Table, TableProps } from 'antd';
import { useQueryNumber, useSetQueryParam } from 'utils/queryString';
import styled from 'styled-components';
import CustomPagination from "components/Pagination/CustomPagination";

type Props = React.ComponentProps<typeof Table> & { total: number; typeRow?: string; onClickDownload?: () => void, downloading?: boolean }

const BaseTable = (props: Props):React.ReactElement => {
    const {rowSelection, typeRow, pagination, onChange, total, onClickDownload, downloading, ...rest} = props;
    const setQueryParam = useSetQueryParam();
    const page = useQueryNumber('page', 1);

    const handleSelectChange = (page: number) => {
        setQueryParam('page', page.toString());
    }

    const handleChange = (data: any) => {
      if (data) {
        setQueryParam("page", data.current.toString());
      }
    }

    const valueRowSelection:TableProps<object>| undefined = typeRow === 'NONE' ? undefined : { rowSelection :{
      type: 'checkbox',
      hideSelectAll: true,
      ...rowSelection,
    }}

    return (
        <div>
          <Table
              {...valueRowSelection}
              onChange={handleChange}
              pagination={false}
              {...rest}
          />
          { rest.loading ? null : (
            <SpacePagination>
              <Col className="blank-space"></Col>
              <CustomPagination 
                current={page}
                total={total}
                onChange={handleSelectChange}
              />
              {
                onClickDownload ? (
                  <Button
                    disabled={!props.dataSource?.length}
                    loading={downloading}
                    onClick={onClickDownload}
                  >{LANG.LABEL_BUTTON_DOWNLOAD_LIST}</Button>
                ) : <Col className="blank-space"></Col>
              }
            </SpacePagination>
          )} 
        </div>
    );
};

const LANG = {
  	LABEL_BUTTON_DOWNLOAD_LIST: 'Download list'
}

const SpacePagination = styled(Space)`
	margin-top: 16px;
	display: flex;
	justify-content: space-between;
	& .blank-space {
		width: 167px;
	}
`

export default BaseTable;