import React, { useState, useEffect } from 'react';
import s from './Layout.module.scss';
import { ReactComponent as ChatBtn } from './img/chat.svg';
import { ReactComponent as CloseIcon } from './img/close.svg';
import { ReactComponent as Telegram } from './img/telegram.svg';
import { ReactComponent as Viber } from './img/viber.svg';
import { Outlet } from 'react-router-dom';
import { Header } from 'pages/Header/Header';
import BasketMenu from 'pages/Basket/BasketMenu/BasketMenu';

export const Layout = () => {
  const [showAdditionalButtons, setShowAdditionalButtons] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    setOrders(storedOrders);
  }, []);

  const handleBuy = newOrders => {
    setOrders(newOrders);
    localStorage.setItem('orders', JSON.stringify(newOrders));
  };

  const handleBuyClick = () => {
    setShowAdditionalButtons(!showAdditionalButtons);
  };
  const handleClickTGAdmin = () => {
    window.open('https://t.me/anatolyi_st', '_blank');
  };
  const handleClickVBAdmin = () => {
    window.open('viber://add?number=380994363382', '_blank');
  };
  return (
    <>
      <div className={s.container}>
        <Header />
        <div className={s.body}>
          <Outlet context={{ orders, handleBuy }} />
          <button onClick={handleBuyClick} className={s.btnChat}>
            <div className={s.iconWrapper}>
              <ChatBtn
                className={`${s.icon} ${showAdditionalButtons ? s.hidden : ''}`}
              />
              <CloseIcon
                className={`${s.icon} ${
                  !showAdditionalButtons ? s.hidden : ''
                }`}
              />
            </div>
          </button>
          <div
            className={`${s.additionalButtons} ${
              showAdditionalButtons ? s.show : ''
            }`}
          >
            <button onClick={handleClickTGAdmin} className={s.additionalBtnTG}>
              <Telegram />
            </button>
            <button onClick={handleClickVBAdmin} className={s.additionalBtnVB}>
              <Viber />
            </button>
          </div>
          {orders.length > 0 && (
            <BasketMenu orders={orders} onUpdateOrder={setOrders} />
          )}
        </div>
      </div>
    </>
  );
};
