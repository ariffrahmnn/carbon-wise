import React from 'react'
import '../../styles/about/about.css'

function About() {
  return (
    <div className="about-page">
      {/* 1. HERO SECTION (OVERLAY GELAP DENGAN FOTO TANAMAN) */}
      <section className="about-hero">
        <div className="about-hero__overlay"></div>
        <div className="about-hero__content">
          <span className="hero-tagline">Deep Learning into Pro-Environmental Behaviour</span>
          <h1 className="about-hero__title">Tentang Kami</h1>
        </div>
      </section>

      {/* 2. LATAR BELAKANG & PENDAHULUAN (WARNA PUTIH NETRAL) */}
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

      {/* 3. CORE BELIEF & MISSION (SECTION MAROON GELAP + BACKGROUND SILUET POHON JELAS) */}
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

      {/* 4. SIAPA DI BALIK LAYAR &  (BERPINDAH KE WARNA TERANG / OFF-WHITE) */}
    <section className="about-team-section">
        <div className="about-container">
          <div className="section-title-wrap">
            <h2>Siapa di Balik Layar?</h2>
            <p className="team-intro">
              Inisiatif ini digagas langsung oleh tim peneliti Pascasarjana FKIP Universitas Riau (UNRI) dan diwujudkan ke dalam platform digital bersama nodeCode_.
            </p>
          </div>

          {/* TIM PENELITI */}
          <div className="researchers-wrapper">
            <h3 className="group-title">Tim Peneliti UNRI</h3>
            <p className="group-sub">Memadukan pengalaman akademis dan semangat riset pendidikan lingkungan untuk merancang instrumen serta formula yang akurat secara sains.</p>
            
            <div className="researchers-grid">
              <div className="researcher-card">
                <h4>Prof. Dr. Yustina, M.Si.</h4>
                <span>Tim Peneliti Utama</span>
              </div>
              <div className="researcher-card">
                <h4>Dr. Fitra Suzanti, S.Si., M.Si.</h4>
                <span>Tim Peneliti</span>
              </div>
              <div className="researcher-card">
                <h4>Ashifa Putri Zirly, S.Pd.</h4>
                <span>Mahasiswa Pascasarjana</span>
              </div>
            </div>
          </div>

          {/* IT DEVELOPER */}
          <div className="nodecode-box">
            <div className="nodecode-content">
              <span className="nodecode-tag">DEVELOPMENT PARTNER</span>
              <h3>nodeCode_</h3>
              <p>
                Tim IT developer yang beranggotakan empat talenta kreatif berlatar belakang Teknik Informatika. nodeCode_ bertugas mewujudkan rancangan ide dari peneliti ke dalam arsitektur website kalkulator karbon yang interaktif dan <i>user-friendly</i> bagi siswa-siswi.
              </p>
            </div>
          </div>

          {/* CALL TO ACTION (CTA) */}
          <div className="about-cta-box">
            <h3>Siap Menjadi Agen Perubahan?</h3>
            <p>Mari mulai hitung jejak karbonmu dan jadilah bagian dari generasi penerus yang peduli keberlanjutan bumi.</p>
            <button className="cta-button">Hitung Jejak Karbon Now</button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About