import { useNavigate } from "react-router-dom";
import { Layout, Switch, Dropdown, MenuProps, Button, Space } from "antd";
import {
  MoonOutlined,
  SunOutlined,
  HomeOutlined,
  ReloadOutlined,
  ArrowLeftOutlined,
  MenuOutlined,
  DashboardOutlined,
  FileTextOutlined,
  BarChartOutlined,
  SettingOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { toggleTheme } from "../redux/themeSlice";

const { Header } = Layout;

const AppHeader = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const navigate = useNavigate();

  const handleGoHome = () => navigate("/");
  const handleGoBack = () => window.history.back();
  const handleRefresh = () => window.location.reload();

  const menuItems: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <span onClick={() => navigate("/management/dashboard")}>
          <DashboardOutlined /> Dashboard
        </span>
      ),
    },
    {
      key: "2",
      label: (
        <span onClick={() => navigate("/management/reports")}>
          <FileTextOutlined /> Raporlar
        </span>
      ),
    },
    {
      key: "3",
      label: (
        <span onClick={() => navigate("/management/analytics")}>
          <BarChartOutlined /> Analiz
        </span>
      ),
    },
    {
      key: "4",
      label: (
        <span onClick={() => navigate("/management/settings")}>
          <SettingOutlined /> Ayarlar
        </span>
      ),
    },
    {
      key: "5",
      label: (
        <span onClick={() => navigate("/management/profile")}>
          <ProfileOutlined /> Profil
        </span>
      ),
    },
  ];

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 16px",
        background: darkMode ? "#141414" : "#ffffff",
      }}
    >
      <Space>
        <Button icon={<HomeOutlined />} onClick={handleGoHome} />
        <Button icon={<ArrowLeftOutlined />} onClick={handleGoBack} />
        <Button icon={<ReloadOutlined />} onClick={handleRefresh} />
      </Space>
      <h1 style={{ margin: 0, color: darkMode ? "#fff" : "#000" }}>FTS</h1>
      <Space size={"large"}>
        <Switch
          checked={darkMode}
          onChange={() => dispatch(toggleTheme())}
          checkedChildren={<MoonOutlined style={{ color: "#fadb14" }} />}
          unCheckedChildren={<SunOutlined style={{ color: "#ffa500" }} />}
        />
        <Dropdown
          trigger={["click"]}
          menu={{ items: menuItems }}
          placement="bottomRight"
        >
          <MenuOutlined />
        </Dropdown>
      </Space>
    </Header>
  );
};

export default AppHeader;
