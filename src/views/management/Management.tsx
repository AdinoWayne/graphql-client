import React from 'react';
import 'antd/dist/antd.css';
import { Tabs } from 'antd';
import styled from 'styled-components';
import ManagementProvider from 'contexts/ManagementContext';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import SeniorList from 'views/management/components/Senior/SeniorList';
import ConfirmDialog from './components/ConfirmDialog';
import { useHistory } from 'react-router-dom';

const componentTabs = [
  {
      key: 'seniors',
      title: 'Senior',
  }
];

const { TabPane } = Tabs;

const Management: React.FC = () => {
    const history = useHistory();
    const changeTab = (key: string) => {
      history.push('/management/'+key)
    }
    const defaultActiveKey = 'seniors';
    return (
      <ManagementProvider>
        <ManagementContainer>
          <Tabs defaultActiveKey={defaultActiveKey} onChange={changeTab}>
            {componentTabs.map(tab => {
              const { title, key } = tab;
              return (
                <TabPane tab={title} key={key}></TabPane>
              );
            })}
          </Tabs>
          <Switch>
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