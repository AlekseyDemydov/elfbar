import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import s from './BasketMenu.module.scss';
import { ReactComponent as BasketLogo } from '../img/basket.svg';
import { NavLink, useLocation } from 'react-router-dom';
import axios from 'axios';
import config from 'config';
import 'bootstrap/dist/css/bootstrap.min.css';

function BasketMenu({ orders, onUpdateOrder }) {
  const [show, setShow] = useState(false);
  const [basketOrders, setBasketOrders] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [productsDetails, setProductsDetails] = useState([]);
  const location = useLocation();
  console.log(productsDetails);
  useEffect(() => {
    setBasketOrders(orders);
    const total = orders.reduce(
      (acc, order) => acc + order.price * order.count,
      0
    );
    setTotalPrice(total);
  }, [orders]);

  useEffect(() => {
    const fetchProductsDetails = async () => {
      try {
        const response = await axios.get(`${config.baseURL}/products`);
        const productsDetails = response.data;
        setProductsDetails(productsDetails);
      } catch (error) {
        console.error('Помилка при отриманні деталей продуктів:', error);
      }
    };

    fetchProductsDetails();
  }, []);

  const handleClose = () => setShow(false);

  const handleBuyClick = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'view_cart',
    });
    setShow(true);
  };

  const handleDelete = index => {
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

  const isBasketRoute = location.pathname === '/basket';

  return (
    <>
      {!isBasketRoute && (
        <button onClick={handleBuyClick} className={s.btnBasket}>
          <BasketLogo className={s.imgBasket} />
          <span className={s.btnLenght}>{basketOrders.length}</span>
        </button>
      )}
      <Offcanvas
        show={show}
        onHide={handleClose}
        style={{ width: '600px' }}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Кошик</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {basketOrders && basketOrders.length > 0 ? (
            basketOrders.map((order, index) => (
              <div key={index} className={s.orderItem}>
                <div className={s.contr}>
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

                <div className={s.contro}>
                  <div className={s.quantityControl}>
                    <button
                      onClick={() =>
                        handleQuantityChange(index, order.count - 1)
                      }
                      disabled={order.count <= 1}
                      className={`${s.btnminus} ${s.btnControl}`}
                    ></button>
                    <span>{order.count}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(index, order.count + 1)
                      }
                      className={`${s.btnplus} ${s.btnControl}`}
                    ></button>
                  </div>
                  <p className={s.totalPrice}> {order.price} грн</p>
                </div>
                <button
                  onClick={() => handleDelete(index)}
                  className={s.btnDel}
                ></button>
              </div>
            ))
          ) : (
            <p>Кошик порожній</p>
          )}
          <p className={s.totalPricee}>Загальна вартість: {totalPrice} грн</p>
          <NavLink to={`/basket`}>
            <Button onClick={handleClose} className={s.btnDone}>
              Підтвердити замовлення
            </Button>
          </NavLink>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default BasketMenu;
