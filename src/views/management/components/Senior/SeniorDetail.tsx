import React, { useState, ChangeEvent, useEffect, useRef } from "react";
import styled from "styled-components";
import { Button, Form, Input, Radio, RadioChangeEvent } from "antd";
import { BiTrash } from "react-icons/bi";
import { useHistory } from 'react-router-dom';
import BirthdayPicker from "components/BirthdayPicker/BirthdayPicker";
import { useGetSpecificSenior, Tag, useDeleteListSenior } from "services/seniors/seniorService";
import format from 'date-fns/format';
import { useModifySenior } from "hooks/useModifySenior";
import { UserWearers } from "services/types";
import SeniorDeviceList from "./SeniorDeviceList";
import ConfirmPopup from "views/management/components/dialog/ConfirmPopup";
import { isNumeric } from "services/string";
import { phoneValidate } from "services/formServices";

const formatDate = (date: string) => {
  if (!date) {
    return new Date();
  }
  return format(new Date(date), 'LLL dd yyyy, hh:mmaaa');
}

const formatText = (text: any, valueDefault: any) => {
  if (!text) {
    return valueDefault;
  }
  return text;
}

const formatCarer = (data: Array<UserWearers>, type: string): string => {
  if (!data) {
    return "----";
  }
  const Carer = data.find(el => el.userWearerType === type)
  if (Carer) {
    return Carer.user?.nickName;
  }
  return "----";
}

const { TextArea } = Input;

