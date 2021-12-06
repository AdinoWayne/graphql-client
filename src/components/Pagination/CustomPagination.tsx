import { Button, Pagination } from "antd";
import { useQueryNumber, useSetQueryParam } from "services/queryString";
import styled from "styled-components";
import { GrPrevious, GrNext } from "react-icons/gr";

interface Props {
  current: number;
  total: number;
  onChange: (page: number) => void;
}

const CustomPagination = ({ current, total }: Props) => {
  const setQueryParam = useSetQueryParam();
  const handleSelectChange = (page: number) => {
    setQueryParam("page", page.toString());
  };

  const MAX_PAGE_INDEX = Math.ceil(total / 10);
  const handlePrevPage = () => {
    let pageIndex = 1;
    if (current <= 10) {
      setQueryParam("page", pageIndex.toString());
    } else {
      pageIndex = current - 10;
      setQueryParam("page", pageIndex.toString());
    }
  };

  const handleNextPage = () => {
    if (current + 10 >= MAX_PAGE_INDEX) {
      setQueryParam("page", MAX_PAGE_INDEX.toString());
    } else {
      setQueryParam("page", (current + 10).toString());
    }
  };

  return (
    <PaginationArea>
      <div className="pagination-area">
        <Button
          className={
            current === 1 ? "pagination-button-disable" : "pagination-button"
          }
          onClick={handlePrevPage}
          disabled={current === 1 ? true : false}
        >
          <span className="icon-prev pagination-icon"></span>
        </Button>
        <Pagination
          current={current}
          total={total}
          onChange={handleSelectChange}
        />
        <Button
          className={
            current === MAX_PAGE_INDEX
              ? "pagination-button-disable"
              : "pagination-button"
          }
          onClick={handleNextPage}
          disabled={current === MAX_PAGE_INDEX ? true : false}
        >
          <span className="icon-next pagination-icon"></span>
        </Button>
      </div>
    </PaginationArea>
  );
};

export default CustomPagination;

const PaginationArea = styled.div`
  .pagination-area {
    display: flex;
    .pagination-button {
      width: 30px;
      margin: 0px 7px;
      .pagination-icon {
        margin: 6px -6px;
        font-size: 10px;
      }
    }
    .pagination-button-disable {
      width: 30px;
      margin: 0px 7px;
      background-color: #ffffff;
      .pagination-icon {
        margin: 6px -6px;
        font-size: 10px;
        polyline {
            stroke: lightgray !important;
        }
      }
    }
  }
`;
