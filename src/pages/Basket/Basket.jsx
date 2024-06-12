import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Notiflix from 'notiflix';
import { Button } from 'react-bootstrap'; // імпорт Button
import s from './Basket.module.scss';

const Basket = () => {
  const [orders, setOrders] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('');

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

  const handleDelete = index => {
    const updatedOrders = [...orders];
    updatedOrders.splice(index, 1);
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const updateTotalPrice = updatedOrders => {
    const totalPrice = updatedOrders.reduce((acc, curr) => {
      return acc + curr.price * curr.count;
    }, 0);
    setTotalPrice(totalPrice);
  };

  useEffect(() => {
    updateTotalPrice(orders);
  }, [orders]);

  const TOKEN = '6860224388:AAH_jiGlu9A8kRh7aYaRDWqmLJbqttDKeTs';
  const CHAT = '-1002208287237';
  const URI_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

  const Send = e => {
    e.preventDefault();

    if (name === '') {
      Notiflix.Notify.failure('введіть ім`я');
    } else if (phone === '') {
      Notiflix.Notify.failure('введіть номер');
    } else if (message === '') {
      Notiflix.Notify.failure('введіть повідомлення');
    } else if (orders.length === 0) {
      Notiflix.Notify.failure('Ваш кошик порожній');
    } else {
      let orderMessage = '';
      orders.forEach(order => {
        orderMessage += `<b>${order.name}</b> Смак: ${order.flavor} - ${order.count} шт., ${order.price} грн\n`;
      });

      axios
        .post(URI_API, {
          chat_id: CHAT,
          parse_mode: 'html',
          text: `<b>Новий заказ</b>\n<b>Ім'я: </b>${name}\n<b>номер: </b>${phone}\n<b>Повідомлення: </b>${message}\n<b>Замовлення:\n</b>${orderMessage}\n<b>Загальна сума: </b>${totalPrice} грн`,
        })
        .then(res => {
          Notiflix.Notify.success('Замовлення відправлено');
          setOrders([]);
          setTotalPrice(0);
          localStorage.removeItem('orders');
        })
        .catch(err => {
          Notiflix.Notify.failure(
            'Виникла помилка під час відправки замовлення'
          );
        });
    }
  };

  return (
    <div className={s.Basket}>
      <div className={s.orderBox}>
        <h2>Ваші замовлення:</h2>
        {orders.length === 0 && <p>кошик порожній </p>}
        <div>
          {orders.map((order, index) => (
            <div key={index} className={s.orderItem}>
              <img
                crossOrigin="anonymous"
                // src={`${process.env.REACT_APP_API_URL}${order.imageUrl}`} // Викликаємо функцію для отримання URL зображення за ідентифікатором продукту
                src={`http://localhost:4444${order.imageUrl}`}
                alt={order.name}
                className={s.productImage}
              />
              <div className={s.productTitle}>
                <p className={s.productName}>{order.name}</p>
                <p className={s.flavor}>Смак: {order.flavor}</p>
              </div>

              <div className={s.quantityControl}>
                <button
                  onClick={() => handleQuantityChange(index, order.count - 1)}
                  disabled={order.count <= 1}
                  className={`${s.btnminus} ${s.btnControl}`}
                ></button>
                <span>{order.count}</span>
                <button
                  onClick={() => handleQuantityChange(index, order.count + 1)}
                  className={`${s.btnplus} ${s.btnControl}`}
                ></button>
              </div>
              <p className={s.totalPrice}> {order.price} грн</p>
              <Button
                onClick={() => handleDelete(index)}
                variant="danger"
                className={s.btnDel}
              >
                
              </Button>
            </div>
          ))}
          {orders.length > 0 && <p>Загальна вартість: {totalPrice}</p>}
        </div>
      </div>

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
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className={s.input}
            placeholder="Введіть номер телефону"
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
