import './Header.css';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { getCurrentUser } from '../actions/auth';

const Header = ({ isSignedIn, getCurrentUser }) => {
  useEffect(() => {
    const init = async () => {
      await getCurrentUser();
    };
    init();
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
  }, [getCurrentUser]);

  return (
    <header className="header">
      <ul className="header-nav-ul">
        <li>
          <Link to="/">HOME</Link>
        </li>
        <li>
          <Link to="/tags">TAGS</Link>
        </li>
        {isSignedIn ? (
          <li>
            <Link to="/logout">LOGOUT</Link>
          </li>
        ) : (
          <li>
            <Link to="/login">LOGIN</Link>
          </li>
        )}
      </ul>
      <div className="header-banner">
        <img src="/head-bg.jpg" alt="BG" />
        <h1>Legend's Guide Archive</h1>
      </div>
    </header>
  );
};

const mapStateToProps = (state) => {
  return {
    isSignedIn: state.auth.isSignedIn,
  };
};

export default connect(mapStateToProps, { getCurrentUser })(Header);
