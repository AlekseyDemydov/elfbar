import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Notiflix from 'notiflix';
import { Button } from 'react-bootstrap'; // імпорт Button
import config from 'config';
import s from './Basket.module.scss';

import CityInput from './NP/NovaPoshta';

const Basket = () => {
  const [orders, setOrders] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('+380');
  const [selectedCity, setSelectedCity] = useState(null); // Додали стани для зберігання вибраних значень
  const [selectedStreet, setSelectedStreet] = useState(null);
  const [selectedHouseNumber, setSelectedHouseNumber] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [receiverName, setReceiverName] = useState('');
  // console.log(selectedWarehouse.Description);

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

    if (receiverName === '') {
      Notiflix.Notify.failure('введіть ім`я');
    } else if (phone === '+380') {
      Notiflix.Notify.failure('введіть номер');
    } else if (phone.length !== 13) {
      Notiflix.Notify.failure('номер має містити 13 символів');
    } else if (orders.length === 0) {
      Notiflix.Notify.failure('Ваш кошик порожній');
    } else {
      let orderMessage = '';
orders.forEach(order => {
  orderMessage += `➤<b>${order.name}</b>`;
  if (order.flavor) {
    orderMessage += `\n<b>Смак: ${order.flavor}</b>`;
  }
  orderMessage += ` - ${order.count} шт., ${order.price} грн\n`;
});

      axios
        .post(URI_API, {
          chat_id: CHAT,
          parse_mode: 'html',
          text:
            `<b>Новий заказ</b>\n<b>Ім'я: </b>${receiverName}\n<b>номер: </b>${phone}\n<b>Повідомлення: </b>${message}\n<b>Замовлення:\n</b>${orderMessage}\n<b>Загальна сума: </b>${totalPrice} грн \n\n <b>Доставка :</b>\n` +
            (selectedWarehouse && selectedWarehouse.Description
              ? `<b>Відділення нової пошти :</b> ${selectedWarehouse.Description}\n`
              : '') +
            (selectedCity && selectedCity.Description
              ? `<b>Місто :</b> ${selectedCity.Description}\n`
              : '') +
            (selectedStreet && selectedStreet.Description
              ? `<b>Вулиця :</b> ${selectedStreet.Description}\n`
              : '') +
            (selectedHouseNumber && selectedHouseNumber.Description
              ? `<b>Будинок :</b> ${selectedHouseNumber.Description}\n`
              : ''),
        })
        .then(res => {
          Notiflix.Notify.success('Замовлення відправлено');
          setOrders([]);
          setTotalPrice(0);
          setPhone('+380');
          setReceiverName('');
          setMessage('');
          setSelectedCity(null);
          setSelectedStreet(null);
          setSelectedHouseNumber(null);
          setSelectedWarehouse(null);
          localStorage.removeItem('orders');
        })
        .catch(err => {
          Notiflix.Notify.failure(
            'Виникла помилка під час відправки замовлення'
          );
        });
    }
  };
  const handlePhoneChange = event => {
    let inputPhone = event.target.value.trim();

    // Вилучення всіх нецифрових символів з введеного номеру
    let formattedPhone = inputPhone.replace(/\D/g, '');

    // Перевірка і додавання префіксу "+380", якщо його немає
    if (!formattedPhone.startsWith('+380')) {
      formattedPhone = '+380' + formattedPhone.substring(3); // Відкидаємо перші 3 символи
    }

    // Обмеження довжини номера телефону до 13 символів
    if (formattedPhone.length > 13) {
      formattedPhone = formattedPhone.slice(0, 13);
    }

    // Форматування телефону у вигляді "(99) 999-99-99"
    if (formattedPhone.length > 3) {
      formattedPhone = formattedPhone.replace(
        /^380(\d{2})(\d{3})(\d{2})(\d{2})$/,
        '($1) $2-$3-$4'
      );
    }

    // Встановлення форматованого номера телефону у стан компоненту
    setPhone(formattedPhone);
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
                // src={`${process.env.REACT_APP_API_URL}${order.imageUrl}`} 
                src={`${config.baseURL}${order.imageUrl}`}
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
              ></Button>
            </div>
          ))}
          {orders.length > 0 && <p className={s.price}>Загальна вартість: {totalPrice} грн</p>}
        </div>
      </div>

      {orders.length > 0 && (
        <form id="form" className={s.form}>
          <p>Ваш номер телефону</p>
          <input
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            className={s.input}
            pattern="[0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}"
            placeholder="(99) 999-99-99"
          />

          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            className={s.input}
            placeholder="Коментарій (необов'язково)"
          />
          <CityInput
            onUpdateReceiver={setReceiverName}
            onUpdateCity={setSelectedCity}
            onUpdateStreet={setSelectedStreet}
            onUpdateHouseNumber={setSelectedHouseNumber}
            onUpdateWarehouses={setSelectedWarehouse}
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
