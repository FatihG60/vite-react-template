import {
  Input,
  DatePicker,
  Select,
  Checkbox,
  Tabs,
  Table,
  Space,
  Button,
  Typography,
  Card,
  Row,
  Col,
  Modal,
} from "antd";
import {
  DownOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  GlobalOutlined,
  InsertRowBelowOutlined,
  PictureOutlined,
  SearchOutlined,
  UpOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import Draggable from "react-draggable";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import type { Dayjs } from "dayjs";
import { RangePickerProps } from "antd/es/date-picker";
import VirtualKeyboard from "../core/VirtualKeyboard";
import FloatingKeyboard from "../core/VirtualKeyboard";

const { Title } = Typography;
const { RangePicker } = DatePicker;

const categoryOptions = ["Web", "Haber", "Görsel", "Video", "PDF"];
const brandOptions = ["Apple", "Samsung", "Huawei", "Xiaomi", "Oppo"];

const mockResults = [
  {
    key: "1",
    title: "OpenAI makalesi",
    category: "Web",
    brand: "Apple",
    date: "2024-01-01",
  },
  {
    key: "2",
    title: "Haber 1",
    category: "Haber",
    brand: "Samsung",
    date: "2024-02-05",
  },
  {
    key: "3",
    title: "Görsel 1",
    category: "Görsel",
    brand: "Huawei",
    date: "2024-03-10",
  },
  {
    key: "4",
    title: "Video 1",
    category: "Video",
    brand: "Apple",
    date: "2024-04-15",
  },
  {
    key: "5",
    title: "PDF Raporu",
    category: "PDF",
    brand: "Xiaomi",
    date: "2024-05-20",
  },
];

const SearchPage = () => {
  const activeInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(
    null
  );

  const [query, setQuery] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [brands, setBrands] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [results, setResults] = useState<typeof mockResults>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [showSearchBox, setShowSearchBox] = useState(true);
  const [showResultBox, setShowResultBox] = useState(true);

  useEffect(() => {
    const handleFocus = (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        activeInputRef.current = target;
      }
    };

    document.addEventListener("focusin", handleFocus);
    return () => document.removeEventListener("focusin", handleFocus);
  }, []);

  const now = dayjs();

  const rangePresets: RangePickerProps["presets"] = [
    { label: "Son 1 Saat", value: [now.subtract(1, "hour"), now] },
    { label: "Bugün", value: [now.startOf("day"), now.endOf("day")] },
    { label: "Son 1 Gün", value: [now.subtract(1, "day"), now] },
    { label: "Son 1 Hafta", value: [now.subtract(1, "week"), now] },
    { label: "Son 1 Ay", value: [now.subtract(1, "month"), now] },
    { label: "Son 3 Ay", value: [now.subtract(3, "month"), now] },
    { label: "Son 6 Ay", value: [now.subtract(6, "month"), now] },
    { label: "Son 1 Yıl", value: [now.subtract(1, "year"), now] },
  ];

  const handleSearch = () => {
    const filtered = mockResults.filter((item) => {
      const matchesQuery = item.title
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesBrand = brands.length === 0 || brands.includes(item.brand);
      const matchesCategory =
        categories.length === 0 || categories.includes(item.category);
      const matchesDate =
        !dateRange ||
        (dayjs(item.date).isAfter(dateRange[0]) &&
          dayjs(item.date).isBefore(dateRange[1]));

      return matchesQuery && matchesBrand && matchesCategory && matchesDate;
    });

    setResults(filtered);
    setActiveTab(categories[0] || "");
    setShowSearchBox(false);
  };

  const columns = [
    { title: "Başlık", dataIndex: "title", key: "title" },
    { title: "Marka", dataIndex: "brand", key: "brand" },
    { title: "Tarih", dataIndex: "date", key: "date" },
  ];

  const categoryOptions = ["Web", "Haber", "Görsel", "Video", "PDF"];
  const categoryIcons: Record<string, React.ReactNode> = {
    Web: <GlobalOutlined />,
    Haber: <FileTextOutlined />,
    Görsel: <PictureOutlined />,
    Video: <VideoCameraOutlined />,
    PDF: <FilePdfOutlined />,
  };
  const tabItems = categoryOptions.map((cat) => ({
    key: cat,
    label: (
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {categoryIcons[cat]}
        {cat}
      </span>
    ),
    children: (
      <Table
        dataSource={results.filter((item) => item.category === cat)}
        columns={columns}
        pagination={false}
        bordered
      />
    ),
  }));

  return (
    <div style={{ minHeight: "100vh" }}>
      <Row className="w-full">
        <Col span={24} style={{ marginBottom: 16 }}>
          <Card
            variant="outlined"
            style={{ padding: 24, cursor: "default" }}
            hoverable
            title={
              <div
                style={{ cursor: "pointer" }}
                onClick={() => setShowSearchBox((prev) => !prev)}
              >
                <Title className="flex justify-between" level={4}>
                  Arama
                  {showSearchBox ? (
                    <UpOutlined></UpOutlined>
                  ) : (
                    <DownOutlined></DownOutlined>
                  )}
                </Title>
              </div>
            }
          >
            {showSearchBox && (
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                {/* Arama içeriği */}
                <RangePicker
                  showTime
                  allowClear
                  style={{ width: "100%" }}
                  presets={rangePresets}
                  onChange={(dates) => {
                    if (dates && dates[0] && dates[1]) {
                      setDateRange([dates[0], dates[1]]);
                    } else {
                      setDateRange(null);
                    }
                  }}
                />

                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Marka seçin"
                  maxTagPlaceholder={(value) => `+${value.length} diğer`}
                  maxTagCount={2}
                  value={brands}
                  style={{ width: "100%" }}
                  onChange={setBrands}
                  options={brandOptions.map((b) => ({ label: b, value: b }))}
                />

                <Input
                  placeholder="Arama yapın..."
                  value={query}
                  allowClear
                  onChange={(e) => setQuery(e.target.value)}
                  onPressEnter={handleSearch}
                  suffix={
                    <Button icon={<SearchOutlined />} onClick={handleSearch} />
                  }
                />
                <Button
                  icon={<InsertRowBelowOutlined />}
                  onClick={() => setShowKeyboard(true)}
                />

                <div className="flex justify-center">
                  <Space wrap size={32}>
                    {categoryOptions.map((cat) => (
                      <Checkbox
                        key={cat}
                        checked={categories.includes(cat)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setCategories((prev) =>
                            checked
                              ? [...prev, cat]
                              : prev.filter((c) => c !== cat)
                          );
                        }}
                      >
                        {cat}
                      </Checkbox>
                    ))}
                  </Space>
                </div>
              </Space>
            )}
          </Card>
        </Col>
      </Row>
      <Card
        variant="outlined"
        style={{ padding: 24, cursor: "default" }}
        hoverable
        title={
          <div
            style={{ cursor: "pointer" }}
            onClick={() => setShowResultBox((prev) => !prev)}
          >
            <Title className="flex justify-between" level={4}>
              Sonuçlar
              {showResultBox ? (
                <UpOutlined></UpOutlined>
              ) : (
                <DownOutlined></DownOutlined>
              )}
            </Title>
          </div>
        }
      >
        {showResultBox && (
          <Tabs
            centered
            activeKey={activeTab || categoryOptions[0]}
            onChange={setActiveTab}
            items={tabItems}
          />
        )}
      </Card>
      {showKeyboard && (
        <FloatingKeyboard
          initialValue={query}
          onInput={setQuery}
          onClose={() => setShowKeyboard(false)}
        />
      )}
    </div>
  );
};

export default SearchPage;
