import { Outlet } from "react-router-dom";
import Wrapper from "../components/Wrapper";
import Sidebar from "../components/Sidebar";

const AuthLayout = () => {
  return (
    <Wrapper>
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </Wrapper>
  );
};

export default AuthLayout;