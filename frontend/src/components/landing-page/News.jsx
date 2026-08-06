import kemacetanImg from '../../assets/kemacetan.jpg'
import kapalImg from '../../assets/kapal.jpg'
import internetImg from '../../assets/internet.jpg'
import sampahImg from '../../assets/sampah.jpg'
import asalKarbonImg from '../../assets/asalkarbon.jpg'
import mobilListrikImg from '../../assets/mobillistrik.jpg'

const newsItems = [
  {
    id: 'news1',
    title: 'Emisi dari Sektor Transportasi: Seberapa Besar Dampak Perjalanan Harian Kita?',
    category: 'Transportasi',
    icon: 'directions_car',
    image: kemacetanImg,
    link: '/news1',
  },
  {
    id: 'news2',
    title: 'Food Miles: Seberapa Jauh Makananmu Bepergian Sebelum Sampai di Piring?',
    category: 'Jejak Karbon & Pangan',
    icon: 'restaurant',
    image: kapalImg,
    link: '/news2',
  },
  {
    id: 'news3',
    title: 'Jejak Karbon Digital: Apakah Aktivitas Internet Juga Menyumbang Emisi?',
    category: 'Digital & IT',
    icon: 'public',
    image: internetImg,
    link: '/news3',
  },
  {
    id: 'news4',
    title: 'Pengolahan Sampah dan Dampaknya Terhadap Emisi Metana',
    category: 'Pengolahan Sampah',
    icon: 'delete_sweep',
    image: sampahImg,
    link: '/news4',
  },
  {
    id: 'news5',
    title: 'Apakah Mobil Listrik Benar-Benar Bebas Emisi dan Ramah Lingkungan?',
    category: 'Konservasi Hutan',
    icon: 'forest',
    image: mobilListrikImg,
    link: '/news5',
  },
  {
    id: 'news6',
    title: 'Karbon Dioksida (CO₂) , Kenali Bahaya dan Sumbernya',
    category: 'Gaya Hidup & Tekstil',
    icon: 'checkroom',
    image: asalKarbonImg,
    link: '/news6',
  },
]

function News() {
  return (
    <section className="news page-container" id="news" aria-labelledby="news-title">
      <div className="news__heading">
        <div>
          <h2 id="news-title">News &amp; Insights</h2>
        </div>
      </div>
      <div className="news__list">
        {newsItems.map((item) => (
          <article className="news-item" key={item.title}>
            <img className="news-item__image" src={item.image} alt={item.title} />
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
