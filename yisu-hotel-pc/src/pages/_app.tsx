import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AntdRegistry>
      {/* 配置 AntD 全局语言和主题 */}
      <ConfigProvider locale={zhCN} theme={{
        token: {
          colorPrimary: "#1677ff", // 主色调
          borderRadius: 6, // 统一圆角
        },
      }}>
        <Component {...pageProps} />
      </ConfigProvider>
    </AntdRegistry>
  );
}
