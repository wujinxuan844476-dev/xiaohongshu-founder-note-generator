import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "小红书创业者笔记生成器",
  description: "给创业者、个人IP和实体老板用的小红书内容生产工具。"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen antialiased">
        <header className="fixed inset-x-0 top-0 z-20 border-b border-rose-100 bg-paper/82 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
            <div className="text-sm font-semibold tracking-[0.16em] text-rose">XHS NOTE</div>
            <div className="hidden text-sm text-ink/58 md:block">创业者 · 个人IP · 实体老板</div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
