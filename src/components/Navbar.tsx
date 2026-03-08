'use client';

import Image from "next/image";
import { Sun, Moon, Home } from "lucide-react";
import { useState, MouseEvent } from "react";
import { useTheme } from "next-themes";
import DeveloperPanel from "./DeveloperPanel";

export function Navbar() {
  const [showDevPanel, setShowDevPanel] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme ?? theme ?? "light";

  const toggleTheme = (event: MouseEvent<HTMLButtonElement>) => {
    const isDark = currentTheme === 'dark';
    const newTheme = isDark ? 'light' : 'dark';

    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      setTheme(newTheme);
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 500,
          easing: "ease-in",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <>
      <nav className="h-16 bg-white/80 dark:bg-black/80 backdrop-blur-md z-50 px-4 md:px-8 flex items-center justify-between transition-colors duration-300">
        {/* 左上角 Logo - 改为 a 标签，强制刷新 */}
        <a
          href="https://music.wpys.cc"
          className="flex items-center gap-2 group cursor-pointer"
        >
          <Image src="/images/cherry-logo.svg" alt="AQ音乐" width={40} height={40} className="h-10 w-auto transition-transform" />
          <span className="text-lg font-semibold text-slate-800 dark:text-slate-200">AQ音乐</span>
        </a>

        <div className="flex items-center gap-2">
          {/* 只保留首页按钮和主题切换，中间图标已删除 */}
          
          {/* 首页按钮 - 保留 a 标签 */}
          <a
            href="https://music.wpys.cc"
            className="p-2 text-slate-400 dark:text-slate-500 hover:text-sky-500 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-slate-800 rounded-full transition-all duration-300 cursor-pointer"
            title="返回首页"
          >
            <Home className="w-5 h-5" />
          </a>

          {/* 主题切换按钮 */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-400 dark:text-slate-500 hover:text-sky-500 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-slate-800 rounded-full transition-all duration-300 cursor-pointer"
            aria-label="Toggle theme"
          >
            {currentTheme === 'dark' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      <DeveloperPanel open={showDevPanel} onClose={() => setShowDevPanel(false)} />
    </>
  );
}
