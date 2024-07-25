import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Notiflix from 'notiflix';
import config from 'config';
import s from './Basket.module.scss';

// import CityInput from './NP/NovaPoshta';

const Basket = () => {
  const [orders, setOrders] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('+380');
  const [selectedCity, setSelectedCity] = useState("");
  // const [selectedStreet, setSelectedStreet] = useState(null);
  // const [selectedHouseNumber, setSelectedHouseNumber] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [receiverName, setReceiverName] = useState('');

  useEffect(() => {
    const ordersFromStorage = localStorage.getItem('orders');
    if (ordersFromStorage) {
      setOrders(JSON.parse(ordersFromStorage));
    }
  }, []);
  const handleReceiverNameChange = event => {
    setReceiverName(event.target.value);
  };
  const handleWarehouseChange = event => {
    setSelectedWarehouse(event.target.value);
  };
  const handleCityChange = event => {
    setSelectedCity(event.target.value);
  };
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

  useEffect(() => {
    // Виконання одного разу при завантаженні сторінки
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event' : 'add_shipping_info'
    });
    console.log('qwe');
  }, []);

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
        if (order.color) {
          orderMessage += `\n<b>Колір: ${order.color}</b>`;
        }
        if (order.resistance) {
          orderMessage += `\n<b>Опір: ${order.resistance}</b>`;
        }
        orderMessage += ` - ${order.count} шт., ${order.price} грн\n`;
      });

      axios
        .post(URI_API, {
          chat_id: CHAT,
          parse_mode: 'html',
          text:
            `<b>Новий заказ</b>\n<b>Ім'я: </b>${receiverName}\n<b>номер: </b>${phone}\n<b>Повідомлення: </b>${message}\n<b>Замовлення:\n</b>${orderMessage}\n<b>Загальна сума: </b>${totalPrice} грн \n\n <b>Доставка :</b>\n` +
            (selectedWarehouse 
              ? `<b>Відділення нової пошти :</b> ${selectedWarehouse}\n`
              : '') +
            (selectedCity 
              ? `<b>Місто :</b> ${selectedCity}\n`
              : '') 
            //   +
            // (selectedStreet && selectedStreet.Description
            //   ? `<b>Вулиця :</b> ${selectedStreet.Description}\n`
            //   : '') +
            // (selectedHouseNumber && selectedHouseNumber.Description
            //   ? `<b>Будинок :</b> ${selectedHouseNumber.Description}\n`
            //   : ''),
        })
        .then(res => {
          
          Notiflix.Notify.success('Замовлення відправлено');
          setOrders([]);
          setTotalPrice(0);
          setPhone('+380');
          setReceiverName('');
          setMessage('');
          setSelectedCity("");
          // setSelectedStreet(null);
          // setSelectedHouseNumber(null);
          setSelectedWarehouse("");
          localStorage.removeItem('orders');
          setTimeout(() => {
            window.location.href = '/thanks';
          }, 1500);
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
    let formattedPhone = inputPhone.replace(/\D/g, '');

    if (!formattedPhone.startsWith('+380')) {
      formattedPhone = '+380' + formattedPhone.substring(3);
    }

    if (formattedPhone.length > 13) {
      formattedPhone = formattedPhone.slice(0, 13);
    }

    if (formattedPhone.length > 3) {
      formattedPhone = formattedPhone.replace(
        /^380(\d{2})(\d{3})(\d{2})(\d{2})$/,
        '($1) $2-$3-$4'
      );
    }

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
              <div className={s.infoTitle}>
                <img
                  crossOrigin="anonymous"
                  src={`${config.baseURL}${order.imageUrl}`}
                  alt={order.name}
                  className={s.productImage}
                />
                <div className={s.productTitle}>
                  <p className={s.productName}>{order.name}</p>
                  {order.color && (
                    <p className={s.color}>Колір: {order.color}</p>
                  )}
                  {order.flavor && (
                    <p className={s.flavor}>Смак: {order.flavor}</p>
                  )}
                  {order.resistance && (
                    <p className={s.resistance}>Опір: {order.resistance}</p>
                  )}
                </div>
              </div>

              <div className={s.quantBtn}>
                <div className={s.quantityControl}>
                  <button
                    onClick={() => handleQuantityChange(index, order.count - 1)}
                    disabled={order.count <= 1}
                    className={`${s.btnminus} ${s.btnControl}`}
                  >
                    -
                  </button>
                  <span>{order.count}</span>
                  <button
                    onClick={() => handleQuantityChange(index, order.count + 1)}
                    className={`${s.btnplus} ${s.btnControl}`}
                  >
                    +
                  </button>
                </div>
                <p className={s.totalPrice}> {order.price} грн</p>
              </div>

              <button onClick={() => handleDelete(index)} className={s.btnDel}>
                x
              </button>
            </div>
          ))}
          {orders.length > 0 && (
            <p className={s.price}>Загальна вартість: {totalPrice} грн</p>
          )}
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
          <label>
            Одержувач (ПІБ повністю)
            <input
              type="text"
              value={receiverName}
              onChange={handleReceiverNameChange}
              placeholder="Іван Іванович Іваненко"
              className={s.input}
            />
          </label>
          <label>
            Місто
            <input
              type="text"
              value={selectedCity}
              onChange={handleCityChange}
              placeholder="введіть назву міста"
              className={s.input}
            />
          </label>
          <label>
          Номер відділення
            <input
              type="text"
              value={selectedWarehouse}
              onChange={handleWarehouseChange}
              placeholder="Нова пошта або Укрпошта"
              className={s.input}
            />
          </label>
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            className={s.input}
            placeholder="Коментарій (необов'язково)"
          />
          {/* <CityInput
            onUpdateReceiver={setReceiverName}
            onUpdateCity={setSelectedCity}
            onUpdateStreet={setSelectedStreet}
            onUpdateHouseNumber={setSelectedHouseNumber}
            onUpdateWarehouses={setSelectedWarehouse}
          /> */}

          <button type="submit" onClick={Send} className={s.btmForm}>
            Відправити замовлення
          </button>
        </form>
      )}
    </div>
  );
};

export default Basket;
