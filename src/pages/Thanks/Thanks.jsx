import React from 'react';
import styles from './Thanks.module.scss'; 

const Thanks = () => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'purchase',
  });
  const handleClickGrupp = () => {
    window.open('https://t.me/+O4zrgmh52CYyYzhi', '_blank');
  };
  return (
    <div className={styles['thanks-container']}>
      <h1 className={styles['thanks-title']}>Дякуємо за ваше замовлення!</h1>
      <p className={styles['thanks-message']}>
        Протягом 30 хвилин з Вами зв'яжуться для підтвердження замовлення.
      </p>
      <br />
      <p className={styles['thanks-message']}>
      А тим часом підписуйтесь на наш телеграм канал, щоб не пропустити новинки.
      </p>
      <button
                onClick={handleClickGrupp}
                className={`${styles.btnSignTG} `}
              >
                Підписатися на Telegram
              </button>
    </div>
  );
};

export default Thanks;
