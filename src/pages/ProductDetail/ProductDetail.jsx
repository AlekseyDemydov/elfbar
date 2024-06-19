import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, NavLink } from 'react-router-dom';
import s from './ProductDetail.module.scss';
import config from 'config';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedFlavors, setSelectedFlavors] = useState({});
  const [selectedColors, setSelectedColors] = useState({});

  const userEmail = localStorage.getItem('adminEmail') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.baseURL}/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Помилка при отриманні деталей продукту:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleFlavorChange = (productId, flavor) => {
    setSelectedFlavors(prevSelectedFlavors => ({
      ...prevSelectedFlavors,
      [productId]: flavor,
    }));
  };

  const handleColorChange = (productId, color) => {
    setSelectedColors(prevSelectedColors => ({
      ...prevSelectedColors,
      [productId]: color,
    }));
  };

  const handleQuantityChange = quantity => {
    setQuantity(quantity);
  };

  const handleBuy = () => {
    const count = quantity;
    const selectedFlavorValue = selectedFlavors[product._id];
    const selectedColorValue = selectedColors[product._id];

    // Перевірка чи обраний смак для продуктів з смаками
    if (product.flavor.length > 0 && !selectedFlavorValue && product.flavor[0].trim() !== '') {
      alert('Оберіть смак для продукту');
      return;
    }

    // Перевірка чи обраний колір для продуктів з кольорами
    if (product.color.length > 0 && !selectedColorValue && product.color[0].trim() !== '') {
      alert('Оберіть колір для продукту');
      return;
    }

    // Перевірка чи кількість товару валідна
    if (count <= 0) {
      alert('Вкажіть коректну кількість товару');
      return;
    }

    // Створення нового замовлення
    const order = {
      id: product._id, // Ідентифікатор продукту
      name: product.name,
      count: count,
      price: product.price,
      imageUrl: product.imageUrl, // URL зображення продукту
    };

    // Додавання смаку до замовлення, якщо вибрано
    if (selectedFlavorValue) {
      order.flavor = selectedFlavorValue;
    }

    // Додавання коліру до замовлення, якщо вибрано
    if (selectedColorValue) {
      order.color = selectedColorValue;
    }

    // Отримання існуючих замовлень з локального сховища
    const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];

    // Перевірка наявності замовлення з таким самим ID продукту та смаком (якщо вибрано)
    const existingOrderIndex = existingOrders.findIndex(
      existingOrder =>
        existingOrder.id === order.id &&
        (!order.flavor || existingOrder.flavor === order.flavor) &&
        (!order.color || existingOrder.color === order.color)
    );

    // Якщо замовлення вже існує, оновлюємо кількість
    if (existingOrderIndex > -1) {
      existingOrders[existingOrderIndex].count += count;
    } else {
      // В іншому випадку, додаємо нове замовлення до списку
      existingOrders.push(order);
    }

    // Зберігання замовлень у локальному сховищі
    localStorage.setItem('orders', JSON.stringify(existingOrders));
  };

  if (isLoading) {
    return <div>Завантаження...</div>;
  }

  return (
    <div className={s.detBox}>
      {product.imageUrl && (
        <img
          className={s.imgDet}
          crossOrigin="anonymous"
          src={`${config.baseURL}${product.imageUrl}`}
          alt={product.name}
        />
      )}
      <div className={s.prodInfo}>
        <h2>{product.name}</h2>
        <div className={s.description}>
          <div className={s.title}>{product.name}</div>
          <ul>
            {product.description.quantity && (
              <li className={s.listDesc}>
                ✔ Кількість тяг: {product.description.quantity}
              </li>
            )}
            {product.description.strength && (
              <li className={s.listDesc}>
                ✔ Міцність: {product.description.strength}
              </li>
            )}
            {product.description.type && (
              <li className={s.listDesc}>
                ✔ Тип: {product.description.type}
              </li>
            )}
            {product.description.charging && (
              <li className={s.listDesc}>
                ✔ Зарядка: {product.description.charging}
              </li>
            )}
            {product.description.volume && (
              <li className={s.listDesc}>
                ✔ Об'єм: {product.description.volume}
              </li>
            )}
            {product.description.resistance && (
              <li className={s.listDesc}>
                ✔ Опір: {product.description.resistance}
              </li>
            )}
          </ul>
        </div>
        <p>Ціна: {product.price} грн</p>
        {product.flavor.filter(flavor => flavor.trim() !== '').length > 0 && (
          <select
            value={selectedFlavors[product._id] || ''}
            onChange={e => handleFlavorChange(product._id, e.target.value)}
          >
            <option value="">Оберіть смак</option>
            {product.flavor.map((flavor, index) => {
              if (flavor.trim() !== '') {
                return (
                  <option
                    key={index}
                    value={flavor}
                    disabled={flavor.startsWith('❌')}
                  >
                    {flavor}
                  </option>
                );
              } else {
                return null;
              }
            })}
          </select>
        )}
        {product.color.filter(color => color.trim() !== '').length > 0 && (
          <select
            value={selectedColors[product._id] || ''}
            onChange={e => handleColorChange(product._id, e.target.value)}
          >
            <option value="">Оберіть колір</option>
            {product.color.map((color, index) => {
              if (color.trim() !== '') {
                return (
                  <option
                    key={index}
                    value={color}
                    disabled={color.startsWith('❌')}
                  >
                    {color}
                  </option>
                );
              } else {
                return null;
              }
            })}
          </select>
        )}
        <div className={s.btnBuyCount}>
          <div className={s.boxCount}>
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className={s.btnInc}
              disabled={quantity <= 1}
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={e => handleQuantityChange(parseInt(e.target.value))}
              min="1"
              className={s.btnNumb}
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className={s.btnInc}
            >
              +
            </button>
          </div>
          <button onClick={handleBuy} className={s.btnBuy}>
            Купити
          </button>
        </div>
      </div>
      {userEmail && userEmail === 'ivan@gmail.com' && (
        <NavLink
          to={`/elfbar/products/${id}/edit`}
          style={({ isActive }) => ({
            border: isActive
              ? '3px solid rgb(8, 7, 7)'
              : '1px solid rgb(8, 7, 7)',
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
