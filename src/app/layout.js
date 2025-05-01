import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import '@/app/styles/app.css';
import '@/app/styles/global.css';

export const metadata = {
  title: 'Hospital System',
  description: 'A Website Showcasing Hospital System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="mainContainer">
          <Navbar />

          <div className="mainContent">{children}</div>

          <Footer />
        </div>
      </body>
    </html>
  );
}
