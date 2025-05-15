import Hero from "@/components/hero/Hero";
import Partners from "@/components/partners/Partners";
import About from "@/components/about/About";
import TrustlessAgreements from "@/components/trustlessAgreements/TrustlessAgreements";
import Services from "@/components/services/Services";

import Header from "@/components/Navbar/Header";
import Footer from "@/components/footer/Footer";
import ZK from "@/components/ZK";
import "./globals.css";

function App() {
  return (
    <div className="min-h-screen bg-image app-font">
      <Header />
      <main className="px-4 sm:px-6 md:px-12 lg:px-20">
        <Hero />
        <Partners />
        <About />
        <TrustlessAgreements />
        <Services />
      </main>
      <Footer />
      {/* <ZK /> */}
    </div>
  );
}

export default App;
