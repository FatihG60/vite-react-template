import { useState, useEffect } from 'react'
import { Layout, Menu, Switch } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  DashboardOutlined,
  MessageOutlined,
  MoonOutlined,
  SunOutlined,
  ContainerOutlined,
  DatabaseOutlined
} from '@ant-design/icons'
import Dashboard from '../pages/Dashboard'
import Messaging from '../pages/Messaging'
import DataPage from '../pages/DataPage'
import ContainerPage from '../pages/ContainerPage'

const { Header, Sider, Content } = Layout

interface MainLayoutProps {
  darkMode: boolean
  toggleTheme: () => void
}

const MainLayout = ({ darkMode, toggleTheme }: MainLayoutProps) => {
  const [selectedKey, setSelectedKey] = useState<string>('1')
  const navigate = useNavigate()
  const location = useLocation()
  const userName = location.state?.user || null

  useEffect(() => {
    if (!userName) {
      navigate('/')
    }
  }, [userName, navigate])

  const handleMenuClick = ({ key }: { key: string }) => {
    setSelectedKey(key)
  }

  const renderContent = () => {
    switch (selectedKey) {
      case '1':
        return <Dashboard />
      case '2':
        return <ContainerPage />
      case '3':
        return <DataPage />
      case '4':
        return <Messaging />
      default:
        return <Dashboard />
    }
  }

  const menuItems = [
    { key: '1', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '2', icon: <ContainerOutlined />, label: 'Documents' },
    { key: '3', icon: <DatabaseOutlined />, label: 'Database' },
    { key: '4', icon: <MessageOutlined />, label: 'Messages' }
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme={darkMode ? 'dark' : 'light'} collapsible>
        <Menu
          theme={darkMode ? 'dark' : 'light'}
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 16px',
            background: darkMode ? '#141414' : '#ffffff'
          }}
        >
          <h1 style={{ color: darkMode ? '#ffffff' : '#000000' }}>FTS</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Switch
              checked={darkMode}
              onChange={toggleTheme}
              checkedChildren={<MoonOutlined style={{ color: '#fadb14' }} />}
              unCheckedChildren={<SunOutlined style={{ color: '#ffa500' }} />}
            />
          </div>
        </Header>
        <Content style={{ padding: '16px' }}>{renderContent()}</Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
