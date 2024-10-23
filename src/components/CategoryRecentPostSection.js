import React, { useEffect } from 'react';
import AOS from 'aos'; // Import AOS
import 'aos/dist/aos.css'; // Import AOS styles
import '../styles/CategoryRecentPostSection.css'; // Keeping the file name the same
import image1 from '../assets/images/layanan-img.png';
import image2 from '../assets/images/layanan-img.png';
import image3 from '../assets/images/layanan-img.png';

const CategoryRecentPostSection = () => {
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      once: true, // Trigger animation only once when scrolled into view
    });
  }, []);

  const posts = [
    {
      image: image1,
      title: 'Post 1',
      author: 'John Doe',
      date: 'October 12, 2024',
      excerpt: 'This is a short description of post 1 from the category.',
      link: '/post-1',
    },
    {
      image: image2,
      title: 'Post 2',
      author: 'Jane Smith',
      date: 'October 13, 2024',
      excerpt: 'This is a short description of post 2 from the category.',
      link: '/post-2',
    },
    {
      image: image3,
      title: 'Post 3',
      author: 'Alice Johnson',
      date: 'October 14, 2024',
      excerpt: 'This is a short description of post 3 from the category.',
      link: '/post-3',
    },
  ];

  return (
    <section className="custom-category-recent-post" data-aos="fade-up">
      <div className="custom-category-header" data-aos="fade-right">
        <h2>Technology</h2>
        <div className="custom-underline"></div>
      </div>
      <div className="custom-category-posts">
        {posts.map((post, index) => (
          <div key={index} className="custom-category-post" data-aos="zoom-in" data-aos-delay={`${index * 200}`}>
            <div className="custom-post-image">
              <img src={post.image} alt={post.title} />
            </div>
            <div className="custom-post-info">
              <small className="custom-post-author-date">
                {post.author} • {post.date}
              </small>
              <h3 className="custom-post-title">{post.title}</h3>
              <p className="custom-post-excerpt">{post.excerpt}</p>
              <a href="/blog-post" className="custom-post-detail-button">
                Lihat Detail
              </a>
            </div>
          </div>
        ))}
      </div>
      <div className="custom-category-more" data-aos="fade-up">
        <a href="/blog-kategori" className="custom-more-link">
          Lainnya &gt;
        </a>
      </div>
    </section>
  );
};

export default CategoryRecentPostSection;