import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Notiflix from 'notiflix';
import config from 'config';
import emailjs from 'emailjs-com';
import s from './Basket.module.scss';
import InputMask from 'react-input-mask';

import CityInput from './NP/NovaPoshta';

const Basket = () => {
  const [orders, setOrders] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [message, setMessage] = useState('');
 
  const [phone, setPhone] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedStreet, setSelectedStreet] = useState(null);
  const [selectedHouseNumber, setSelectedHouseNumber] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [apartment, setApartment] = useState('');
  const [selectedArea, setSelectedArea] = useState(null);
  const [touched, setTouched] = useState(false);

  // console.log(selectedHouseNumber)
  // const city = Array.isArray(selectedCity)
  //       ? selectedCity.map(e => e.Description)
  //       : selectedCity?.Description || selectedCity
  // console.log(city)
  // console.log(selectedStreet)
  // console.log(selectedHouseNumber)
  // console.log(selectedWarehouse)

  useEffect(() => {
    const ordersFromStorage = localStorage.getItem('orders');
    if (ordersFromStorage) {
      setOrders(JSON.parse(ordersFromStorage));
    }
  }, []);
  const handleReceiverNameChange = event => {
    setReceiverName(event.target.value);
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
      event: 'add_shipping_info',
    });
    console.log('done');
  }, []);

  // const TOKEN = '5929832704:AAH-RXP0_n5acEoTgDqHJjUWgdvN7ORkM2U';
  // const CHAT = '-1002285114176';

  const TOKEN = '8165772129:AAGGRjIJFih7HBlkPbZgyfzg3nhh-UN4Dz8';
  const CHAT = '-1002208287237';
  const URI_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

  const sendEmail = (city, street, house, warehouse) => {
    const emailData = {
      service_id: 'service_zkjtl6e',
      template_id: 'template_51geeis',
      user_id: 'E-iWgWIJx90uGQ3PV',
      template_params: {
        to_email: 'unnior2007@gmail.com',
        receiverName: receiverName,
        phone: phone,
        selectedCity: city,
        selectedStreet: street,
        selectedHouseNumber: house,
        selectedWarehouse: warehouse,
        totalPrice: totalPrice,
        orderMessage: orders
          .map(
            order =>
              `➤<b>${order.name}</b>\n Смак: ${order.flavor}  - ${order.count} шт., ${order.price} грн\n`
          )
          .join(''),
      },
    };

    emailjs
      .send(
        emailData.service_id,
        emailData.template_id,
        emailData.template_params,
        emailData.user_id
      )
      .then(() => Notiflix.Notify.success('Замовлення відправлено на email'))
      .catch(() => Notiflix.Notify.failure('Помилка при відправці email'));
  };

  const Send = e => {
    e.preventDefault();

    if (receiverName === '') {
      Notiflix.Notify.failure('Введіть ім`я');
      return;
    }
    if (phone === '') {
      Notiflix.Notify.failure('Введіть номер');
      return;
    }
    if (phone.replace(/\D/g, '').length !== 12) {
    Notiflix.Notify.failure('Введіть повний номер телефону');
    return;
  }
    if (orders.length === 0) {
      Notiflix.Notify.failure('Ваш кошик порожній');
      return;
    }
    if (!selectedCity || selectedCity === '') {
      Notiflix.Notify.failure('Виберіть місто');
      return;
    }
const area = Array.isArray(selectedArea)
  ? selectedArea.map(e => e.Description).join(', ').trim()
  : (selectedArea?.Description || selectedArea || '').toString().trim();
    const city = Array.isArray(selectedCity)
      ? selectedCity.map(e => e.Description).join(', ')
      : selectedCity?.Description || selectedCity;

    const street = Array.isArray(selectedStreet)
      ? selectedStreet.map(e => e.Description).join(', ')
      : selectedStreet?.Description || selectedStreet;

    const house = Array.isArray(selectedHouseNumber)
      ? selectedHouseNumber.map(e => e.Description).join(', ')
      : selectedHouseNumber?.Description || selectedHouseNumber;

    const warehouse = Array.isArray(selectedWarehouse)
      ? selectedWarehouse.map(e => e.Description).join(', ')
      : selectedWarehouse?.Description || selectedWarehouse;

    const orderText = orders
      .map(
        order =>
          `➤<b>${order.name}</b>\n <b>Смак: </b>${order.flavor}  - ${order.count} шт., ${order.price} грн\n`
      )
      .join('');
    let text = `<b>Новий заказ</b>\n`;

    if (receiverName) text += `<b>Ім'я: </b>${receiverName}\n`;
    if (phone) text += `<b>Номер: </b>${phone}\n`;
    if (message) text += `<b>Повідомлення: </b>${message}\n`;
    if (orderText) text += `<b>Замовлення:\n</b>${orderText}\n`;
    if (totalPrice) text += `<b>Загальна сума: </b>${totalPrice} грн\n\n`;

    text += `<b>Доставка:</b>\n`;
    if (area) {
      text += `<b>Область: </b>${area}\n`;
    }
    if (city) text += `<b>Місто: </b>${city}\n`;
    if (street) text += `<b>Вулиця: </b>${street}\n`;
    if (house) text += `<b>Будинок: </b>${house}\n`;
    if (apartment) text += `<b>Квартира: </b>${apartment}\n`;
    if (warehouse) text += `<b>Відділення Нової Пошти: </b>${warehouse}`;

    axios
      .post(URI_API, {
        chat_id: CHAT,
        parse_mode: 'html',
        text: text,
      })
      .then(() => {
        sendEmail(city, street, house, warehouse); // Передаємо уже текстові значення
        Notiflix.Notify.success('Замовлення відправлено');
        setOrders([]);
        setTotalPrice(0);
        setPhone('');
        setReceiverName('');
        setMessage('');
        setSelectedCity('');
        setSelectedStreet(null);
        setSelectedHouseNumber('');
        setSelectedWarehouse('');
        localStorage.removeItem('orders');
        setTimeout(() => {
          window.location.href = '/thanks';
        }, 1500);
      })
      .catch(() =>
        Notiflix.Notify.failure('Виникла помилка під час відправки замовлення')
      );
  };

  // const handlePhoneChange = event => {
  //   let inputPhone = event.target.value.trim();

  //   // Залишаємо лише цифри та символ "+" на початку
  //   let formattedPhone = inputPhone.replace(/(?!^\+)\D/g, '');

  //   // Форматуємо номер, якщо довжина достатня
  //   if (formattedPhone.startsWith('+') && formattedPhone.length >= 7) {
  //     formattedPhone = formattedPhone.replace(
  //       /^\+(\d{3})(\d{3})(\d{2})(\d{2})$/,
  //       '+$1 ($2) $3-$4'
  //     );
  //   }

  //   setPhone(formattedPhone);
  // };
  // const handleFocus = () => {
  //   if (phone === '') {
  //     setPhone('+380 ');
  //   }
  // };

  // const handlePhoneChange = (event) => {
  //   let input = event.target.value;

  //   // Оставляем только цифры
  //   let digits = input.replace(/\D/g, '');

  //   // Удостоверимся, что начинается с 380
  //   if (!digits.startsWith('380')) {
  //     digits = '380' + digits;
  //   }

  //   // Ограничим до 12 цифр (380 + 9 цифр номера)
  //   digits = digits.slice(0, 12);

  //   // Форматируем номер
  //   let formatted = '+380';
  //   if (digits.length > 3) formatted += ' (' + digits.slice(3, 5);
  //   if (digits.length >= 5) formatted += ') ';
  //   if (digits.length >= 7) formatted += digits.slice(5, 7);
  //   if (digits.length >= 9) formatted += '-' + digits.slice(7, 9);
  //   if (digits.length >= 10) formatted += '-' + digits.slice(9, 12);

  //   setPhone(formatted);
  // };

 const handleChange = (e) => {
    setPhone(e.target.value);
  };
   const handleBlur = () => {
    setTouched(true);
  };

  const getDigitsCount = () => {
    return phone.replace(/\D/g, '').length;
  };

  const isValid = getDigitsCount() === 12; // 3 (380) + 9 цифр номера


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
          {/* <input
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            className={s.input}
            // pattern="[0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}"
            placeholder="(+380) 999-999-999"
            onFocus={handleFocus}ы
            maxLength={19}
          /> */}
           <InputMask
        mask="+380 (99) 999-99-99"
        value={phone}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="(+380) 999-999-99"
        maskChar=" "
        className={s.input}
      >
        {(inputProps) => (
          <input
            type="tel"
            {...inputProps}
            style={{
              borderColor: !isValid && touched ? 'red' : '#ccc',
              borderWidth: '1px',
              padding: '8px',
              borderRadius: '4px',
              width: '200px'
            }}
          />
        )}
      </InputMask>

          <p>Одержувач (ПІБ повністю)</p>
          <input
            type="text"
            value={receiverName}
            onChange={handleReceiverNameChange}
            placeholder="Іван Іванович Іваненко"
            className={s.input}
          />

          {/* <label>
            Місто
            <input
              type="text"
              value={selectedCity}
              onChange={handleCityChange}
              placeholder="введіть назву міста"
              className={s.input}
            />
          </label> */}
          {/* <label>
          Номер відділення
            <input
              type="text"
              value={selectedWarehouse}
              onChange={handleWarehouseChange}
              placeholder="Нова пошта або Укрпошта"
              className={s.input}
            />
          </label> */}
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            className={s.input}
            placeholder="Коментарій (необов'язково)"
          />
          <CityInput
            onUpdateCity={setSelectedCity}
            onUpdateStreet={setSelectedStreet}
            onUpdateHouseNumber={setSelectedHouseNumber}
            onUpdateArea={setSelectedArea}
            onUpdateWarehouses={setSelectedWarehouse}
            onApartmentChange={value => setApartment(value)}
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
