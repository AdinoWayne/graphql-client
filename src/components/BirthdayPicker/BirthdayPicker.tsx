import { Modal, Space } from 'antd';
import Button from 'components/Button/Button';
import { format } from 'date-fns';
import React, { useCallback, useState, useEffect } from 'react';
import { MONTHS } from 'services/constants';
import { getDateObj, isInvalidDate } from 'services/date';
import styled from 'styled-components';
import Picker from './Picker';

interface BirthdayPickerProps {
    setBirthday: any;
    birthday: string | null;
}

const BirthdayPicker = ({ setBirthday, birthday }: BirthdayPickerProps) => {

    const [visible, setVisible] = useState(false);
    const [day, setDay] = useState<number | null>(15);
    const [month, setMonth] = useState<number | null>(4);
    const [year, setYear] = useState<number | null>(1950);

    // const invalid = isInvalidDate(date);

    // const [currentDate, setCurrentDate] = useState( invalid ? null: new Date(date));
    // useEffect(() => {
    //     setCurrentDate(new Date(date));
    // }, [date])

   
    useEffect(() => {
        const date = getDateObj(birthday);
        const invalid = isInvalidDate(date)
        if(!invalid && birthday) {
            let date = new Date(birthday);
            setDay(d => date.getDate());
            setMonth(m => date.getMonth());
            setYear(y => date.getFullYear());
        } else {
            setDay(1);
            setMonth(5);
            setYear(1950);
        }
    }, [birthday, visible])


    const onClickSave = () => {

        if(year && (month || month == 0) && day) {
            let date = new Date(year, month, day);
            if(isInvalidDate(date)) {
               setBirthday(null); 
            } else {
                setBirthday(`${year}-${month + 1}-${day}`);
            }
        }
        setVisible(false);

    }

    const monthFormater = (val: number) => {
        return MONTHS[val];
    }

    const openPopup = () => {
        setVisible(true);
    }

    const closePopup = useCallback(() => {
        setVisible(false)
    }, [])

    const displayDate = isInvalidDate(getDateObj(birthday)) ? '- - -' : `${format(getDateObj(birthday)!, "yyyy LLL dd")}`
    return (
        <Wrapper>
            <BirthdayPickerLabel onClick={openPopup}>{displayDate}</BirthdayPickerLabel>

            <Modal
                title={null}
                visible={visible}
                footer={null}

                modalRender={() => (
                    <PopupContainer className="modal-content">
                        <div className="picker-container"
                        >

                            <Picker
                                defaultValue={day}
                                min={1}
                                max={31}
                                onChange={val => setDay(val)}
                            />
                            <Picker
                                defaultValue={month}
                                min={0}
                                max={11}
                                onChange={(val) => setMonth(val)}
                                formater={monthFormater}
                            />
                            <Picker
                                defaultValue={year}
                                min={1900}
                                max={new Date().getFullYear()}
                                onChange={(val) => setYear(val)}
                            />
                        </div>
                        <div
                            className="text-center mt20"
                        >
                            <Space>
                                <Button type="primary"
                                    onClick={onClickSave}
                                >Ok</Button>
                                <Button type="text"
                                    onClick={closePopup}
                                >Cancel</Button>
                            </Space>
                        </div>
                    </PopupContainer>
                )}
            />
        </Wrapper>
    )
}

export default BirthdayPicker;

const Wrapper = styled.div`

`
const BirthdayPickerLabel = styled.span`
    display: inline-flex;
    padding: 4px 0px;
    border: 1px solid transparent;
    border-radius: 4px;
    &:hover {
        border-color: #ccc;
    }
`
const PopupContainer = styled.div`
    width: 350px;
    border-radius: 6px;
    padding: 12px;
    background-color: #fff;
    pointer-events: all;
    display: flex;
    flex-direction: column;
    .picker-container {
        display: grid;
        grid-auto-flow: row;
        grid-template-columns: 1fr 1.5fr 1fr;
    }

    .picker-button {

    }
   
`


