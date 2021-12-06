import React, { useState, ChangeEvent, useContext, FormEvent} from "react";
import AuthContext from "contexts/JWTAuthContext";
import { Button, Form, Input, Checkbox } from "antd";
import { useHistory } from "react-router-dom";
import {
  checkEmailOrPhoneValidate,
  checkPasswordValidate,
} from "services/formServices";
import LoginErrorPopup from "components/Popup/loginErrorPopup";
import "./style.scss";
interface User {
  emailOrPhone: string;
  password: string;
}

interface Remember {
  isRemember: boolean;
}

const Login: React.FC = () => {
  const [user, setUser] = useState<User>({
    emailOrPhone: "",
    password: ""
  });

  const [remember, setRemember] = useState<Remember>({
    isRemember: true,
  });

  const tailLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };

  const [isError, setError] = useState(false);
  const router = useHistory();
  const api = useContext(AuthContext);
  const { emailOrPhone, password } = user;
  const { isRemember } = remember;
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = () => {
    // display popup
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleCheck = () => {
    setRemember({ ...remember, isRemember: !isRemember });
  };

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    api.login(user.emailOrPhone, user.password, remember.isRemember)
      .then(() => {
        router.push("/home");
        setIsLoading(false);
      })
      .catch(() => {
        setError(true);
        setIsLoading(false);
      })
  };

  const errorMsg1 = "You're not member.";
  const errorMsg2 = "Please check again or sign up";
  const closePopup = () => {
    form.resetFields();
    setError(false);
  };

  const formValidator = async (rule: any, value: any) => {
    let dataCheck = rule.field === "password" ? checkPasswordValidate(value) : checkEmailOrPhoneValidate(value);
    if (dataCheck.isValid) {
      return true;
    } else {
      return Promise.reject(dataCheck.message);
    }
  };

  return (
    <div className="login-form-wrap">
      {!isError &&(
        <div className="form-position">
          <Form
            form={form}
            colon={false}
            name="login"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            autoComplete="off"
            onFinish={handleLogin}
            scrollToFirstError
          >
            <Form.Item
              name="emailOrPhone"
              label="Mobile or E-mail"
              rules={[{ validator: formValidator }]}
            >
              <Input
                name="emailOrPhone"
                value={emailOrPhone}
                placeholder="Mobile or E-mail"
                className="login-input"
                onChange={(e) => handleInputChange(e)}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please input your password!"}]}
            >
              <Input.Password
                name="password"
                value={password}
                placeholder="Password"
                className="login-input"
                onChange={(e) => handleInputChange(e)}
              />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Form.Item name="isRemember" noStyle>
                <Checkbox
                  name="isRemember"
                  checked={isRemember}
                  onChange={handleCheck}
                >
                  Remember me
                </Checkbox>
              </Form.Item>
            </Form.Item>
            <Form.Item className="btn-submit-area" {...tailLayout}>
              <Button className="btn-submit" htmlType="submit" loading={isLoading}>
                Log in
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
      {isError && (
        <LoginErrorPopup message1={errorMsg1} message2={errorMsg2} handleClose={closePopup} />
      )}
    </div>
  );
};

export default Login;
