import { Layout } from 'antd'

const { Footer } = Layout

const AppFooter = () => {
  return (
    <Footer style={{ textAlign: 'center' }}>
      © {new Date().getFullYear()} Tüm Hakları Saklıdır.
    </Footer>
  )
}

export default AppFooter
