import React from 'react';
import 'antd/dist/antd.css';
import { Space, Tabs } from 'antd';
import SearchTop from 'components/SearchTop/SearchTop';
import styled from 'styled-components';
import DeviceList from 'views/management/components/DeviceList'
import ManagementProvider from 'contexts/ManagementContext';
import { NavLink, Redirect, Route, Switch, withRouter } from 'react-router-dom';
import SeniorList from 'views/management/components/Senior/SeniorList';
import ConfirmDialog from './components/ConfirmDialog';
import { useHistory } from 'react-router-dom';

const componentTabs = [
  {
      key: 'seniors',
      title: 'Senior',
  },
  {
      key: 'devices',
      title: 'Device',
  }
];

const { TabPane } = Tabs;

const Management: React.FC = () => {
    const history = useHistory();
    const changeTab = (key: string) => {
      history.push('/management/'+key)
    }
    const defaultActiveKey = '/management/devices' === history.location.pathname ? 'devices' : 'seniors';
    return (
      <ManagementProvider>
        <ManagementContainer>
          <Space className="search-common">
            <SearchTop
              paramName="emailOrPhone"
              placeholder="User email or mobile"
            />
          </Space>
          <Tabs defaultActiveKey={defaultActiveKey} onChange={changeTab}>
            {componentTabs.map(tab => {
              const { title, key } = tab;
              return (
                <TabPane tab={title} key={key}></TabPane>
              );
            })}
          </Tabs>
          <Switch>
            <Route exact path="/management/devices" component={DeviceList} />
            <Route exact path="/management/seniors" component={SeniorList} />
            <Redirect to={'/management/seniors'} />
          </Switch>
        </ManagementContainer>
        <ConfirmDialog />
      </ManagementProvider>
    )
};

const ManagementContainer = styled.div`
  margin: 16px;
  & .search-common {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 24px;
    margin-top: 24px;
  }
  & .ant-tabs-nav {
 
  }
`

export default withRouter(Management);