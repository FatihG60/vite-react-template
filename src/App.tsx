import { useSelector } from "react-redux";
import { ConfigProvider, theme } from "antd";
import trTR from "antd/locale/tr_TR";
import MainLayout from "./components/MainLayout";
import LoginForm from "./pages/LoginForm";
import { Routes, Route } from "react-router-dom";
import { RootState } from "./redux/store";
import SearchLayout from "./components/SearchLayout";
import Dashboard from "./pages/management/Dashboard";
import Reports from "./pages/management/Reports";
import Analytics from "./pages/management/Analytics";
import Settings from "./pages/management/Settings";
import Profile from "./pages/management/Profile";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./core/PrivateRoute";
import ErrorPage from "./pages/ErrorPage";

const { defaultAlgorithm, darkAlgorithm } = theme;

const App = () => {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  return (
    <ConfigProvider
      locale={trTR}
      theme={{ algorithm: darkMode ? darkAlgorithm : defaultAlgorithm }}
    >
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/main" element={<MainLayout />} />
        <Route path="/search" element={<PrivateRoute><SearchLayout /></PrivateRoute>}>
          <Route index element={<Profile />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="reports" element={<Reports />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ConfigProvider>
  );
};

export default App;
