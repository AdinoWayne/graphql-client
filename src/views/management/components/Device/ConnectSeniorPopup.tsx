import { useState, useEffect, ChangeEvent } from "react";
import styled from "styled-components";
import { Button, Input, Modal, Space, Spin } from "antd";
import { ConnectSenior, useSearchSenior } from "hooks/useSearchSenior";
import { useConnectSenior } from "hooks/useConnectSenior";
import classNames from "classnames";
import queryClient from "queryClient";

interface ConnectSeniorPopupProps {
  isOpen: boolean;
  setIsOpen: Function;
  onClose(selectedSenior: any): void;
  deviceId: string;
}
interface Props {

}

const ConnectSeniorPopup = (props: ConnectSeniorPopupProps) => {

  const { onClose, isOpen, setIsOpen, deviceId } = props

  const [searchText, setSearchText] = useState('');

  const { data, isLoading } = useSearchSenior(searchText);

  const { mutate, isLoading: isConnectingSenior } = useConnectSenior();

  const [inputText, setInputText] = useState('');
  const [selectedSenior, setSelectedSenior] = useState({
    wearerId: 0,
    name: "",
  });

  useEffect(() => {
    setSelectedSenior({
      wearerId: 0,
      name: "",
    });
  }, [data])

  const handleSave = () => {
    // action change senior
    if (selectedSenior.wearerId) {
      mutate({
        deviceId,
        seniorId: selectedSenior.wearerId
      }, {
        onSettled: () => {
          onClose("");
        },
        onSuccess: () => {
          queryClient.invalidateQueries('specificDevice');
          onClose(selectedSenior);
        }
      });
    }
  };

  const onSelectSenior = (senior: any) => {
    setSelectedSenior(senior);
  };

  const onClickSearch = () => {
    setSearchText(inputText);
  };

  const handleChangeSearchText = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  return (
    <ConnectSeniorContainer
      visible={isOpen}
      onCancel={() => onClose("")}
      footer={[
        <Button type="primary" disabled={!selectedSenior.wearerId} loading={isConnectingSenior} key="save" onClick={() => handleSave()} >
          Save
        </Button>,
        <Button key="cancel" onClick={() => onClose("")} >
          Cancel
        </Button>
      ]}
    >
      <span className="senior-title">Senior</span>
      <div className="senior-search-container">
        <Space>
          <Input
            name="seniorIdOrName"
            value={inputText}
            placeholder="Senior ID or Name"
            prefix={<span className="icon-search" />}
            onChange={handleChangeSearchText}
            onPressEnter={onClickSearch}
          />
          <Button type="primary" onClick={onClickSearch}>
            Search
          </Button>
        </Space>
      </div>
      <div className={classNames("senior-list", { loading: isConnectingSenior })}>
        <div className="senior-id-text">Senior ID</div>
        {
          isLoading && (
            <div className="row-flex justify-center">
              <Spin />
            </div>

          )
        }
        <ul>
          {data?.data &&
            data.data.map((item: any, index: number) => {
              return (
                <li
                  key={index}
                  value={item}
                  onClick={() => onSelectSenior(item)}
                  className={
                    selectedSenior.wearerId == item.wearerId ? "selected" : ""
                  }
                >
                  {item.name} - {item.wearerId}
                </li>
              );
            })}
        </ul>
      </div>
    </ConnectSeniorContainer>
  );
};

export default ConnectSeniorPopup;

const ConnectSeniorContainer = styled(Modal)`
  .ant-modal-content {
    margin: auto;
    max-width: 400px;
  }
  .ant-modal-footer {
    text-align: center
  }
  .senior-title {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    padding-bottom: 10px;
  }
  .senior-search-container {
    margin: 10px 0px;
  }
  .button-container {
    margin: 10px 0px;
    display: flex;
    .button-container-item {
      width: 100%;
    }
  }
  .senior-list {
    height: 350px;
    overflow: auto;
    overflow-x: hidden;
    .senior-id-text {
      padding-left: 5px;
      font-weight: 400;
      font-size: 16px;
    }

    &.loading {
      opacity: 0.5;
      pointer-event: none;
    }
  }
  ul {
    padding-inline-start: 0px;
  }
  li {
    list-style: none;
    cursor: pointer;
    padding: 5px 5px;
    margin: 5px 10px 5px 0px;
    border-radius: 10px;
  }
  li:hover {
    background-color: #f9f7f7;
  }
  li.selected {
    background-color: #f9f7f7;
  }
`;