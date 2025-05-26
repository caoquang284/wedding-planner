import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 pb-8">
        {" "}
        {/* Padding-top để tránh navbar, flex-1 để nội dung chiếm không gian còn lại */}
        <div className="container mx-auto px-4">
          <Outlet /> {/* Hiển thị nội dung của các route */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
