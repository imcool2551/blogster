import './Header.css';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  useEffect(() => {
    const toggleNavbar = () => {
      if (window.pageYOffset > 250) {
        document
          .querySelector('.header-nav-ul')
          .classList.add('header-nav-ul-invisible');
      } else {
        document
          .querySelector('.header-nav-ul')
          .classList.remove('header-nav-ul-invisible');
      }
    };
    document.addEventListener('scroll', toggleNavbar);
    return () => {
      document.removeEventListener('scroll', toggleNavbar);
    };
  }, []);

  return (
    <header className="header">
      <ul className="header-nav-ul">
        <li>
          <Link to="/">HOME</Link>
        </li>
        <li>
          <Link to="/tags">TAGS</Link>
        </li>
        <li>
          <Link to="/login">LOGIN</Link>
        </li>
      </ul>
      <div className="header-banner">
        <img src="/head-bg.jpg" alt="BG" />
        <h1>Legend's Guide Archive</h1>
      </div>
    </header>
  );
};

export default Header;
