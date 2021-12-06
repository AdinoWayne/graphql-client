import React from 'react';
import { Layout as AntLayout, Col, Typography } from 'antd';
import styled from 'styled-components';
import Button from 'components/Button/Button';

const Footer: React.FC = () => {
    return (
        <>
            <FooterContainer
            >
                <FooterContent>
                    <ColRightTop span={24}>
                        <FooterText>
                            {LANG.TEXT_FOOTER_CUSTOMER_SERVICE}
                        </FooterText>
                        <Button>{LANG.TEXT_PRIVACY_POLICY}</Button>
                        <Button>{LANG.TEXT_SITE_MAP}</Button>
                        <Button>{LANG.TEXT_TERM_OF_SERVICE}</Button>
                    </ColRightTop>
                </FooterContent>
            </FooterContainer>
        </>
    )
}

const LANG = {
    TEXT_FOOTER_CUSTOMER_SERVICE: 'Customer Service 1588-1588',
    TEXT_PRIVACY_POLICY: 'Privacy Policy',
    TEXT_SITE_MAP: 'Site Map',
    TEXT_TERM_OF_SERVICE: 'Terms Of Service',
}

const FooterContainer = styled(AntLayout.Footer)`
    background-color: #f6f6f6;
    height: 64px;
    padding: 0;
    display: flex;
    align-items: center;
`

const FooterContent = styled.div`
    display: flex;
    justify-content: center;
    margin: auto;
    max-width: 600px;
`

const FooterText = styled(Typography.Text)`
    line-height: 32px;
    margin-right: 20px;
`

const ColRightTop = styled(({children, ...rest}) => <Col {...rest} >{children}</Col>)`
    display: flex;
    justify-content: end;
    & button {
        margin-left: 5px
    }
`

export default Footer;
