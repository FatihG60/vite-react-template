import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import AppHeader from './SearchHeader'
import AppFooter from './SearchFooter'

const { Content } = Layout

const SearchLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Content style={{ padding: '24px' }}>
        <Outlet />
      </Content>
      <AppFooter />
    </Layout>
  )
}

export default SearchLayout
