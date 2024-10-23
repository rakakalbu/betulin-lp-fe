import React, { useState, useEffect } from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'; // Font Awesome Icons
import AOS from 'aos'; // Import AOS
import 'aos/dist/aos.css'; // Import AOS styles
import '../styles/BlogKategori.css'; // Custom CSS

const BlogKategori = () => {
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: true, // Ensure animation occurs only once
    });
  }, []);

  // Dummy Data for blog posts
  const dummyPosts = [
    { id: 1, title: "5 Tips for Home Improvement", excerpt: "Improve your home with these top 5 tips. From DIY repairs to smart renovations, we have you covered.", author: "admin", date: "Rabu, 12 Oktober 2024", image: "https://via.placeholder.com/300x200?text=Home+Improvement" },
    { id: 2, title: "Choosing the Best Paint Colors", excerpt: "Explore the latest trends in paint colors and find the perfect shade to transform your living space.", author: "admin", date: "Kamis, 13 Oktober 2024", image: "https://via.placeholder.com/300x200?text=Paint+Colors" },
    { id: 3, title: "Maximizing Small Spaces", excerpt: "Learn how to make the most of your small living spaces with smart furniture and organization.", author: "admin", date: "Jumat, 14 Oktober 2024", image: "https://via.placeholder.com/300x200?text=Small+Spaces" },
    { id: 4, title: "The Future of Smart Homes", excerpt: "Discover the latest innovations in smart home technology and how they can simplify your life.", author: "admin", date: "Sabtu, 15 Oktober 2024", image: "https://via.placeholder.com/300x200?text=Smart+Homes" },
    { id: 5, title: "Bathroom Renovation Ideas", excerpt: "Upgrade your bathroom with these simple yet effective renovation ideas for a modern look.", author: "admin", date: "Minggu, 16 Oktober 2024", image: "https://via.placeholder.com/300x200?text=Bathroom+Renovation" },
  ];

  const postsPerPage = 3; // Change this if you want more/less posts per page
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = dummyPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(dummyPosts.length / postsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of the section when pagination is clicked
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Makes the scroll smooth
    });
  };

  return (
    <section className="blog-kategori-section">
      {/* Category Title */}
      <div className="blog-kategori-header" data-aos="fade-up">
        <h2>Home Improvement</h2>
        <div className="blog-kategori-underline"></div>
      </div>
      <div className="blog-kategori-content-wrapper" data-aos="fade-up">
        {/* Left Side: Post Cards and Pagination */}
        <div className="blog-kategori-left">
          <div className="blog-kategori-post-cards">
            {currentPosts.map((post, index) => (
              <div className="blog-kategori-post-card" key={post.id} data-aos="fade-up" data-aos-delay={`${index * 200}`}>
                <img src={post.image} alt={post.title} className="blog-kategori-post-image" />
                <div className="blog-kategori-post-details">
                  <h2>
                    <a href={`/posts/${post.id}`}>{post.title}</a>
                  </h2>
                  <p className="author-date">
                    {post.author} | {post.date}
                  </p>
                  <p className="excerpt-post-category">{post.excerpt}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="blog-kategori-pagination" data-aos="fade-up">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Trending Posts, Social Media, Banners */}
        <div className="blog-kategori-right" data-aos="fade-left">
          {/* Trending Posts */}
          <div className="trending-posts">
            <h3>Post Terpopuler</h3>
            {dummyPosts.slice(0, 3).map((post, index) => (
              <div className="trending-post" key={post.id} data-aos="fade-right" data-aos-delay={`${index * 200}`}>
                <img src={post.image} alt={post.title} className="trending-post-image" />
                <div className="trending-post-details">
                  <h4>{post.title}</h4>
                  <p className="author-date">{post.author} | {post.date}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Social Media Section */}
          <div className="social-media-section" data-aos="fade-left">
            <h3>Follow Us</h3>
            <ul className="social-media-list">
              <li><FaFacebook /> <a href="https://facebook.com">Facebook</a></li>
              <li><FaTwitter /> <a href="https://twitter.com">Twitter</a></li>
              <li><FaInstagram /> <a href="https://instagram.com">Instagram</a></li>
            </ul>
          </div>

          {/* Banners */}
          <div className="banner-section" data-aos="fade-left">
            <div className="banner">
              <h4>Special Offers!</h4>
              <a href="/offers" className="banner-btn">Check Offers</a>
            </div>
            <div className="banner">
              <h4>Get a Free Quote!</h4>
              <a href="/quote" className="banner-btn">Request Quote</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogKategori;