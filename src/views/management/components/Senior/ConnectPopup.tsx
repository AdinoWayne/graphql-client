import { useState, useEffect, ChangeEvent } from "react";
import styled from "styled-components";
import { Button, Input, Modal, Space, Spin } from "antd";
import { useSearchDevice } from "hooks/useSearchDevice";
import { useConnectDevice } from "hooks/useConnectDevice";
import classNames from "classnames";

interface ConnectSeniorPopupProps {
  isOpen: boolean;
  setIsOpen: Function;
  callbackFn: Function;
  onClose(selectedSenior: { wearerId: number, name: string }): void;
  seniorId: string;
}

const ConnectPopup = (props: ConnectSeniorPopupProps) => {

  const { isOpen, setIsOpen, seniorId, callbackFn } = props

  const [searchText, setSearchText] = useState('');

  const { data, isLoading } = useSearchDevice(searchText);

  const { mutate, isLoading: isConnecting } = useConnectDevice();

  const [inputText, setInputText] = useState('');
  const [selectedSenior, setSelectedSenior] = useState({
    deviceId: "",
    imei: "",
  });

  useEffect(() => {
    setSelectedSenior({
      deviceId: "",
      imei: "",
    });
  }, [data])

  const handleSave = () => {
    if (selectedSenior.deviceId) {
      mutate({
        deviceId: selectedSenior.deviceId,
        seniorId
      }, {
        onSettled: () => {
          setIsOpen(false);
          callbackFn();
        },
        onSuccess: () => { callbackFn(); }
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

  const onClosePopup = () => {
    setInputText('');
    setIsOpen(false);
  };

  return (
    <ConnectContainer
      onCancel={() => onClosePopup()}
      visible={isOpen}
      footer={[
        <Button
          type="primary"
          disabled={!selectedSenior.deviceId}
          loading={isConnecting}
          key="save"
          onClick={() => handleSave()}
        >
          Save
        </Button>,
        <Button key="cancel" onClick={() => onClosePopup()} >
          Cancel
        </Button>
      ]}
    >
      <div className="senior-title">
        <span className="senior-title">Device</span>
      </div>
      <div className="senior-search-container">
        <Space>
          <Input
            name="imei"
            value={inputText}
            placeholder="IMEI"
            prefix={<span className="icon-search" />}
            onChange={handleChangeSearchText}
            onPressEnter={onClickSearch}
          />
          <Button type="primary" onClick={onClickSearch}>
            Search
          </Button>
        </Space>
      </div>
      <div className={classNames("senior-list", { loading: isConnecting })}>
        <div className="senior-id-text">IMEI</div>
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
                  onClick={() => onSelectSenior(item)}
                  className={
                    selectedSenior.deviceId === item.deviceId ? "selected" : ""
                  }
                >
                  {item.deviceUid ? item.deviceUid : item.imei}
                </li>
              );
            })}
        </ul>
      </div>
    </ConnectContainer>
  );
};

export default ConnectPopup;

const ConnectContainer = styled(Modal)`
  .ant-modal-content {
    margin: auto;
    max-width: 330px;
  }

  .ant-modal-footer {
    text-align: center
  }

  div.senior-title {
    display: flex;
    justify-content: center;
  }

  span.senior-title {
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