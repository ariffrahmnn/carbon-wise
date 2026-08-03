import { useState } from 'react'

const facts = [
  {
    icon: 'eco',
    question: 'Apa itu jejak karbon?',
    answer: 'Jejak karbon adalah jumlah emisi gas rumah kaca yang dihasilkan oleh aktivitas seseorang, organisasi, atau produk. Mengukurnya membantu kita menemukan langkah pengurangan yang paling berdampak.',
  },
  {
    icon: 'park',
    question: 'Berapa CO₂ yang diserap satu pohon?',
    answer: 'Pohon dewasa dapat menyerap rata-rata sekitar 22 kilogram CO₂ per tahun. Angka ini bergantung pada jenis, usia, ukuran, dan kondisi lingkungan pohon.',
  },
  {
    icon: 'factory',
    question: 'Apa penyumbang terbesar emisi?',
    answer: 'Sektor energi, termasuk pembangkit listrik dan transportasi, merupakan salah satu sumber emisi global terbesar. Penggunaan bahan bakar fosil menjadi faktor utamanya.',
  },
  {
    icon: 'restaurant',
    question: 'Apa dampak diet daging sapi?',
    answer: 'Daging sapi memiliki jejak karbon yang relatif tinggi karena membutuhkan lahan, pakan, dan menghasilkan metana. Mengurangi porsinya dan memilih lebih banyak makanan nabati dapat membantu.',
  },
  {
    icon: 'water',
    question: 'Apakah lautan menyerap karbon?',
    answer: 'Ya. Lautan menyerap sekitar seperempat emisi CO₂ yang dihasilkan manusia, tetapi penyerapan ini juga menyebabkan pengasaman laut yang berdampak pada ekosistem.',
  },
  {
    icon: 'mail',
    question: 'Benarkah email menghasilkan emisi?',
    answer: 'Setiap email membutuhkan energi untuk dikirim, disimpan, dan dibaca. Menghapus email yang tidak diperlukan dan mengurangi lampiran besar adalah langkah kecil yang bisa dilakukan.',
  },
]

function Edukasi() {
  const [openFact, setOpenFact] = useState(null)

  const toggleFact = (index) => {
    setOpenFact((currentIndex) => (currentIndex === index ? null : index))
  }

  return (
    <section className="facts page-container" id="edukasi">
      <div className="section-heading">
        <p className="section-heading__eyebrow">Kenali dampaknya</p>
        <h2>Fakta Karbon &amp; Alam</h2>
      </div>
      <div className="facts__list">
        {facts.map((fact, index) => {
          const isOpen = openFact === index
          const answerId = `fact-answer-${index}`

          return (
            <article className={`fact${isOpen ? ' fact--open' : ''}`} key={fact.question}>
              <button
                className="fact__trigger"
                type="button"
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() => toggleFact(index)}
              >
                <span className="fact__label">
                  <span className="fact__icon material-symbols-outlined" aria-hidden="true">{fact.icon}</span>
                  <span>{fact.question}</span>
                </span>
                <span className="fact__toggle material-symbols-outlined" aria-hidden="true">
                  {isOpen ? 'remove' : 'add'}
                </span>
              </button>
              <div className="fact__answer" id={answerId} hidden={!isOpen}>
                <p>{fact.answer}</p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default Edukasi
