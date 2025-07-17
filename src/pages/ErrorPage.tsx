const ErrorPage = () => {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <h2>❌ Giriş Başarısız</h2>
      <p>Lütfen tekrar deneyin ya da sistem yöneticinizle iletişime geçin.</p>
    </div>
  )
}

export default ErrorPage
