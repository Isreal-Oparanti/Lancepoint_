import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import "@/app/globals.css";

export default function Base({ children }) {
  return (
    <>
      <div className="w-full h-screen flex">
        <Sidebar />
        <div className="w-full h-full overflow-y-auto overflow-x-hidden relative bg-image">
          <Navbar />
          <div className="pt-20">{children}</div>
        </div>
      </div>
    </>
  );
}