const SeniorDetail: React.FC = () => {
  const [SUB, MAIN] = ['SUB', 'MAIN'];
  const url = window.location.pathname;
  const id = url.substring(url.lastIndexOf('/') + 1);

  const { isLoading: deleteLoading, mutate: removeSeniors } = useDeleteListSenior();

  const { mutate: modifySenior, isLoading: modifyLoading } = useModifySenior();

  const { data } = useGetSpecificSenior(id);

  const history = useHistory();

  const [devices, setDevices] = useState<{ deviceName: string }[]>([]);
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const [isValid, setValid] = useState(true);
  
  const [birthday, setBirthday] = useState<string | null>(null);
  let once = useRef(false);
  useEffect(() => {
    if (data) {
      setSenior((preSenior) => ({
        ...preSenior,
        name: data.data.name,
        wearerId: formatText(data.data.wearerId, preSenior.wearerId),
        createdDate: formatDate(data.data.createdDate),
        mainCarer: formatCarer(data.data.userWearers, MAIN),
        subCarer: formatCarer(data.data.userWearers, SUB),
        mobile: formatText(data.data.mobile, preSenior.mobile),
        address: formatText(data.data.address, preSenior.address),
        subMobile: formatText(data.data.subMobile, preSenior.subMobile),
        height: formatText(data.data.height, preSenior.height),
        weight: formatText(data.data.weight, preSenior.weight),
        genderType: formatText(data.data.genderType, preSenior.genderType),
        description: data.data.description
      }));

      setBirthday(data.data.birth);
      //chỉ set device lần đầu
      if (!once.current) {
        if (data.data.devices) {
          setDevices(data.data.devices);
          once.current = true;
        }
      }
    }
  }, [MAIN, SUB, data]);

  const [senior, setSenior] = useState<any>({
    name: "----",
    wearerId: "--",
    createdDate: "--- -- ---- 00:00am",
    mainCarer: "----",
    subCarer: "----",
    site: "Care Center 1",
    tag: [
      { name: "Care Center 1 - A group" }
    ],
    mobile: "",
    subMobile: "----",
    birth: format(new Date(), 'yyyy LLL dd'),
    address: "",
    dateOfBirth: "1950 JUL 13",
    genderType: null,
    height: "",
    weight: "",
    devices: [],
    healthAndInactivity: "TBD",
    reminder: "TBD"
  });

  const {
    createdDate,
    mainCarer,
    subCarer,
    site,
    tag,
    healthAndInactivity,
    reminder,
  } = senior;

  const [form] = Form.useForm();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (
      ["height", "weight"].indexOf(e.target.name) > -1 &&
      !isNumeric(e.target.value) &&
      e.target.value !== ""
    ) {
      return;
    }
    const newSenior = { ...senior, [e.target.name]: e.target.value };
    setSenior(newSenior);
  };

  const handleSave = () => {
    const params: any = {};
    params.birth = birthday;
    const columns: Array<string> = ["mobile", "address", "height", "weight", "genderType", "description"]
    for (let i = 0; i < columns.length; i++) {
      if (senior[columns[i]] && senior[columns[i]] !== data?.data[columns[i]]) {
        params[columns[i]] = senior[columns[i]];
      }
    }
    modifySenior({
      seniorId: senior.wearerId,
      data: params
    });
  }

  const handelDeleteConfirm = ():void => {
    removeSeniors([id], {
      onSettled: () => {
        history.push('/management/seniors');
      }
    });
  };

  const onChangeMemo = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setSenior({ ...senior, description: e.target.value });
  };

  const onRadioChange = (e: RadioChangeEvent): void => {
    setSenior({ ...senior, genderType: e.target.value });
  };

  const phoneValidator = async (value: any) => {
    let dataCheck = phoneValidate(senior.mobile);
    if (dataCheck.isValid) {
      setValid(true);
      return true;
    } else {
      setValid(false);
      return Promise.reject(dataCheck.message);
    }
  };

  return (
    <SeniorDetailContainer>
      <Form
        form={form}
        colon={false}
        name="seniorDetail"
        labelCol={{
          span: 3,
        }}
        wrapperCol={{
          span: 21,
        }}
        autoComplete="off"
        scrollToFirstError
      >
        <SeniorItem>
          <Form.Item label="* Name" rules={[{ required: true }]}>
            <span className="senior-name">{senior.name}</span>
          </Form.Item>
        </SeniorItem>
        <SeniorItem>
          <Form.Item label="Senior ID">
            <span>{senior.wearerId}</span>
          </Form.Item>
          <Form.Item label="Created At">
            <span>{createdDate}</span>
          </Form.Item>
        </SeniorItem>
        <SeniorItem>
          <Form.Item label="Main Carer">
            <span>{mainCarer || 'N/A'}</span>
          </Form.Item>
          <Form.Item label="Sub carer">
            <span>{subCarer || 'N/A'}</span>
          </Form.Item>
        </SeniorItem>
        <SeniorItem>
          <Form.Item label="* Site" rules={[{ required: true }]}>
            <span>{site}</span>
          </Form.Item>
          <Form.Item label="Tag">
            <div className="tag-area">
              <div className="tag-list">
                {tag.map((item: Tag) => (
                  <div className="tag-item" key={item.name}>
                    <div className="tag-input">
                      <span className="tag-input-name">{item.name}</span>
                      <span className="icon-circle-minus btn-remove-tag"></span>
                    </div>
                    <span className="icon-plus btn-add-tag"></span>
                  </div>
                ))}
              </div>
            </div>
          </Form.Item>
        </SeniorItem>
        <SeniorItem>
          <Form.Item 
            label="Phone"
            name="mobile"
            rules={[{ validator: phoneValidator }]}
          >
            <Input
              name="mobile"
              placeholder="+1 23456789"
              value={senior.mobile}
              maxLength={20}
              onChange={(e) => handleInputChange(e)}
              className="edit-input-item"
            />
          </Form.Item>
          <Form.Item label="Address">
            <Input
              name="address"
              value={senior.address}
              onChange={(e) => handleInputChange(e)}
              className="edit-input-item"
            />
          </Form.Item>
        </SeniorItem>
        <SeniorItem>
          <Form.Item label="Date of birth">
            <BirthdayPicker birthday={birthday} setBirthday={setBirthday} />
          </Form.Item>
          <Form.Item name="radio-group" label="Gender">
            <Radio.Group defaultValue={senior.genderType} key={senior.genderType} onChange={onRadioChange} className="radio-gr">
              <Radio value="M" >Male</Radio>
              <Radio value="F" >Female</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Height">
            <Input
              name="height"
              value={senior.height}
              placeholder="cm"
              onChange={(e) => handleInputChange(e)}
              className="edit-input-item"
            />
          </Form.Item>
          <Form.Item label="Weight">
            <Input
              name="weight"
              value={senior.weight}
              placeholder="kg"
              onChange={(e) => handleInputChange(e)}
              className="edit-input-item"
            />
          </Form.Item>
        </SeniorItem>
        <SeniorItem>
          <Form.Item label="[Device List]">
            <SeniorDeviceList
              devices={devices}
              wearerId={id}
            />
          </Form.Item>
        </SeniorItem>
        <SeniorItem>
          <Form.Item label="Health & Inactivity">
            <span>{healthAndInactivity}</span>
          </Form.Item>
          <Form.Item label="Reminder">
            <span>{reminder}</span>
          </Form.Item>
        </SeniorItem>
        <SeniorItem>
          <Form.Item label="Memo">
            <TextArea value={senior.description} onChange={(e) => onChangeMemo(e)} autoSize={{ minRows: 10, maxRows: 20 }} />
          </Form.Item>
        </SeniorItem>
        <SeniorItem className="button-container">
          <Button type="primary" disabled={!isValid} loading={modifyLoading} onClick={handleSave}>Save</Button>
          <Button type="primary" loading={deleteLoading} danger onClick={() => setIsOpenDelete(true)}>
            <BiTrash /> Delete Senior
          </Button>
        </SeniorItem>
      </Form>
      <ConfirmPopup
        title={`Warning`}
        setIsOpen={setIsOpenDelete}
        isOpen={isOpenDelete}
        handleConfirm={handelDeleteConfirm}
        message={`Are you sure you want to delete it?`}
      />
    </SeniorDetailContainer>
  );
};

