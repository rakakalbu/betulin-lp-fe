import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify'; // Import DOMPurify for sanitization
import { FaFacebook, FaTwitter, FaInstagram, FaTiktok, FaShareAlt, FaYoutube, FaWhatsapp, FaDiscord, FaSpotify } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/PostSection.css';
import { useLoading } from '../contexts/LoadingContext';

const PostSection = ({ post }) => {
  const [randomArticles, setRandomArticles] = useState([]);
  const [socialMediaLinks, setSocialMediaLinks] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL || '';
  const { showLoading, hideLoading } = useLoading();

  // Map of social media names to icons
  const socialMediaIcons = {
    threads: <FaFacebook />,
    twitter: <FaTwitter />,
    instagram: <FaInstagram />,
    tiktok: <FaTiktok />,
    youtube: <FaYoutube />,
    whatsapp: <FaWhatsapp />,
    discord: <FaDiscord />,
    spotify: <FaSpotify />,
  };

  // Initialize AOS for animations
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const fetchRandomArticles = async () => {
      showLoading();
      try {
        const totalResponse = await fetch(`${apiUrl}/api/artikels?pagination[pageSize]=1`);
        const totalData = await totalResponse.json();
        const totalArticles = totalData.meta.pagination.total;
        const totalPages = Math.ceil(totalArticles / 3);
        const randomPage = Math.floor(Math.random() * totalPages) + 1;

        const response = await fetch(
          `${apiUrl}/api/artikels?populate=*&pagination[page]=${randomPage}&pagination[pageSize]=3`
        );
        const data = await response.json();

        setRandomArticles(data.data);
      } catch (error) {
        console.error('Error fetching random articles:', error);
      } finally {
        hideLoading();
      }
    };

    const fetchSocialMediaLinks = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/social-media-footers`);
        const data = await response.json();
        setSocialMediaLinks(data.data);
      } catch (error) {
        console.error('Error fetching social media links:', error);
      }
    };

    fetchRandomArticles();
    fetchSocialMediaLinks();
  }, [apiUrl]);

  // Function to copy post link to clipboard
  const copyLinkToClipboard = () => {
    const postUrl = window.location.href;
    const postDate = new Date(post.TglArtikel).toLocaleDateString();
    const shareText = `Postingan ini dipublish oleh pihak Betulin dan merupakan properti PT. Rumah Masa Kini. ${postDate}`;
    const textToCopy = `${postUrl}\n\n${shareText}`;

    navigator.clipboard.writeText(textToCopy)
      .then(() => alert("Link and message copied to clipboard!"))
      .catch((error) => console.error("Error copying text to clipboard:", error));
  };

  // Sanitize the featured image URL
  const featuredImageUrl = post.FeaturedImage?.formats?.large?.url
    ? `${apiUrl}${post.FeaturedImage.formats.large.url}`
    : post.FeaturedImage?.url
    ? `${apiUrl}${post.FeaturedImage.url}`
    : null;

  // Function to render article details
  const renderDetailArtikel = (detail) => {
    switch (detail.type) {
      case 'paragraph':
        return (
          <div key={detail.children[0].text}>
            <p>
              {detail.children.map((child) => (
                <span
                  key={child.text}
                  style={child.bold ? { fontWeight: 'bold' } : child.italic ? { fontStyle: 'italic' } : {}}
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(child.text) }} // Sanitize before rendering
                />
              ))}
            </p>
          </div>
        );
      case 'heading':
        const HeadingTag = `h${detail.level}`;
        return (
          <div key={detail.children[0].text}>
            <HeadingTag>
              {detail.children.map((child) => (
                <span key={child.text} style={child.bold ? { fontWeight: 'bold' } : child.italic ? { fontStyle: 'italic' } : {}}>
                  {DOMPurify.sanitize(child.text)} {/* Sanitize heading text */}
                </span>
              ))}
            </HeadingTag>
            <br />
          </div>
        );
      case 'list':
        const ListTag = detail.format === 'ordered' ? 'ol' : 'ul';
        return (
          <div key={detail.format}>
            <ListTag>
              {detail.children.map((item, index) => (
                <li key={index}>
                  {item.children.map((child) => (
                    <span key={child.text} style={child.bold ? { fontWeight: 'bold' } : child.italic ? { fontStyle: 'italic' } : {}}>
                      {DOMPurify.sanitize(child.text)} {/* Sanitize list item text */}
                    </span>
                  ))}
                </li>
              ))}
            </ListTag>
            <br />
          </div>
        );
      case 'quote':
        return (
          <div key={detail.children[0].text}>
            <blockquote style={{ margin: '1em 0', padding: '0.5em 1em', borderLeft: '3px solid #ccc', color: '#555' }}>
              {detail.children.map((child) => (
                <span key={child.text} style={child.bold ? { fontWeight: 'bold' } : child.italic ? { fontStyle: 'italic' } : {}}>
                  {DOMPurify.sanitize(child.text)} {/* Sanitize quote text */}
                </span>
              ))}
            </blockquote>
            <br />
          </div>
        );
      case 'image':
        return (
          <div key={detail.image.url}>
            <img
              src={detail.image.url}
              alt={detail.image.alternativeText}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            <br />
          </div>
        );
      case 'link':
        return (
          <a key={detail.url} href={detail.url} target="_blank" rel="noopener noreferrer">
            {detail.children.map((child) => (
              <span key={child.text} style={child.bold ? { fontWeight: 'bold' } : child.italic ? { fontStyle: 'italic' } : {}}>
                {DOMPurify.sanitize(child.text)} {/* Sanitize link text */}
              </span>
            ))}
          </a>
        );
      default:
        return null;
    }
  };

  return (
    <section className="post-section-page" data-aos="fade-up">
      <div className="post-section-content-wrapper">
        <div className="post-section-left" data-aos="fade-up">
          <p className="post-section-category">{post.kategori_artikel?.NamaKategori}</p>
          <h1 className="post-section-title">{post.TitleArtikel}</h1>

          {featuredImageUrl && (
            <div className="post-section-image-container" data-aos="zoom-in">
              <img
                src={featuredImageUrl}
                alt={post.TitleArtikel}
                className="post-section-featured-image"
              />
              <div className='post-section-image-source'>Sumber: {post.SumberFoto}</div>
            </div>
          )}

          <div className="post-section-meta" data-aos="fade-up" data-aos-delay="200">
            <p>By {post.penulis_artikel?.NamaPenulis} | {new Date(post.TglArtikel).toLocaleDateString()}</p>
            <div className="post-section-share-post" onClick={copyLinkToClipboard}>
              <FaShareAlt /> <span>Share this post</span>
            </div>
          </div>

          <div className="post-section-content" data-aos="fade-up" data-aos-delay="400">
            {post.DetailArtikel.map((block, index) => renderDetailArtikel(block))}
          </div>

          <div className="post-section-tags" data-aos="fade-up" data-aos-delay="600">
            {post.tag_artikels.map((tag, index) => (
              <span key={index} className="post-section-tag">#{tag.NamaTag}</span>
            ))}
          </div>
        </div>

        <div className="post-section-right" data-aos="fade-left">
          <div className="post-section-trending-posts" data-aos="fade-up" data-aos-delay="200">
            <h3>Baca Juga Ini</h3>
            {randomArticles.map((randomPost) => (
              <div 
                key={randomPost.id} 
                className="post-section-trending-post-link"
                onClick={() => {
                  // Navigate to the new article and reload the page
                  window.location.href = `/blog-post/${randomPost.ArtikelSlug}`;
                }}
                style={{ cursor: 'pointer', transition: 'transform 0.2s', padding: '10px', borderRadius: '5px' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)'; // Scale up on hover
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'; // Scale back on mouse leave
                }}
              >
                <div className="post-section-trending-post" key={randomPost.id}>
                  <img
                    src={`${apiUrl}${randomPost.FeaturedImage?.formats?.small?.url || ''}`}
                    alt={randomPost.TitleArtikel}
                    className="post-section-trending-post-image"
                  />
                  <div className="post-section-trending-post-details">
                    <h4>{randomPost.TitleArtikel}</h4>
                    <p className="author-date">
                      <span>{randomPost.penulis_artikel?.NamaPenulis}</span> | 
                      <span>{new Date(randomPost.TglArtikel).toLocaleDateString()}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="post-section-social-media-section" data-aos="fade-up" data-aos-delay="300">
            <h3>Follow Us</h3>
            <ul className="post-section-social-media-list">
              {socialMediaLinks.map((link) => (
                <li key={link.id}>
                  {socialMediaIcons[link.SocialMedia] || null} {/* Show icon if available */}
                  <a href={`https://${link.SocialMediaLink}`} target="_blank" rel="noopener noreferrer">
                    {link.SocialMedia.charAt(0).toUpperCase() + link.SocialMedia.slice(1)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="post-section-banner-section">
            <div className="post-section-banner" data-aos="fade-up" data-aos-delay="400">
              <h4>Kamu Bingung? Hubungi CS Kami</h4>
              <a href="#" className="post-section-banner-btn">Hubungi</a>
            </div>
            <div className="post-section-banner" data-aos="fade-up" data-aos-delay="600">
              <h4>Yuk, Download Betulin dan dapatkan voucher menarik!</h4>
              <a href="#" className="post-section-banner-btn">Download</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostSection;
