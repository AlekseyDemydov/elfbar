import s from './Layout.module.scss';
import { ReactComponent as BasketLogo } from './img/chat.svg';
import { Outlet } from 'react-router-dom';
import { Header } from 'pages/Header/Header';

export const Layout = () => {
  return (
    <>
      <div className={s.container}>
       <Header/>
        <div className={s.body}>
        <button 
        // onClick={handleBuyClick} 
        className={s.btnBasket}>
        <BasketLogo className={s.imgBasket} />
       
      </button>
          <Outlet />
        </div>
      </div>
    </>
  );
};
