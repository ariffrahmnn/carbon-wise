import Header from '../components/header.jsx'
import Footer from '../components/footer.jsx'

function About() {
  return (
    <div className="app-shell">
      <Header />
      <main>
        <section className="mission page-container" aria-labelledby="about-title">
          <div className="mission__content">
            <span className="mission__quote material-symbols-outlined" aria-hidden="true">format_quote</span>
            <h1 id="about-title">Bersama CarbonWise,<br />Masa Depan Jadi <span>Lebih Cerah.</span></h1>
            <p>Kami adalah kolektif pencinta alam yang berdedikasi untuk memberikan edukasi karbon yang mudah diakses. Misi kami adalah mengubah angka emisi yang rumit menjadi aksi nyata yang sederhana bagi semua orang.</p>
          </div>
          <div className="mission__image-wrap">
            <img
              className="mission__image"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZvLrbtlDKFKrged_FbULwEBBaLygOB3fGY_5sb9v44Qlko_MjHq3qCsld_a1sqy7CMyNv8GG4YeydgH9fhmxRzhd2yuXvquGzreYMnvGPHiyCTuWk-1L8zf_ZK6Jg7Is7v-X1bvypJVgpK_ScYdF_vyrJEPCdnfatvli0ht_J49rloYXb6RELz8XuAl2V1ZVnSqIAUdYf2avvJawjJqT441fHN1MLTcshg2c0FBy-pHKsMva8VPUZ"
              alt="Bibit tanaman yang tumbuh di dalam tanah"
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default About
