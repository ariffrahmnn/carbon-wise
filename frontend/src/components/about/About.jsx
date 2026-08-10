import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import ShinyText from './ShinyText'
import '../../styles/about/about.css'

const syntaxSnippets = [
  'const co2 = 0.45; // kg CO₂',
  'function calcEmission(dist, factor) { return dist * factor; }',
  'import { gsap } from "gsap";',
  '<CarbonWise version="2.0" />',
  'SELECT * FROM users WHERE role = \'ADMIN\';',
  'const [data, setData] = useState([]);',
  'npm run dev -- --host 3000',
  'git push origin main',
  'const calculateFootprint = async () => { ... }',
  '{ success: true, co2Saved: "45.2 kg" }',
  'const factorFood = { beef: 27.0, rice: 2.7 };',
  '<Leaf size={20} color="#4A0E17" />',
  'jwt.verify(token, process.env.JWT_SECRET);',
  'const debouncedSearch = useDebounce(input, 400);'
];

function About() {
  const navigate = useNavigate();
  const syntaxContainerRef = useRef(null);

  // Animasi GSAP Syntax Beterbangan di Latar Belakang hiFooCode Group
  useEffect(() => {
    if (!syntaxContainerRef.current) return;

    const items = syntaxContainerRef.current.querySelectorAll('.syntax-item');

    items.forEach((item, index) => {
      // Posisi acak awal
      const startX = Math.random() * 80 + 5; // 5% s.d. 85%
      const startY = Math.random() * 80 + 10;
      const duration = 12 + Math.random() * 14; // 12s - 26s
      const delay = Math.random() * 5;

      gsap.set(item, {
        xPercent: startX * 5,
        yPercent: startY * 3,
        opacity: 0.15 + Math.random() * 0.25,
        scale: 0.85 + Math.random() * 0.3
      });

      // Animasi gerak melayang kontinu & rotasi halus
      gsap.to(item, {
        y: `-=${60 + Math.random() * 80}`,
        x: `+=${(index % 2 === 0 ? 1 : -1) * (30 + Math.random() * 50)}`,
        rotation: (index % 2 === 0 ? 1 : -1) * (3 + Math.random() * 6),
        duration: duration,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: delay
      });

      // Pulse opacity halus
      gsap.to(item, {
        opacity: 0.45,
        duration: 3 + Math.random() * 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: delay
      });
    });

    return () => {
      gsap.killTweensOf(items);
    };
  }, []);

  return (
    <div className="about-page">
      {/* 1. HERO SECTION */}
      <section className="about-hero">
        <div className="about-hero__overlay"></div>
        <div className="about-hero__content">
          <span className="hero-tagline">Deep Learning into Pro-Environmental Behaviour</span>
          <h1 className="about-hero__title">Tentang Kami</h1>
        </div>
      </section>

      {/* 2. LATAR BELAKANG & PENDAHULUAN */}
      <section className="about-intro-section">
        <div className="about-container">
          <div className="intro-pillars">
            <span className="pillar-item">Mindful <i>(Berkesadaran)</i></span>
            <span className="pillar-dot">•</span>
            <span className="pillar-item">Meaningful <i>(Bermakna)</i></span>
            <span className="pillar-dot">•</span>
            <span className="pillar-item">Joyful <i>(Menggembirakan)</i></span>
          </div>

          <div className="intro-quote">
            <span className="material-symbols-outlined quote-icon" aria-hidden="true">format_quote</span>
            <h2>Berawal dari ide untuk menjembatani pemahaman dan aksi nyata dalam pendekatan belajar Deep Learning.</h2>
          </div>

          <div className="intro-text-grid">
            <p>
              Materi perubahan lingkungan bukan lagi sekadar teori permasalahan global di dalam buku teks biologi. Gaya hidup dan kebiasaan setiap individu bertanggung jawab dalam menghasilkan emisi karbon yang secara kolektif menyebabkan perubahan lingkungan. Yang menjadi tanda tanya adalah: <strong>“Dari mana kita harus mulai mengambil peran untuk menjaga bumi kita?”</strong>
            </p>
            <p>
              Kami percaya bahwa perubahan besar selalu dimulai dari kesadaran. Sebagai calon penerus bangsa, kita harus menyadari dampak aktivitas sehari-hari dengan melacak besaran jejak karbon yang dihasilkan. Dari sinilah gagasan pengintegrasian kalkulator emisi karbon dalam pembelajaran di sekolah lahir melalui program penelitian <strong>BIMA PTM pada tahun 2026</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* 3. CORE BELIEF & MISSION */}
      <section className="about-core-section">
        <div className="about-container">
          <div className="core-header">
            <span className="core-label">VISI & MISI KAMI</span>
            <h2 className="vision-title">
              "Menciptakan generasi muda yang mampu berpikir kritis dan memiliki sikap pro-lingkungan."
            </h2>
          </div>

          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-number">01</div>
              <h3>Edukasi</h3>
              <p>Mengintegrasikan kalkulator emisi karbon berbasis website interaktif yang relevan dengan rutinitas siswa sehari-hari dalam pembelajaran.</p>
            </div>

            <div className="mission-card">
              <div className="mission-number">02</div>
              <h3>Aksi</h3>
              <p>Memberikan rekomendasi langkah-langkah nyata upaya mengurangi emisi karbon personal setelah siswa mengetahui hasil jejak karbon mereka.</p>
            </div>

            <div className="mission-card">
              <div className="mission-number">03</div>
              <h3>Riset Berkelanjutan</h3>
              <p>Menggunakan data perhitungan sebagai basis penelitian lebih lanjut untuk memajukan pendidikan lingkungan hidup di Indonesia.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SIAPA DI BALIK LAYAR & TIM */}
      <section className="about-team-section">
        <div className="about-container">
          <div className="section-title-wrap">
            <h2>Siapa di Balik Layar?</h2>
            <p className="team-intro">
              Inisiatif ini digagas langsung oleh tim peneliti Pascasarjana FKIP Universitas Riau (UNRI) dan diwujudkan ke dalam platform digital bersama hiFooCode Group.
            </p>
          </div>

          {/* TIM PENELITI UNRI - KARTU MODERN CARBONWISE */}
          <div className="researchers-wrapper">
            <div className="researchers-header">
              <div>
                <span className="researchers-badge">PASCA SARJANA FKIP UNRI</span>
                <h3 className="group-title">Tim Peneliti UNRI</h3>
              </div>
              <p className="group-sub">Memadukan pengalaman akademis dan semangat riset pendidikan lingkungan untuk merancang instrumen serta formula yang akurat secara sains.</p>
            </div>
            
            <div className="researchers-grid">
              {/* Kartu Dosen 1 */}
              <div className="researcher-card">
                <div className="researcher-avatar">
                  <span className="material-symbols-outlined">workspace_premium</span>
                </div>
                <div className="researcher-info">
                  <span className="researcher-role-tag primary">Tim Peneliti Utama</span>
                  <h4>Prof. Dr. Yustina, M.Si.</h4>
                  <p className="researcher-inst">FKIP Universitas Riau</p>
                </div>
              </div>

              {/* Kartu Dosen 2 */}
              <div className="researcher-card">
                <div className="researcher-avatar">
                  <span className="material-symbols-outlined">science</span>
                </div>
                <div className="researcher-info">
                  <span className="researcher-role-tag secondary">Tim Peneliti</span>
                  <h4>Dr. Fitra Suzanti, S.Si., M.Si.</h4>
                  <p className="researcher-inst">FKIP Universitas Riau</p>
                </div>
              </div>

              {/* Kartu Dosen 3 */}
              <div className="researcher-card">
                <div className="researcher-avatar">
                  <span className="material-symbols-outlined">school</span>
                </div>
                <div className="researcher-info">
                  <span className="researcher-role-tag accent">Mahasiswa Pascasarjana</span>
                  <h4>Ashifa Putri Zirly, S.Pd.</h4>
                  <p className="researcher-inst">Pascasarjana FKIP UNRI</p>
                </div>
              </div>
            </div>
          </div>

          {/* IT DEVELOPER: hiFooCode Group DENGAN ANIMASI SYNTAX GSAP BETERBANGAN */}
          <div className="nodecode-box">
            {/* CONTAINER LATAR BELAKANG SYNTAX GSAP */}
            <div className="nodecode-syntax-layer" ref={syntaxContainerRef}>
              {syntaxSnippets.map((snippet, i) => (
                <div key={i} className="syntax-item">
                  <code>{snippet}</code>
                </div>
              ))}
            </div>

            <div className="nodecode-content">
              <span className="nodecode-tag">DEVELOPMENT PARTNER</span>
              <h3>
                <ShinyText
                  text="hiFooCode Group"
                  speed={2}
                  delay={0}
                  color="#b5b5b5"
                  shineColor="#ffffff"
                  spread={120}
                  direction="left"
                  yoyo={false}
                  pauseOnHover={false}
                  disabled={false}
                />
              </h3>
              <p>
                Tim IT developer yang beranggotakan empat talenta kreatif berlatar belakang Teknik Informatika. hiFooCode Group bertugas mewujudkan rancangan ide dari peneliti ke dalam arsitektur website kalkulator karbon yang interaktif dan <i>user-friendly</i> bagi siswa-siswi.
              </p>
            </div>
          </div>

          {/* CALL TO ACTION (CTA) */}
          <div className="about-cta-box">
            <h3>Siap Menjadi Agen Perubahan?</h3>
            <p>Mari mulai hitung jejak karbonmu dan jadilah bagian dari generasi penerus yang peduli keberlanjutan bumi.</p>
            <button className="cta-button" onClick={() => navigate('/input')}>
              <span>Hitung Jejak Karbon</span>
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About