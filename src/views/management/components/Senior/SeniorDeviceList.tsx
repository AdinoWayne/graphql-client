import { Button } from 'antd';
import api from 'api';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import ConnectPopup from './ConnectPopup';
import styled from 'styled-components';

const SeniorDeviceList = (props: { wearerId: string, devices: { deviceName: string }[] }) => {
    const { wearerId, devices } = props;

    const [isOpenConnect, setIsOpenConnect] = useState<boolean>(false);

    const [localDevices, setLocalDevices] = useState<any[]>([]);

    useEffect(() => {
        setLocalDevices(devices);
    }, [devices])

    const history = useHistory();

    const handleRefresh = async () => {
        const { data } = await api.get(`/seniors/${wearerId}`);
        setLocalDevices(data.data.devices);
    }

    const connectDevice = (value: string) => {
        setIsOpenConnect(true);
    }

    const closePopup = () => {
        setIsOpenConnect(false);
    };

    return (
        <>
            <div>
                <DeviceList>
                    <div>
                        {localDevices !== null && localDevices.map((device: any, index: number) => (
                            <div className="device-item" key={index}>
                                <span>
                                    {index + 1}. Watch
                                </span>
                                <Button className="detail-button" onClick={() => {
                                    history.push(`/management/devices/${device.deviceId}`)
                                }}>Detail</Button>
                            </div>
                        ))}
                    </div>

                    <div className="device-button">
                        <Button className="btn-device" onClick={() => connectDevice("watch")}>+ Watch</Button>
                        <Button className="btn-device" onClick={() => connectDevice("hub")}>+ Hub</Button>
                    </div>
                </DeviceList>

            </div>
                <ConnectPopup
                    seniorId={wearerId}
                    callbackFn={handleRefresh}
                    onClose={closePopup}
                    isOpen={isOpenConnect}
                    setIsOpen={setIsOpenConnect} />
        </>
    )
}

export default SeniorDeviceList;

const DeviceList = styled.div`
display: flex;
.device-button {
    padding-left: 30%;
    .btn-device {
        width: 120px !important;
        border-radius: 8px !important;
        margin-left: 20px !important;
    }
}
`