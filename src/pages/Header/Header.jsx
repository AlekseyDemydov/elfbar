import React, { useEffect, useState } from 'react';
import { useLocation, Link, NavLink } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';
import logoWhite from './img/logowhite.png'; // Білий логотип
import logoBlack from './img/logoblack.png'; // Чорний логотип
import tgblack from './img/tgblack.png';
import tgwhite from './img/tgwhite.png';
import s from './Header.module.scss';
import './Header.css'


export const Header = () => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const [scrolling, setScrolling] = useState(false);

  const userEmail = localStorage.getItem('adminEmail') || '';

  const handleNavClick = () => setExpanded(false);

  const navLinkStyles = path => ({
    fontWeight: 'bold',
    color:
      location.pathname === path ? '#ff5100' : scrolling ? 'black' : 'white',
  });

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setScrolling(true);
    } else {
      setScrolling(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Navbar
      fixed="top"
      collapseOnSelect
      expand="lg"
      variant="dark"
      className={`shadow-sm ${scrolling ? s.scrolled : ''}`}
      expanded={expanded}
      style={{ backgroundColor: scrolling ? 'white' : 'black' }}
    >
      <Container>
        <Navbar.Brand className="fs-1 linkLogo" as={Link} to="/elfbar">
          <div>
            <Link to="/elfbar">
              <img
                src={scrolling ? logoWhite : logoBlack}
                alt="Logo"
                className={s.logo}
              />
            </Link>
            {userEmail === 'ivan@gmail.com' && (
              <NavLink to="/elfbar/products/add" className={s.btnCreate}>
                Створити
              </NavLink>
            )}
          </div>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={() => setExpanded(!expanded)}
          style={{ backgroundColor: scrolling ? '#ff5100' : '' }}
        />
        <Navbar.Collapse
          id="responsive-navbar-nav"
          className="justify-content-end"
        >
          <Nav activeKey={location.pathname}>
            <Nav.Link
              as={Link}
              to="/elfbar"
              onClick={handleNavClick}
              style={navLinkStyles('/elfbar')}
            >
              КАТАЛОГ
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/elfbar/feedback"
              onClick={handleNavClick}
              style={navLinkStyles('/elfbar/feedback')}
            >
              ВІДГУКИ
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/elfbar/question"
              onClick={handleNavClick}
              style={navLinkStyles('/elfbar/question')}
            >
              ПИТАННЯ
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/elfbar/contacts"
              onClick={handleNavClick}
              style={navLinkStyles('/elfbar/contacts')}
            >
              КОНТАКТИ
            </Nav.Link>
          </Nav>
          <div className={s.tgBox}>
            <a href="https://t.me/DemFam" target="_blank" rel="noreferrer">
              <img
                src={scrolling ? tgblack : tgwhite}
                alt="tg"
                className={s.telegramLink}
              />
            </a>

            <button
              className={`${s.btnSignTG} ${scrolling ? s.scrolledBtn : ''}`}
            >
              Підписатися на Telegram
            </button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
