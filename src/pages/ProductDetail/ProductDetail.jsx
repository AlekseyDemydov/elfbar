import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, NavLink } from 'react-router-dom';
import s from './ProductDetail.module.scss';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState('');
  // eslint-disable-next-line
  const [orders, setOrders] = useState([]);
  const userEmail = localStorage.getItem('adminEmail') || '';


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:4444/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleFlavorChange = (e) => {
    setSelectedFlavor(e.target.value);
  };

  const handleCountChange = (e) => {
    const count = parseInt(e.target.value);
    if (!isNaN(count)) {
      setQuantity(count);
    }
  };

  const incrementCount = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementCount = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const handleBuy = () => {
    const count = quantity;
    if (count > 0 && selectedFlavor) {
      const existingOrders = JSON.parse(localStorage.getItem('orders')) || []; // Отримуємо існуючі замовлення або створюємо пустий масив
      const existingOrderIndex = existingOrders.findIndex(
        (order) =>
          order.name === product.name && order.flavor === selectedFlavor
      );
  
      if (existingOrderIndex > -1) {
        existingOrders[existingOrderIndex].count += count;
        existingOrders[existingOrderIndex].price += product.price * count;
      } else {
        const order = {
          name: product.name,
          flavor: selectedFlavor,
          count: count,
          price: product.price * count,
        };
        existingOrders.push(order);
      }
  
      localStorage.setItem('orders', JSON.stringify(existingOrders)); // Зберігаємо замовлення в локальному сховищі
      setOrders(existingOrders); // Оновлюємо стан замовлень
    } else {
      alert('Оберіть смак та вкажіть кількість товару');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={s.detBox}>
      {product.imageUrl && (
        <img
          className={s.imgDet}
          crossOrigin="anonymous"
          src={`http://localhost:4444${product.imageUrl}`}
          alt={product.name}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      )}
      <div>
        <h2>{product.name}</h2>
        <div>
          <ul>
            <li>Кількість: {product.description.quantity}</li>
            <li>Міцність: {product.description.strength}</li>
            <li>Тип: {product.description.type}</li>
            <li>Зарядка: {product.description.charging}</li>
          </ul>
        </div>
        <p>Ціна: {product.price} грн</p>
        <div>
          <label htmlFor="flavor">Смак:</label>
          <select
            id="flavor"
            name="flavor"
            value={selectedFlavor}
            onChange={handleFlavorChange}
          >
            <option value="">Оберіть смак</option>
            {product.flavor.map((flavor, index) => (
              <option key={index} value={flavor}>
                {flavor}
              </option>
            ))}
          </select>
        </div>
        <div>
         
        <div className={s.btnBuyCount}>
                  <div className={s.boxCount}>
            <button onClick={decrementCount} className={s.btnInc}>-</button>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={quantity}
              onChange={handleCountChange}
              min="1"
              className={s.btnNumb}
            />
            <button onClick={incrementCount} className={s.btnInc}>+</button>
          </div>
        </div>
        <button onClick={handleBuy} className={s.btnBuy}>Купити</button>
        </div>
      </div>
      {userEmail && userEmail === 'ivan@gmail.com' && (
        <NavLink
          to={`/elfbar/products/${id}/edit`}
          style={({ isActive }) => ({
            border: isActive ? '3px solid rgb(8, 7, 7)' : '1px solid rgb(8, 7, 7)',
          })}
          className={s.btnCor}
        >
          Редагувати
        </NavLink>
      )}
    </div>
  );
};

export default ProductDetail;