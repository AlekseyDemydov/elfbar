import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Notiflix from 'notiflix';
import s from './Basket.module.scss';

const Basket = () => {
  const [orders, setOrders] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const ordersFromStorage = localStorage.getItem('orders');
    if (ordersFromStorage) {
      setOrders(JSON.parse(ordersFromStorage));
    }
  }, []);

  const handleQuantityChange = (index, newQuantity) => {
    const updatedOrders = [...orders];
    updatedOrders[index].count = newQuantity;
    setOrders(updatedOrders);
    updateTotalPrice(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const updateTotalPrice = updatedOrders => {
    let totalPrice = updatedOrders.reduce((acc, curr) => {
      return acc + curr.price * curr.count;
    }, 0);
    setTotalPrice(totalPrice);
  };

  useEffect(() => {
    updateTotalPrice(orders);
  }, [orders]);

  const TOKEN = '5929832704:AAH-RXP0_n5acEoTgDqHJjUWgdvN7ORkM2U';
  const CHAT = '-1001889830077';
  const URI_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

  const Send = e => {
    e.preventDefault();

    if (name === '') {
      Notiflix.Notify.failure('введіть ім`я');
    } else if (message === '') {
      Notiflix.Notify.failure('введіть повідомлення');
    } else if (orders.length === 0) {
      Notiflix.Notify.failure('Ваш кошик порожній');
    } else {
      let orderMessage = '';
      orders.forEach(order => {
        orderMessage += `<b>${order.name}</b> - ${order.count} шт., ${order.price} грн\n`;
      });

      axios
        .post(URI_API, {
          chat_id: CHAT,
          parse_mode: 'html',
          text: `<b>Новий заказ</b>\n<b>Ім'я: </b>${name}\n<b>Повідомлення: </b>${message}\n<b>Замовлення:\n</b>${orderMessage}\n<b>Загальна сума: </b>${totalPrice} грн`,
        })
        .then(res => {
          Notiflix.Notify.success('Замовлення відправлено');
          setOrders([]);
          setTotalPrice(0);
          localStorage.removeItem('orders');
        })
        .catch(err => {
          Notiflix.Notify.failure('Виникла помилка під час відправки замовлення');
        });
    }
  };

  return (
    <div>
      <h2>Ваші замовлення:</h2>
      {orders.length === 0 && <p>кошик порожній </p>}
      {orders.length > 0 &&
        orders.map((order, index) => (
          <div key={index} className={s.orderItem}>
            
            <p>{order.name}</p>
            <p>Смак: {order.flavor}</p>
            <p>Ціна за одиницю: {order.price}</p>
            <div className={s.quantityControl}>
              <button onClick={() => handleQuantityChange(index, order.count - 1)}>-</button>
              <span>{order.count}</span>
              <button onClick={() => handleQuantityChange(index, order.count + 1)}>+</button>
            </div>
          </div>
        ))}
      {orders.length > 0 && <p>Загальна вартість: {totalPrice}</p>}

      {orders.length > 0 && (
        <form id="form" className={s.form}>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className={s.input}
            placeholder="Введіть ім'я"
          />
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            className={s.input}
            placeholder="Введіть повідомлення"
          />
          <button type="submit" onClick={Send} className={s.btmForm}>
            Відправити замовлення
          </button>
        </form>
      )}
    </div>
  );
};

export default Basket;