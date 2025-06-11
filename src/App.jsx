import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import DetailsSection from "./components/DetailsSection";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import CalendarForm from "./components/CalendarForm";

function App() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <DetailsSection />
        <ContactForm />
        <CalendarForm />
      </main>
      <Footer />
    </>
  );
}

export default App;
