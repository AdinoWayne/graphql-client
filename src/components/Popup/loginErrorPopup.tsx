import React from "react";
import styled from "styled-components";
import Button from "components/Button/Button";

interface Props {
  message1: string;
  message2: string;
  handleClose(): any;
}
const LoginErrorPopup:React.FC<Props> = (props: Props) => {
  return (
    <ErrorContainer>
      <ErrorTitle>Log in Error</ErrorTitle>
      <ErrorMessage>
        {props.message1}
        <br></br>
        {props.message2}
      </ErrorMessage>
      <Button
        type="text"
        onClick={props.handleClose}
        className="close-popup-btn"
      >
        OK
      </Button>
    </ErrorContainer>
  );
};

export default LoginErrorPopup;

const ErrorContainer = styled.div`
  width: 250px;
  height: 300px;
  background-color: lightgray;
  text-align: center;
  position: fixed;
  top: 20%;
  left: calc(45% - 35px);
  color: black;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  transition: all ease-in .4s !important;
  .close-popup-btn {
    width: 125px;
    height: 29px;
    border-radius: 5px;
    background-color: gray;
    color: white;
    margin-left: 25%;
  }
`;

const ErrorTitle = styled.div`
  font-size: 14px;
  padding-top: 35px;
`;

const ErrorMessage = styled.div``;
