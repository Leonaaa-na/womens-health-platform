import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import Wrapper from "../components/Wrapper";
import Sidebar from "../components/Sidebar";
import NotificationPopup from "../components/NotificationPopup";

import "../styles/darkMode.css";

const AuthLayout = () => {
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(
        "herbloomAppSettings"
      );

      if (!savedSettings) {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.remove("compact");
        return;
      }

      const settings = JSON.parse(savedSettings) as {
        darkMode?: boolean;
        compactView?: boolean;
      };

      if (settings.darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      if (settings.compactView) {
        document.documentElement.classList.add("compact");
      } else {
        document.documentElement.classList.remove("compact");
      }
    } catch {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.remove("compact");
    }
  }, []);

  return (
    <Wrapper>
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>

        <NotificationPopup />
      </div>
    </Wrapper>
  );
};

export default AuthLayout;