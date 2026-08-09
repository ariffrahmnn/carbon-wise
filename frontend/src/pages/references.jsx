import Header from '../components/header.jsx'
import '../styles/global/references.css'

function References() {
  return (
    <div className="app-shell">
      <Header />
      <main>
        <section className="references page-container" aria-labelledby="references-title">
          <div className="references__placeholder">
            <p className="section-heading__eyebrow">Ruang pengembangan</p>
            <h1 id="references-title">Referensi</h1>
            <p>Area ini disiapkan untuk menambahkan sumber data, artikel, dan bacaan tepercaya tentang karbon serta lingkungan.</p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default References
