import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Resume from './components/sections/Resume';
import Portfolio from './components/sections/Portfolio';
import Contact from './components/sections/Contact';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

function App() {
  useEffect(() => {
    // Set dark mode by default
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Resume />
        <Portfolio />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;
