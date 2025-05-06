import "server-only";
import Header from "@/components/Navbar/Header";
import Footer from "@/components/footer/Footer";
import "@/app/globals.css";

export default function BaseNoAuth({ children }) {
  return (
    <>
      <div className="w-full h-full overflow-y-auto overflow-x-hidden relative bg-image">
        {/* <Header /> */}
        {/* <main className='y-4 px-4 sm:px-6 md:px-12 lg:px-20'> */}
          {children}
        {/* </main> */}
        {/* <Footer /> */}
      </div>
    </>
  );
}
