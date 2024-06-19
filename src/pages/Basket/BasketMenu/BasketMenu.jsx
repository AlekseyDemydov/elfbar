import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import s from './BasketMenu.module.scss';
import { ReactComponent as BasketLogo } from '../img/basket.svg';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import config from 'config';
// import { ReactComponent as Del } from './img/del.svg';
// import { ReactComponent as Plus } from './img/plus.svg';
// import { ReactComponent as Minus } from './img/minus.svg';
import 'bootstrap/dist/css/bootstrap.min.css';

function BasketMenu({ orders, onUpdateOrder }) {
  const [show, setShow] = useState(false);
  const [basketOrders, setBasketOrders] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [productsDetails, setProductsDetails] = useState([]); // Поправив тут назву стейту
  console.log(productsDetails);

  useEffect(() => {
    const fetchProductsDetails = async () => {
      try {
        // const response = await axios.get(`${process.env.REACT_APP_API_URL}/products`);
        const response = await axios.get(`${config.baseURL}/products`);
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
    const total = orders.reduce(
      (acc, order) => acc + order.price * order.count,
      0
    );
    setTotalPrice(total);
  }, [orders]);

  const handleClose = () => setShow(false);

  const handleBuyClick = () => {
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

  return (
    <>
      <button onClick={handleBuyClick} className={s.btnBasket}>
        <BasketLogo className={s.imgBasket} />
        <span className={s.btnLenght}>{basketOrders.length}</span>
      </button>

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
                    // src={`${process.env.REACT_APP_API_URL}${order.imageUrl}`}
                    src={`${config.baseURL}${order.imageUrl}`}
                    alt={order.name}
                    className={s.productImage}
                  />
                  <div className={s.productTitle}>
                    <p className={s.productName}>{order.name}</p>
                    <p className={s.flavor}>Смак: {order.flavor}</p>
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
                    >
                      {/* <Minus/> */}
                      -
                      </button>
                    <span>{order.count}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(index, order.count + 1)
                      }
                      className={`${s.btnplus} ${s.btnControl}`}
                    >
                      {/* <Plus/> */}
                      +
                      </button>
                  </div>
                  <p className={s.totalPrice}> {order.price} грн</p>
                </div>
                <button
                  onClick={() => handleDelete(index)}
                  className={s.btnDel}
                >
                  {/* <Del /> */}
                  x
                </button>
                {/* <Button
                  onClick={() => handleDelete(index)}
                  variant="danger"
                  className={s.btnDel}
                ></Button> */}
              </div>
            ))
          ) : (
            <p>Кошик порожній</p>
          )}
          <p className={s.totalPricee}>Загальна вартість: {totalPrice} грн</p>
          <NavLink to={`/elfbar/basket`}>
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
