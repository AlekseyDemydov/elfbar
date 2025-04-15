import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';
import logoWhite from './img/logo.png';
import logoBlack from './img/logo.png';
import tgblack from './img/tgblack.png';
import tgwhite from './img/tgwhite.png';
import s from './Header.module.scss';
import './Header.css';

export const Header = () => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  // const [showTopFix, setShowTopFix] = useState(false); // Доданий стан для показу topFix

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

    // Перевірка для показу topFix
    // if (window.scrollY > 80) { // Змініть 100 на потрібну висоту, при якій topFix повинен з'явитися
    //   setShowTopFix(true);
    // } else {
    //   setShowTopFix(false);
    // }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClickAdmin = () => {
    window.open('https://t.me/anatolyi_st', '_blank');
  };

  const handleClickGrupp = () => {
    window.open('https://t.me/+O4zrgmh52CYyYzhi', '_blank');
  };

  return (
    <>
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
          <Navbar.Brand className="fs-1 linkLogo" as={Link} to="/">
            <img
              src={scrolling ? logoWhite : logoBlack}
              alt="Logo"
              className={s.logo}
            />
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
                to="/"
                onClick={handleNavClick}
                style={navLinkStyles('/')}
              >
                КАТАЛОГ
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/feedback"
                onClick={handleNavClick}
                style={navLinkStyles('/feedback')}
              >
                ВІДГУКИ
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/question"
                onClick={handleNavClick}
                style={navLinkStyles('/question')}
              >
                ПИТАННЯ
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/contacts"
                onClick={handleNavClick}
                style={navLinkStyles('/contacts')}
              >
                КОНТАКТИ
              </Nav.Link>
            </Nav>
            <div className={s.tgBox}>
              <div onClick={handleClickAdmin}>
                <img
                  src={scrolling ? tgblack : tgwhite}
                  alt="tg"
                  className={s.telegramLink}
                />
              </div>

              <button
                onClick={handleClickGrupp}
                className={`${s.btnSignTG} ${scrolling ? s.scrolledBtn : ''}`}
              >
                Підписатися на Telegram
              </button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* Відображення topFix */}
      {/* {showTopFix && ( */}
        <div className={`${s.topFix} ${scrolling ? s.scrolledtopFix : ''}`}>
          <p>Підписуйся, щоб не пропустити новинки та поповнення!</p>
          <button onClick={handleClickGrupp} className={s.btnSignTGScroll}>
            Telegram
          </button>
        </div>
      {/* )} */}
    </>
  );
};
