import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from 'react-router-dom';
import '../styles/CategoryRecentPostSection.css';

const CategoryRecentPostSection = ({ category }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  useEffect(() => {
    const fetchCategoryPosts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/artikels?filters[kategori_artikel][id]=${category.id}&populate=*`);
        const data = await response.json();

        const baseUrl = process.env.REACT_APP_API_URL;

        // Sort data by TglArtikel in descending order (newest first)
        const sortedData = data.data.sort((a, b) => new Date(b.TglArtikel) - new Date(a.TglArtikel));

        const formattedPosts = sortedData.slice(0, 3).map((article) => {
          const imageFormats = article.FeaturedImage?.formats || {};
          const imageUrl = imageFormats.large?.url || imageFormats.medium?.url || imageFormats.small?.url || article.FeaturedImage?.url;

          return {
            image: imageUrl ? `${baseUrl}${imageUrl}` : null,
            title: article.TitleArtikel || 'Untitled',
            author: article.penulis_artikel?.NamaPenulis || 'Unknown Author',
            date: article.TglArtikel ? new Date(article.TglArtikel).toLocaleDateString() : 'Unknown Date',
            excerpt: article.ExcerptArtikel || '',
            link: `/blog-post/${article.ArtikelSlug}`,
          };
        });

        setPosts(formattedPosts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching category posts:', error);
        setLoading(false);
      }
    };

    fetchCategoryPosts();
  }, [category.id]);

  if (loading) {
    return (
      <div className="loading-placeholder">
        <div className="loading-spinner"></div>
        <p>Loading posts for {category.NamaKategori}...</p>
      </div>
    );
  }

  return (
    <section className="custom-category-recent-post" data-aos="fade-up">
      <div className="custom-category-header" data-aos="fade-right">
        <h2>
          <Link to={`/blog-kategori/${category.SlugKategori}`} className="custom-category-title-link">
            {category.NamaKategori}
          </Link>
        </h2>
        <div className="custom-underline"></div>
      </div>
      <div className="custom-category-posts">
        {posts.map((post, index) => (
          <div key={index} className="custom-category-post" data-aos="zoom-in" data-aos-delay={`${index * 200}`}>
            <div className="custom-post-image">
              {post.image ? (
                <img src={post.image} alt={post.title} />
              ) : (
                <div className="no-image-placeholder">No Image Available</div>
              )}
            </div>
            <div className="custom-post-info">
              <small className="custom-post-author-date">
                {post.author} • {post.date}
              </small>
              <h3 className="custom-post-title">
                <Link to={post.link}>{post.title}</Link>
              </h3>
              <p className="custom-post-excerpt">{post.excerpt}</p>
              <Link to={post.link} className="custom-post-detail-button">
                Lihat Detail
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="custom-category-more" data-aos="fade-up">
        <Link to={`/blog-kategori/${category.SlugKategori}`} className="custom-more-link">
          Lainnya &gt;
        </Link>
      </div>
    </section>
  );
};

export default CategoryRecentPostSection;
