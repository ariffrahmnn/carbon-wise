const newsItems = [
  {
    title: 'Mengapa emisi karbon perlu kita pahami bersama?',
    category: 'Perubahan iklim',
    icon: 'public',
  },
  {
    title: 'Lima kebiasaan sederhana untuk hidup lebih rendah karbon',
    category: 'Aksi harian',
    icon: 'tips_and_updates',
  },
  {
    title: 'Menjaga hutan berarti menjaga masa depan bumi',
    category: 'Alam',
    icon: 'forest',
  },
]

function News() {
  return (
    <section className="news page-container" id="news" aria-labelledby="news-title">
      <div className="news__heading">
        <div>
          <p className="section-heading__eyebrow">Cerita terbaru</p>
          <h2 id="news-title">News</h2>
        </div>
        <p>Ikuti kabar dan insight terbaru seputar iklim, alam, dan langkah kecil yang bisa kita mulai hari ini.</p>
      </div>
      <div className="news__list">
        {newsItems.map((item) => (
          <article className="news-item" key={item.title}>
            <div className="news-item__icon material-symbols-outlined" aria-hidden="true">{item.icon}</div>
            <div className="news-item__content">
              <p className="news-item__meta">{item.category} · {item.date}</p>
              <h3>{item.title}</h3>
              <a href="#news">Baca selengkapnya <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span></a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default News
