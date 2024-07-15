import React from 'react';
import styles from './Thanks.module.scss'; 

const Thanks = () => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'purchase',
  });
  return (
    <div className={styles['thanks-container']}>
      <h1 className={styles['thanks-title']}>Дякуємо за ваше замовлення!</h1>
      <p className={styles['thanks-message']}>
        Протягом 30 хвилин з Вами зв'яжуться для підтвердження замовлення.
      </p>
    </div>
  );
};

export default Thanks;
