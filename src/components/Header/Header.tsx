import React from 'react';
import { Layout as AntLayout, Row, Col, Typography, Menu, Dropdown } from 'antd';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Button from 'components/Button/Button';
import { useEvent } from 'services/seniorService';

interface UserLogin {
    isLogin: boolean,
    user: {
        name: string | null
    }
}

const Header: React.FC = () => {
    const dataLogin: UserLogin = {
        isLogin: true,
        user: {
            name: localStorage.getItem('user')
        }
    }

    const { data } = useEvent();
    const menu = () => {
        if (!(data && data.event && data.event.events.length > 0)) {
            return (<></>);
        }
        return (
            <Menu>
                {
                    data.event.events.map(element => (
                        <Menu.Item key={element._id}>
                            <Typography>
                            {
                                element.type === 'LIKE' ?
                                `Someone like your post(${element.postId.toString()})` :
                                `Someone comment your post(${element.postId.toString()})`
                            }
                            </Typography>
                        </Menu.Item>
                    ))
                }
            </Menu>
        )
    };

    return (
        <>
            <HeaderContainer
            >
                <Row>
                    <Col span={24}>
                        <Row>
                            <ColLogin xs={{ span: 24 }} lg={{ span: 12, offset: 12 }}>
                                {
                                    dataLogin.isLogin ? 
                                    (
                                        <Typography.Text>{LANG.TEXT_HELLO} {dataLogin.user.name}</Typography.Text>
                                    ) : (
                                        <Link to={CONSTANCE.URL.LOGIN}>{LANG.TEXT_LOGIN}</Link>
                                    )
                                }
                                <Link to={CONSTANCE.URL.SIGN_UP}>{LANG.TEXT_SIGN_UP}</Link>
                            </ColLogin>
                        </Row>
                        <ColRightTop>
                            <Dropdown overlay={menu} placement="bottomRight">
                                <Button className='notification'>{LANG.TEXT_NOTIFICATIONS}</Button>
                            </Dropdown>
                        </ColRightTop>
                    </Col>
                </Row>
            </HeaderContainer>
        </>
    )
}

const LANG = {
    TEXT_HELLO: 'Hello,',
    TEXT_LOGIN: 'Login',
    TEXT_SIGN_UP: 'Sign Up',
    TEXT_SUPPORT: 'Support',
    TEXT_NOTIFICATIONS: 'Notifications',
    TEXT_MY_PAGE: 'My Page',
}

const CONSTANCE = {
    URL: {
        LOGIN: '/login',
        SIGN_UP: '/sign-up'
    }
}

const HeaderContainer = styled(AntLayout.Header)`
    background-color: #f6f6f6;
    border-bottom: 1px solid #e7e7e7;
    height: 90px;
    & .notification-number {
        margin-left: 5px;
        border-radius: 50%;
        width: 15px;
        font-size: 9px;
        background-color: #ff6865;
        color: #fff;
    }
`

const ColLogin = styled(({children, ...rest}) => <Col {...rest} >{children}</Col>)`
    height: 45px;
    display: flex;
    justify-content: end;
    align-item: center;
    & a, span {
        margin-left: 20px;
        line-height: 45px;
    }
`
const ColRightTop = styled(({children, ...rest}) => <Col {...rest} >{children}</Col>)`
    display: flex;
    justify-content: end;
    & button {
        margin-left: 5px
    }
`

export default Header;