import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/footer.css';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;