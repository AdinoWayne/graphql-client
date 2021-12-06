import { Table } from "antd";
import React, { useEffect, useState } from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { DateUtils } from "react-day-picker";
import dateFnsFormat from "date-fns/format";
import dateFnsParse from "date-fns/parse";
import {
  useQueryString,
  useRemoveQueryParam,
  useSetMultiQueryParam,
} from "services/queryString";
import styled from "styled-components";
import { checkDate } from "services/string";
import { END_DATE, FORMAT, START_DATE } from "services/constants";
import { getDate, getMonth } from "services/date";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const currentYear = new Date().getFullYear();
const fromMonth = new Date(currentYear, 0);
const toMonth = new Date(currentYear + 10, 11);
function YearMonthForm({ date, localeUtils, onChange }) {
  const months = localeUtils.getMonths();

  const years: any[] = [];
  for (let i = fromMonth.getFullYear(); i <= toMonth.getFullYear(); i += 1) {
    years.push(i);
  }

  const handleChange = function handleChange(e) {
    const { year, month } = e.target.form;
    onChange(new Date(year.value, month.value));
  };

  const handleNextMonth = () => {
    if (date.getMonth() !== 11) {
      onChange(new Date(date.getFullYear(), date.getMonth() + 1));
    }
  }

  const handlePrevMonth = () => {
    if (date.getMonth() !== 0) {
      onChange(new Date(date.getFullYear(), date.getMonth() - 1));
    }
  }

  const handleNextYear = () => {
    if (date.getFullYear() !== years[years.length -1]) {
      onChange(new Date(date.getFullYear() + 1, date.getMonth()));
    }
  }

  const handlePrevYear = () => {
    if (date.getFullYear() !== years[0]) {
      onChange(new Date(date.getFullYear() - 1, date.getMonth()));
    }
  }

  return (
    <form className="DayPicker-Caption">
      <SelectMonthAndYear>
        <SelectMonth>
          <IoIosArrowUp className="arrow-icon" onClick={handleNextMonth}></IoIosArrowUp>
          <select name="month" onChange={handleChange} value={date.getMonth()}>
            {months.map((month, i) => (
              <option key={month} value={i} className="option-month">
                {month}
              </option>
            ))}
          </select>
          <IoIosArrowDown className="arrow-icon" onClick={handlePrevMonth}></IoIosArrowDown>
        </SelectMonth>
        <SelectYear>
          <IoIosArrowUp className="arrow-icon" onClick={handleNextYear}></IoIosArrowUp>
          <select
            name="year"
            onChange={handleChange}
            value={date.getFullYear()}
          >
            {years.map((year) => (
              <option key={year} value={year} className="option-month">
                {year}
              </option>
            ))}
          </select>
          <IoIosArrowDown className="arrow-icon" onClick={handlePrevYear}></IoIosArrowDown>
        </SelectYear>
      </SelectMonthAndYear>
    </form>
  );
}

