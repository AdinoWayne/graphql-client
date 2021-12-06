import Footer from 'components/Footer/Footer';
import Header from 'components/Header/Header';
import Sidebar from 'components/Sidebar/Sidebar';
import React from 'react';
import styled from 'styled-components';
import routes from 'routes'
import { Switch, Redirect, Route } from 'react-router-dom';

const Layout: React.FC = () => {
    return (
        <LayoutWrap>
            <Header />
            <div id="main">
                <div id="sidebar">
                    <Sidebar />
                </div>
                <div id="main-content">
                    <Switch>
                        {routes.map((route, index) => (
                            <Route path={`${route.path}`} component={route.component} exact key={index} />
                        ))}
                        {!localStorage.getItem('accessToken') ? <Redirect to={'/login'} /> : <Redirect to={'/'} />}
                    </Switch>
                </div>
            </div>
            <Footer />
        </LayoutWrap>
    )
}

export default Layout;

const LayoutWrap= styled.div`
    #main {
        height: calc(100vh - 154px);
        display: flex;
        align-items: stretch;
    }

    #sidebar {
        width: 220px;
        background: #aaa;
        box-shadow: 0 3px 7px #ccc;
        background: #fff;
     
    }

    #main-content {
        overflow: auto;
        flex: 1;
        .long-content {
            height: 1000px;
        }
    }
`
