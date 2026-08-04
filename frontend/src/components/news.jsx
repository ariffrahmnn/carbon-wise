const newsItems = [
  {
    id: 'news1',
    title: 'Emisi dari Sektor Transportasi: Seberapa Besar Dampak Perjalanan Harian Kita?',
    category: 'Transportasi',
    icon: 'directions_car',
    link: '/news1',
  },
  {
    id: 'news2',
    title: 'Food Miles: Seberapa Jauh Makananmu Bepergian Sebelum Sampai di Piring?',
    category: 'Jejak Karbon & Pangan',
    icon: 'restaurant',
    link: '/news2',
  },
  {
    id: 'news3',
    title: 'Jejak Karbon Digital: Apakah Aktivitas Internet Juga Menyumbang Emisi?',
    category: 'Digital & IT',
    icon: 'public',
    link: '/news3',
  },
  {
    id: 'news4',
    title: 'Pengolahan Sampah dan Dampaknya Terhadap Emisi Metana',
    category: 'Pengolahan Sampah',
    icon: 'delete_sweep',
    link: '/news4',
  },
  {
    id: 'news5',
    title: 'Mengapa Hutan Merupakan Benteng Pertahanan Utama Melawan Perubahan Iklim?',
    category: 'Konservasi Hutan',
    icon: 'forest',
    link: '/news5',
  },
  {
    id: 'news6',
    title: 'Dampak Industri Pakaian Terhadap Emisi Karbon Global',
    category: 'Gaya Hidup & Tekstil',
    icon: 'checkroom',
    link: '/news6',
  },
]

function News() {
  return (
    <section className="news page-container" id="news" aria-labelledby="news-title">
      <div className="news__heading">
        <div>
          <p className="section-heading__eyebrow">Cerita terbaru</p>
          <h2 id="news-title">News &amp; Insights</h2>
        </div>
        <p>Ikuti kabar dan insight terbaru seputar iklim, alam, dan langkah kecil yang bisa kita mulai hari ini.</p>
      </div>
      <div className="news__list">
        {newsItems.map((item) => (
          <article className="news-item" key={item.title}>
            <div className="news-item__icon material-symbols-outlined" aria-hidden="true">{item.icon}</div>
            <div className="news-item__content">
              <p className="news-item__meta">{item.category}</p>
              <h3>{item.title}</h3>
              <a href={item.link}>
                Baca selengkapnya <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default News