const DeviceFilterDate: React.FC = () => {
  const dataSource = [
    {
      key: "1",
    },
  ];

  const [data, setData] = useState<{ param: string; date: string }>({
    param: "",
    date: "",
  });

  const [dateStart, setDateStart] = useState<string | null>(null);
  const [dateEnd, setDateEnd] = useState<string | null>(null);
  const [month, setMonth] = useState<Date>(fromMonth);

  const setMultiQueryParam = useSetMultiQueryParam();

  const defaultDate = (date: string, type?: string): Date => {
    const value = checkDate(date);
    if (value === "") {
      if (type === START_DATE) {
        const value = new Date(
          new Date().getFullYear(),
          new Date().getMonth() - 1,
          new Date().getDate()
        );
        return value;
      }
      const value = new Date();
      return value;
    }
    return new Date(date);
  };

  const removeQueryParam = useRemoveQueryParam();

  const startDate = defaultDate(useQueryString(START_DATE), START_DATE);

  const endDate = defaultDate(useQueryString(END_DATE), END_DATE);

  useEffect(() => {
    if (dateStart) {
      setMultiQueryParam([START_DATE, "page"], [dateStart, "1"]);
    } else {
      if (dateStart !== null) {
        removeQueryParam(START_DATE, "");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateStart]);

  useEffect(() => {
    if (dateEnd) {
      setMultiQueryParam([END_DATE, "page"], [dateEnd, "1"]);
    } else {
      if (dateEnd !== null) {
        removeQueryParam(END_DATE, "");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateEnd]);

  const handleDayChangeStartDate = (day: Date): void => {
    if (day) {
      const dd = getDate(day);
      const mm = getMonth(day);
      const yyyy = day.getFullYear();
      const date = `${yyyy}-${mm}-${dd}`;
      setData({
        param: START_DATE,
        date: date,
      });
    } else if (day === undefined) {
      setData({
        param: START_DATE,
        date: "",
      });
    }
  };

  const handleSearchQuery = (): void => {
    if (data.param === START_DATE) {
      setDateStart(data.date);
    }
    if (data.param === END_DATE) {
      setDateEnd(data.date);
    }
    setData({ param: "", date: "" });
  };

  const handleDayChangeEndDate = (day: Date) => {
    if (day) {
      const dd = getDate(day);
      const mm = getMonth(day);
      const yyyy = day.getFullYear();
      const date = `${yyyy}-${mm}-${dd}`;
      setData({
        param: END_DATE,
        date: date,
      });
    } else if (day === undefined) {
      setData({
        param: END_DATE,
        date: "",
      });
    }
  };

  const parseDate = (str: string, format: string, locale: any): Date | void => {
    const parsed = dateFnsParse(str, format, new Date(), { locale });
    if (DateUtils.isDate(parsed)) {
      return parsed;
    }
    return undefined;
  };

  const formatDate = (date: Date, format: string, locale: any): string => {
    return dateFnsFormat(date, format, { locale });
  };

  const handleYearMonthChange = (date: Date): void => {
    setMonth(date);
  };

  const columnsSource = [
    {
      title: "start date",
      dataIndex: "startDate",
      key: "startDate",
      render: (): React.ReactElement => (
        <div className="day-picker">
          <span className="icon-calendar-date"></span>
          <DayPickerInput
            inputProps={{ readOnly: true }}
            formatDate={formatDate}
            format={FORMAT}
            parseDate={parseDate}
            value={startDate}
            onDayPickerHide={handleSearchQuery}
            onDayChange={handleDayChangeStartDate}
            dayPickerProps={{
              month: month,
              fromMonth: fromMonth,
              toMonth: toMonth,
              captionElement: ({ date, localeUtils }) => (
                <DateSelectArea>
                  <div className="today-date">
                    Today
                    <p>{getDate(startDate)}</p>
                  </div>
                  <YearMonthForm
                    date={date}
                    localeUtils={localeUtils}
                    onChange={handleYearMonthChange}
                  />
                </DateSelectArea>
              ),
            }}
          />
        </div>
      ),
    },
    {
      title: "end date",
      dataIndex: "endDate",
      key: "endDate",
      render: (): React.ReactElement => (
        <div className="day-picker">
          <span className="icon-calendar-date"></span>
          <DayPickerInput
            inputProps={{ readOnly: true }}
            formatDate={formatDate}
            format={FORMAT}
            parseDate={parseDate}
            value={endDate}
            onDayPickerHide={handleSearchQuery}
            onDayChange={handleDayChangeEndDate}
            dayPickerProps={{
              month: month,
              fromMonth: fromMonth,
              toMonth: toMonth,
              captionElement: ({ date, localeUtils }) => (
                <DateSelectArea>
                  <div className="today-date">
                    Today
                    <p>{getDate(endDate)}</p>
                  </div>
                  <YearMonthForm
                    date={date}
                    localeUtils={localeUtils}
                    onChange={handleYearMonthChange}
                  />
                </DateSelectArea>
              ),
            }}
          />
        </div>
      ),
    },
  ];
  return (
    <DeviceFilterDateComponent>
      <Table
        bordered
        pagination={{ position: [] }}
        size="small"
        dataSource={dataSource}
        columns={columnsSource}
      />
    </DeviceFilterDateComponent>
  );
};

const DeviceFilterDateComponent = styled.div`
  .ant-table-container {
    border: none !important;
  }
  table {
    border: none !important;
  }
  .ant-table-cell {
    border: none !important;
    background-color: white !important;
  }
  .day-picker input {
    border-radius: 20px;
    border: 1px solid lightgray;
    color: #a6a4a4;
    line-height: 30px;
    text-align: center;
    width: 165px;
  }
  .day-picker input:focus {
    outline: none!important;
    box-shadow: 0 0 0 3px rgb(164 202 254 / 45%);
    border-color: #A4CAFE!important;
    outline-offset: 0;
  }
  .icon-calendar-date {
    position: absolute;
    font-size: 15px;
    top: 17px;
    left: 25px;
    color: #a8a5a5;
  }
  .DayPicker-NavButton {
    display: none !important;
  }
`;

const DateSelectArea = styled.div`
  display: flex;
  text-align: center;
  .today-date {
    padding-top: 10px;
    font-weight: 500;
    color: black;
  }
`;
const SelectMonthAndYear = styled.div`
  display: flex;
  flex-direction: row;
  .arrow-icon {
    font-size: 15px;
    margin: auto;
  }
  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    border: 0px;
    outline: 0px;
    font-weight: 500;
    .option-month {
      text-align: center;
    }
  }
`;
const SelectMonth = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 15px;
  color: black;
  width: auto;
`;
const SelectYear = styled.div`
  display: flex;
  flex-direction: column;
  color: black;
`;

export default DeviceFilterDate;
