import { useState } from "react";
import styled from "styled-components";
import { Button, Form, Input, Spin } from "antd";
import ConnectSeniorPopup from "./components/Device/ConnectSeniorPopup";
import { useHistory } from 'react-router-dom';
import { useQueryClient } from "react-query";
import { useGetSpecificDevice } from "hooks/useGetSpecificDevice";
import { useDeleteListDevice } from "hooks/useDeleteDevices";
import { getSeniorMainCarers, getSeniorSubCarers } from "services/seniors/seniorService";
import format from "date-fns/format";
import ConfirmPopup from "views/management/components/dialog/ConfirmPopup";
const { TextArea } = Input;
const DeviceDetail = () => {
  let url = window.location.pathname;
  let id = url.substring(url.lastIndexOf('/') + 1);
  const { data } = useGetSpecificDevice(id);
  let device = data?.data;
  const [isOpenConnectSenior, setIsOpenConnectSenior] = useState(false);
  const [form] = Form.useForm();
  const history = useHistory();
  const { mutate: removeDevice, isLoading: isDeleting } = useDeleteListDevice();
  const senior = device?.wearers?.[0];

  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const onSettingMenu = () => {
    // open popup setting menu
  }

  const onUpdateFirmware = () => {
    // update firmware
  }

  const handelDeleteConfirm = ():void => {
    if (device) {
      const deviceId = device.deviceId ? [device.deviceId] : []
      removeDevice(deviceId, {
        onSettled: () => {
          history.push('/management/devices');
        }
      });
    }
  };

  const viewSenior = () => {
    if (senior) {
      history.push(`/management/seniors/${senior.wearerId}`)
    }
  }

  const connectSenior = () => {
    console.log('clicked')
    setIsOpenConnectSenior(true);
  }

  const closePopup = (selectedSenior) => {
    console.log(selectedSenior)
    if (selectedSenior && selectedSenior.wearerId) {
      queryClient.invalidateQueries('specificDevice')
    }
    setIsOpenConnectSenior(false);
  };


  return (
    <>
      {
        data ? (

          <DeviceDetailContainer>
            <Form
              form={form}
              colon={false}
              name="deviceDetail"
              labelCol={{
                span: 3,
              }}
              wrapperCol={{
                span: 21,
              }}
              autoComplete="off"
              scrollToFirstError
            >
              <DeviceItem>
                <Form.Item label=" ">
                  <span className="senior-name">{device?.deviceUid}</span>
                </Form.Item>
              </DeviceItem>
              <DeviceItem>
                <Form.Item label="Activated At">
                  <span>{format(new Date(device?.createdDate ||''), 'yyyy LLL dd, hh:mmaaa')}</span>
                </Form.Item>
                <Form.Item label="Updated At">
                  <span>{format(new Date(device?.modifiedDate ||''), 'yyyy LLL dd, hh:mmaaa')}</span>
                </Form.Item>
              </DeviceItem>
              <div>
                {senior ? (
                  <div>
                    <DeviceItem>
                      <Form.Item label="Senior">
                        <span>{senior.name}</span>
                        <Button className="detail-btn" onClick={viewSenior}>Detail</Button>
                      </Form.Item>
                    </DeviceItem>
                    <DeviceItem>
                      <Form.Item label="Main Carer">
                        {
                          getSeniorMainCarers(senior).join(', ')
                        }
                      </Form.Item>
                      <Form.Item label="* Sub Carer">
                        {
                          getSeniorSubCarers(senior).join(', ')
                        }
                      </Form.Item>
                    </DeviceItem>
                  </div>
                ) : (
                  <div>
                    <DeviceItem>
                      <Form.Item label="Senior">
                        <Button
                          className="connect-senior-btn"

                          disabled={!device}
                          onClick={connectSenior}>Connect Senior</Button>
                      </Form.Item>
                    </DeviceItem>
                    <DeviceItem>
                      <Form.Item label="Main Carer">
                        <span></span>
                      </Form.Item>
                      <Form.Item label="* Sub Carer">
                        <span></span>
                      </Form.Item>
                    </DeviceItem>
                  </div>
                )}
              </div>
              <DeviceItem>
                <Form.Item label="Device Type">
                  <span>Watch</span>
                </Form.Item>
                <Form.Item label="Belongs to">
                  <span>Care Center 1</span>
                </Form.Item>
              </DeviceItem>
              <DeviceItem>
                <Form.Item label="FW version">
                  <span>{device?.deviceVersion}</span>
                  <Button disabled className="detail-btn" onClick={onUpdateFirmware}>
                    Update
                  </Button>
                </Form.Item>
                <Form.Item label="Sim state">
                  <span>Active (Stock/Ready/Active/Scrap)</span>
                </Form.Item>
                <Form.Item label="Subscription">
                  <span>{device?.subscription}</span>
                </Form.Item>
              </DeviceItem>
              <DeviceItem>
                <Form.Item label="Fall">
                  <span>On (Sensitivity : Mid)</span>
                </Form.Item>
                <Form.Item label="Geo-fence">
                  <span>
                    {device?.geofences.join(', ')}
                  </span>
                </Form.Item>
                <Form.Item label="Heart Rate">
                  <span>{device?.healthRate?.toString()}</span>
                  <Button className="setting-btn" onClick={onSettingMenu}>
                    Go to Setting Menu
                  </Button>
                </Form.Item>
                <Form.Item label="SpO2">
                  <span>On</span>
                </Form.Item>
              </DeviceItem>
              <DeviceItem>
                <Form.Item label="Power">
                  <span>On/Off</span>
                </Form.Item>
                <Form.Item label="Battery">
                  <span>{device?.battery}</span>
                </Form.Item>
                <Form.Item label="Wearing">
                  <span>Wearing/Took off</span>
                </Form.Item>
                <Form.Item label="Location">
                  <span>Home/Out</span>
                </Form.Item>
              </DeviceItem>
              <DeviceItem>
                <Form.Item label="Memo">
                  <TextArea value="" autoSize={{ minRows: 10, maxRows: 20 }} />
                </Form.Item>
              </DeviceItem>
              <DeviceItem className="button-container">
                <Button danger type="primary" loading={isDeleting} onClick={() => setIsOpenDelete(true)}>Delete Device</Button>
              </DeviceItem>
            </Form>
            <ConfirmPopup
              title={`Warning`}
              setIsOpen={setIsOpenDelete}
              isOpen={isOpenDelete}
              handleConfirm={handelDeleteConfirm}
              message={`${senior ? "The connection to the senior will break. " : ""}Are you sure you want to delete it?`}
            />
            {isOpenConnectSenior && device && (
              <ConnectSeniorPopup
                deviceId={device.deviceId}
                onClose={closePopup}
                isOpen={isOpenConnectSenior}
                setIsOpen={setIsOpenConnectSenior}
              />
            )}
          </DeviceDetailContainer>
        ) : (
          <div className="row-flex justify-center">
            <Spin />
          </div>
        )
      }
    </>
  );
};

export default DeviceDetail;

const DeviceDetailContainer = styled.div`
  padding: 10px 20px;
  .ant-form-item {
    margin-bottom: 0px;
  }
  .ant-form-item-label {
    padding-right: 40px;
  }
  .button-container {
    display: flex;
    justify-content: center;
    border-bottom: none;
  }
`;
const DeviceItem = styled.div`
  border-bottom: 2px solid lightgray;
  padding: 10px 10px;
  .senior-name {
    font-size: 20px;
    font-weight: bold;
  }
  .ant-form-item-label > label {
    color: gray !important;
  }
  .detail-btn {
    margin-left: 20px;
    border-radius: 20px;
    width: 100px;
  }
  .setting-btn {
    margin-left: 50%;
    border-radius: 20px;
  }
  .connect-senior-btn {
    padding: 0px 40px;
    border-radius: 20px;
  }
`;
