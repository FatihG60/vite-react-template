import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Dropdown,
  Modal,
  Checkbox,
  Card,
  Row,
  Col,
  Select,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { ColumnType } from "antd/es/table";
import type { InputRef, MenuProps } from "antd";
import { ReactSortable } from "react-sortablejs";

import {
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { exportData } from "../core/exportToExcel";
import { exportToPDF } from "../core/exportToPdf";
import { CustomColumn } from "../types/CustomColumn";
import dayjs from "dayjs";
import { convertToTitle, detectType } from "../core/generateColumnsFromData";
import { mockData1, mockData2, mockData3 } from "../constants/mockData";
import { extendedMockData } from "../constants/extendedMockData";

const App: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dynamicColumns, setDynamicColumns] = useState<ColumnsType<any>>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const [isColumnInit, setIsColumnInit] = useState(false);
  const [columnSettingsOpen, setColumnSettingsOpen] = useState(false);
  const [customColumns, setCustomColumns] = useState<CustomColumn[]>([]);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");

  const searchInput = useRef<InputRef>(null);

  useEffect(() => {
    if (customColumns.length) {
      const builtColumns: ColumnsType<any> = customColumns
        .filter((col) => col.visible)
        .map((col) => {
          const base: ColumnType<any> = {
            title: col.title,
            dataIndex: col.dataIndex,
            key: col.key,
            fixed: col.fixed,
            ...getColumnSearchProps(col.dataIndex),
          };

          if (col.type === "date") {
            base.render = (text) =>
              text ? dayjs(text).format("DD.MM.YYYY HH:mm") : "-";
            base.sorter = (a, b) =>
              dayjs(a[col.dataIndex]).unix() - dayjs(b[col.dataIndex]).unix();
          } else {
            base.sorter = (a, b) =>
              String(a[col.dataIndex]).localeCompare(String(b[col.dataIndex]));
          }

          return base;
        });

      setDynamicColumns(builtColumns);
    }
  }, [customColumns]);

  useEffect(() => {
    setTimeout(() => {
      const fetchedData = extendedMockData;

      setData(fetchedData);
      if (!isColumnInit) {
        const sample = fetchedData[0];
        const cols: CustomColumn[] = Object.keys(sample).map((key) => {
          const value = sample[key as keyof typeof sample];
          return {
            id: key,
            key,
            dataIndex: key,
            title: convertToTitle(key),
            type: detectType(value),
            visible: true,
            locked: ["id", "name", "email"].includes(key),
          };
        });
        setCustomColumns(cols);
        setIsColumnInit(true);
      }
      setLoading(false);
    }, 1000);
  }, []);

  const getColumnSearchProps = (dataIndex: string): ColumnType<any> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`${dataIndex} ara`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Ara
          </Button>
          <Button
            onClick={() => handleReset(clearFilters!)}
            size="small"
            style={{ width: 90 }}
          >
            Temizle
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    render: (text: string) =>
      searchedColumn === dataIndex ? (
        <span style={{ backgroundColor: "#ffc069", padding: 0 }}>{text}</span>
      ) : (
        text
      ),
  });

  const handleSearch = (confirm: () => void, dataIndex: string) => {
    confirm();
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
  };

  const handleGlobalSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalSearch(e.target.value);
  };

  const filteredData = data.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(globalSearch.toLowerCase())
  );

  const exportMenu: MenuProps["items"] = [
    {
      key: "xlsx",
      label: "Excel (.xlsx)",
      icon: <FileExcelOutlined />,
      onClick: () => exportData(filteredData, "xlsx", customColumns),
    },
    {
      key: "csv",
      label: "CSV (.csv)",
      icon: <FileExcelOutlined />,
      onClick: () => exportData(filteredData, "csv", customColumns),
    },
    {
      key: "pdf",
      label: "PDF (.pdf)",
      icon: <FilePdfOutlined />,
      onClick: () => exportToPDF(filteredData, customColumns),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tabloda ara..."
          value={globalSearch}
          onChange={handleGlobalSearch}
          allowClear
          style={{ width: 300 }}
        />
        <Button icon={<ReloadOutlined />} onClick={() => setGlobalSearch("")}>
          Sıfırla
        </Button>
        <Dropdown menu={{ items: exportMenu }}>
          <Button icon={<DownloadOutlined />}>Dışa Aktar</Button>
        </Dropdown>
        <Button
          icon={<TableOutlined />}
          onClick={() => {
            setColumnSettingsOpen(true);
          }}
        >
          Ayarlar
        </Button>
      </Space>

      <Table
        loading={loading}
        columns={dynamicColumns}
        dataSource={filteredData}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          pageSizeOptions: ["5", "10", "20", "50", "100"],
          showSizeChanger: true,
          showTotal: (_total, range) =>
            `${range[0]}-${range[1]} arası gösteriliyor • Toplam ${filteredData.length} kayıt`,
          total: filteredData.length,
          onChange: (page, pageSize) =>
            setPagination({ current: page, pageSize: pageSize }),
          onShowSizeChange: (_current, size) =>
            setPagination({ current: 1, pageSize: size }),
        }}
        bordered
        scroll={{ x: "max-content" }}
      />

      <Modal
        title="Kolon Ayarları"
        open={columnSettingsOpen}
        onCancel={() => setColumnSettingsOpen(false)}
        width={600}
        styles={{
          body: {
            maxHeight: "60vh",
            overflowY: "auto",
            paddingRight: 8,
          },
        }}
        footer={[
          <Button
            key="reset"
            danger
            onClick={() => {
              if (data.length) {
                const sample = data[0];
                const cols: CustomColumn[] = Object.keys(sample).map((key) => {
                  const value = sample[key];
                  return {
                    id: key,
                    key,
                    dataIndex: key,
                    title: convertToTitle(key),
                    type: detectType(value),
                    visible: true,
                    locked: ["id", "name", "email"].includes(key),
                  };
                });
                setCustomColumns(cols);
                setIsColumnInit(true);
              }
              setColumnSettingsOpen(false);
            }}
          >
            Ayarları Sıfırla
          </Button>,
          <Button key="cancel" onClick={() => setColumnSettingsOpen(false)}>
            Vazgeç
          </Button>,
          <Button
            key="ok"
            type="primary"
            onClick={() => {
              setColumnSettingsOpen(false);
            }}
          >
            Uygula
          </Button>,
        ]}
      >
        <ReactSortable
          list={customColumns}
          setList={setCustomColumns}
          animation={200}
        >
          {customColumns.map((col, index) => (
            <Card
              key={col.id}
              size="small"
              style={{ marginBottom: 8, cursor: "move" }}
            >
              <Row gutter={12} align="middle">
                <Col flex="auto">
                  <Checkbox
                    checked={col.visible !== false}
                    onChange={(e) => {
                      const updated = [...customColumns];
                      updated[index].visible = e.target.checked;
                      setCustomColumns(updated);
                    }}
                  >
                    {col.title}
                  </Checkbox>
                </Col>

                <Col>
                  <Select
                    value={col.fixed || ""}
                    onChange={(value) => {
                      const updated = [...customColumns];
                      updated[index].fixed =
                        (value as "left" | "right" | undefined) || undefined;
                      setCustomColumns(updated);
                    }}
                    style={{ width: 120 }}
                    size="small"
                    placeholder="Sabitle"
                    allowClear
                  >
                    <Select.Option value="left">Sola</Select.Option>
                    <Select.Option value="right">Sağa</Select.Option>
                  </Select>
                </Col>
              </Row>
            </Card>
          ))}
        </ReactSortable>
      </Modal>
    </div>
  );
};

export default App;
