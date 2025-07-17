import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Spin, Typography } from 'antd'
import { login } from '../redux/authSlice'

const { Title, Text } = Typography

const LoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    // Simüle edilen API isteği sonucu (başarılı ya da başarısız)
    const simulateLogin = () => {
      const success = Math.random() < 0.7 // %70 ihtimalle başarılı
      return new Promise<boolean>((resolve) => {
        setTimeout(() => resolve(success), 5000)
      })
    }

    simulateLogin().then((isSuccess) => {
      if (isSuccess) {
        dispatch(login())
        navigate('/search')
      } else {
        navigate('/error')
      }
    })
  }, [dispatch, navigate])

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <Spin size="large" />
      <Title level={4}>Giriş yapılıyor...</Title>
      <Text type="secondary">Kullanıcı bilgileri getiriliyor. Lütfen bekleyin.</Text>
    </div>
  )
}

export default LoginPage
