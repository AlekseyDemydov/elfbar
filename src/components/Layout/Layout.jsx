import React, { useState } from 'react';
import s from './Layout.module.scss';
import { ReactComponent as BasketLogo } from './img/chat.svg';
import { ReactComponent as CloseIcon } from './img/close.svg';
import { ReactComponent as Telegram } from './img/telegram.svg';
import { ReactComponent as Viber } from './img/viber.svg';
import { Outlet } from 'react-router-dom';
import { Header } from 'pages/Header/Header';

export const Layout = () => {
  const [showAdditionalButtons, setShowAdditionalButtons] = useState(false);

  const handleBuyClick = () => {
    setShowAdditionalButtons(!showAdditionalButtons);
  };

  return (
    <>
      <div className={s.container}>
        <Header />
        <div className={s.body}>
        <Outlet />
        
          <button onClick={handleBuyClick} className={s.btnBasket}>
            <div className={s.iconWrapper}>
              <BasketLogo className={`${s.icon} ${showAdditionalButtons ? s.hidden : ''}`} />
              <CloseIcon className={`${s.icon} ${!showAdditionalButtons ? s.hidden : ''}`} />
            </div>
          </button>
          <div className={`${s.additionalButtons} ${showAdditionalButtons ? s.show : ''}`}>
          <button className={s.additionalBtnTG}><Telegram/></button>
          <button className={s.additionalBtnVB}><Viber/></button>
          </div>
          
        </div>
      </div>
    </>
  );
};

