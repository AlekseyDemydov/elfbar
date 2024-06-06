
import logo from './img/logo.png';
import s from './Header.module.scss';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

export const Header = () => {
  const userEmail = localStorage.getItem('adminEmail') || '';
 
  return (
    <>
      <header className={s.header}>
        <nav className={s.nav}>
          <Link to="/elfbar">
            <img src={logo} alt="" className={s.logo} />
          </Link>
          {userEmail === 'ivan@gmail.com' && (
        <NavLink
          to="/elfbar/products/add"
          style={({ isActive }) => ({
            border: isActive ? '3px solid rgb(8, 7, 7)' : '1px solid rgb(8, 7, 7)',
          })}
          className={s.btnCreate}
        >
          Створити
        </NavLink>
      )}
        </nav>
        
        </header>

    </>
  );
};
