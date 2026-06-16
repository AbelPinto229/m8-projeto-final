// página inicial pública — compõe todas as secções de marketing em sequência
import Nav          from '../components/home/Nav';
import Hero         from '../components/home/Hero';
import Marquee      from '../components/home/Marquee';
import QuemSomos    from '../components/home/QuemSomos';
import Servicos     from '../components/home/Servicos';
import Portfolio    from '../components/home/Portfolio';
import Reviews      from '../components/home/Reviews';
import Contacto     from '../components/home/Contacto';
import Footer       from '../components/home/Footer';
import ScrollReveal from '../components/home/ScrollReveal';
import '../styles/style.css';

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Marquee />
      <QuemSomos />
      <Servicos />
      <Portfolio />
      <Reviews />
      <Contacto />
      <Footer />
      {/* scrollreveal não renderiza nada — apenas ativa animações nos elementos .r */}
      <ScrollReveal />
    </>
  );
}