export default SeniorDetail;

const SeniorDetailContainer = styled.div`
  padding: 10px 20px;
  .ant-form-item-label {
    padding-right: 40px;
  }
  .button-container {
    display: flex;
    justify-content: center;
    border-bottom: none;
    .ant-btn-primary {
      border-radius: 7px;
      margin-left: 30px;
      padding: 0px 35px;
    }
  }
`;
const SeniorItem = styled.div`
  border-bottom: 2px solid lightgray;
  padding-top: 10px;
  .senior-name {
    font-size: 20px;
    font-weight: bold;
  }
  .ant-form-item {
    margin-bottom: 10px !important;
  }
  .ant-form-item-label > label {
    color: gray !important;
  }
  .device-item {
    margin-bottom: 10px;
    .detail-button {
      width: 120px;
      border-radius: 8px;
      margin-left: 20px;
    }
  }
  .tag-area {
    display: flex;
    .tag-list {
      .tag-item {
        height: 40px;
        display: flex;
        .tag-input {
          width: fit-content;
          border-radius: 15px;
          height: 30px;
          padding: 0px 20px;
          .tag-input-name {
            margin-left: -20px;
          }
          .btn-remove-tag {
            display: none;
            color: red;
            font-size: 20px;
            position: relative;
            top: 5px;
            left: 10px;
          }
        }
        .btn-add-tag {
          display: none;
          position: relative;
          font-size: 17px;
          border: 1px solid #ebebeb;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          text-align: center;
          padding: 5px;
        }
      }
      .tag-item:hover {
        .tag-input {
          margin-left: -10px;
          margin-bottom: 5px;
          background-color: lightgray;
          .tag-input-name {
            margin-left: -10px;
            transition: all .5s ease;
          }
          .btn-remove-tag {
            display: inline;
          }
        }
        .btn-add-tag {
          margin-left: 10px;
          display: block;
        }
      }
    }
  }
  .edit-input-item {
    border: 1px solid #ccc;
    outline: none;
    padding: 4px 8px;
    line-height: 20px;
    border-radius: 6px;
  }
`;
