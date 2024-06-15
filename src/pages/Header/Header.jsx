import logo from './img/logo.png';
import s from './Header.module.scss';
import './Header.css'
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import { useState } from 'react';


export const Header = () => {
  const [activeKey, setActiveKey] = useState(window.location.pathname);
  const userEmail = localStorage.getItem('adminEmail') || '';

  return (
    <>
      <header className={s.header}>
        <nav className={s.nav}>
          <div>
            <Link to="/elfbar">
            <img src={logo} alt="" className={s.logo} />
          </Link>
          {userEmail === 'ivan@gmail.com' && (
            <NavLink
              to="/elfbar/products/add"
              style={({ isActive }) => ({
                border: isActive
                  ? '3px solid rgb(8, 7, 7)'
                  : '1px solid rgb(8, 7, 7)',
              })}
              className={s.btnCreate}
            >
              Створити
            </NavLink>
          )}
          </div>
          

          <Nav
            variant="underline"
            activeKey={activeKey}
            onSelect={selectedKey => setActiveKey(selectedKey)}
            
          >
            <Nav.Item>
              <Nav.Link href="/elfbar" eventKey="/elfbar"  className={activeKey === "/elfbar" ? "active-nav-link" : "nav-link"}>
                КАТАЛОГ
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="link-1">ВІДГУКИ</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="link-2">ПИТАННЯ</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/elfbar/contacts" eventKey="/elfbar/contacts">
                КОНТАКТИ
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <div>
            <button className={s.btnSignTG}>Підписатися на Telegram</button>
          </div>
        </nav>


      </header>





    </>
  );
};
