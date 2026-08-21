import { Outlet } from "react-router-dom";
import Wrapper from "../components/Wrapper";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const UnauthLayout = () => {
  return (
    <Wrapper>
      <Navbar />

      <main className="min-h-screen">
        <Outlet />
      </main>

      <Footer />
    </Wrapper>
  );
};

export default UnauthLayout;