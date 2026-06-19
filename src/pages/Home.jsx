import { useEffect } from 'react';
import Layout from '../layout/Layout';
import HeroSection from '../components/HeroSection';
import FeaturedSection from '../components/FeaturedSection';
import TestimonialsSection from '../components/TestimonialsSection';
import '../styles/home.css';

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <HeroSection />
      <FeaturedSection />
      <TestimonialsSection />
    </Layout>
  );
};

export default Home;