import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import s from './BasketMenu.module.scss';
import { ReactComponent as BasketLogo } from '../img/basket.svg';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function BasketMenu({ orders, onUpdateOrder }) {
  const [show, setShow] = useState(false);
  const [basketOrders, setBasketOrders] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [productsDetails, setProductsDetails] = useState([]); // Поправив тут назву стейту
console.log(productsDetails)

  useEffect(() => {
    const fetchProductsDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/products`);
        const productsDetails = response.data;
        setProductsDetails(productsDetails); // Поправив тут також
      } catch (error) {
        console.error('Помилка при отриманні деталей продуктів:', error);
      }
    };
  
    fetchProductsDetails();
  }, []);

  useEffect(() => {
    setBasketOrders(orders);
    const total = orders.reduce((acc, order) => acc + (order.price * order.count), 0);
    setTotalPrice(total);
  }, [orders]);

  const handleClose = () => setShow(false);

  const handleBuyClick = () => {
    setShow(true);
  };

  const handleDelete = (index) => {
    const updatedOrders = [...basketOrders];
    updatedOrders.splice(index, 1);
    setBasketOrders(updatedOrders);
    onUpdateOrder(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const handleQuantityChange = (index, newQuantity) => {
    const updatedOrders = [...basketOrders];
    updatedOrders[index].count = newQuantity;
    setBasketOrders(updatedOrders);
    onUpdateOrder(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  return (
    <>
      <button onClick={handleBuyClick} className={s.btnBasket}> 
        <BasketLogo className={s.imgBasket} />  
        <span className={s.btnLenght}>{basketOrders.length}</span> 
      </button>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Кошик</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {basketOrders && basketOrders.length > 0 ? (
            basketOrders.map((order, index) => (
              <div key={index} className={s.orderItem}>
                <img
                crossOrigin="anonymous"
                  src={`${process.env.REACT_APP_API_URL}${order.imageUrl}`} // Викликаємо функцію для отримання URL зображення за ідентифікатором продукту
                  alt={order.name}
                  className={s.productImage}
                />
                <p>{order.name}</p>
                <p>Смак: {order.flavor}</p>
                <p>Ціна за одиницю: {order.price}</p> 
                <div className={s.quantityControl}>
                  <button onClick={() => handleQuantityChange(index, order.count - 1)}disabled={order.count <= 1}>-</button>
                  <span>{order.count}</span>
                  <button onClick={() => handleQuantityChange(index, order.count + 1)}>+</button>
                </div>
                <Button onClick={() => handleDelete(index)} variant="danger">Видалити</Button>
              </div>
            ))
          ) : (
            <p>Кошик порожній</p>
          )}
          <p>Загальна вартість: {totalPrice}</p>
          <NavLink to={`/elfbar/basket`}>
            <Button onClick={handleClose}>Підтвердити замовлення</Button>
          </NavLink>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default BasketMenu;