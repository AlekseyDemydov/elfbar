import s from './Layout.module.scss';

import { Outlet } from 'react-router-dom';
import { Header } from 'pages/Header/Header';

export const Layout = () => {
  return (
    <>
      <div className={s.container}>
       <Header/>
        <div className={s.body}>
          <Outlet />
        </div>
      </div>
    </>
  );
};
