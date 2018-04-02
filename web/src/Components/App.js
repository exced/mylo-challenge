import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Layout, BackTop } from 'antd'
import Home from '../Components/Home'
import Users from '../Containers/Users'
import Menu from '../Containers/Menu'

const { Content } = Layout

const App = () => (
  <Layout>
    <Menu />
    <BackTop />
    <Layout style={{ backgroundColor: 'white' }}>
      <Content>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/users" component={Users} />
        </Switch>
      </Content>
    </Layout>
  </Layout>
)

export default App