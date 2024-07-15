import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, NavLink } from 'react-router-dom';
import s from './ProductDetail.module.scss';
import { useOutletContext } from 'react-router';
import config from '../../config';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedFlavors, setSelectedFlavors] = useState({});
  const [selectedColors, setSelectedColors] = useState({});
  const [selectedResistance, setSelectedResistance] = useState({});

  const userEmail = localStorage.getItem('adminEmail') || '';
  const { handleBuy } = useOutletContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.baseURL}/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Помилка при отриманні деталей продукту:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleFlavorChange = flavor => {
    setSelectedFlavors({ [product._id]: flavor });
  };

  const handleColorChange = color => {
    setSelectedColors({ [product._id]: color });
  };

  const handleResistanceChange = resistance => {
    setSelectedResistance({ [product._id]: resistance });
  };

  const handleQuantityChange = quantity => {
    if (quantity > 0) {
      setQuantity(quantity);
    }
  };

  const handleBuyProduct = () => {
    if (!product) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'add_to_cart',
    });
    const selectedFlavorValue = selectedFlavors[product._id];
    const selectedColorValue = selectedColors[product._id];
    const selectedResistanceValue = selectedResistance[product._id];

    if (
      product.flavor.length > 0 &&
      !selectedFlavorValue &&
      product.flavor[0].trim() !== ''
    ) {
      alert('Оберіть смак для продукту.');
      return;
    }

    if (
      product.color.length > 0 &&
      !selectedColorValue &&
      product.color[0].trim() !== ''
    ) {
      alert('Оберіть колір для продукту.');
      return;
    }

    if (
      product.description.resistance.length > 0 &&
      !selectedResistanceValue &&
      product.description.resistance[0].trim() !== ''
    ) {
      alert('Оберіть опір для продукту.');
      return;
    }

    if (quantity <= 0) {
      alert('Вкажіть коректну кількість товару.');
      return;
    }

    const order = {
      id: product._id,
      name: product.name,
      count: quantity,
      price: product.price,
      imageUrl: product.imageUrl,
      ...(selectedFlavorValue && { flavor: selectedFlavorValue }),
      ...(selectedColorValue && { color: selectedColorValue }),
      ...(selectedResistanceValue && { resistance: selectedResistanceValue }),
    };

    const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const existingOrderIndex = existingOrders.findIndex(
      existingOrder =>
        existingOrder.id === order.id &&
        (!order.flavor || existingOrder.flavor === order.flavor) &&
        (!order.color || existingOrder.color === order.color) &&
        (!order.resistance || existingOrder.resistance === order.resistance)
    );

    if (existingOrderIndex > -1) {
      existingOrders[existingOrderIndex].count += quantity;
    } else {
      existingOrders.push(order);
    }

    localStorage.setItem('orders', JSON.stringify(existingOrders));
    handleBuy(existingOrders);
  };

  if (isLoading) {
    return <div>Завантаження...</div>;
  }

  if (!product) {
    return <div>Помилка завантаження деталей продукту.</div>;
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
              <li className={s.listDesc}>✔ Тип: {product.description.type}</li>
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
        <p className={s.price}>Ціна: {product.price} грн</p>
        {product.flavor.filter(flavor => flavor.trim() !== '').length > 0 && (
          <select
            value={selectedFlavors[product._id] || ''}
            onChange={e => handleFlavorChange(e.target.value)}
          >
            <option value="">Оберіть смак</option>
            {product.flavor.map((flavor, index) =>
              flavor.trim() !== '' ? (
                <option
                  key={index}
                  value={flavor}
                  disabled={flavor.startsWith('❌')}
                >
                  {flavor}
                </option>
              ) : null
            )}
          </select>
        )}
        {product.color.filter(color => color.trim() !== '').length > 0 && (
          <select
            value={selectedColors[product._id] || ''}
            onChange={e => handleColorChange(e.target.value)}
          >
            <option value="">Оберіть колір</option>
            {product.color.map((color, index) =>
              color.trim() !== '' ? (
                <option
                  key={index}
                  value={color}
                  disabled={color.startsWith('❌')}
                >
                  {color}
                </option>
              ) : null
            )}
          </select>
        )}
        {product.description.resistance.filter(
          resistance => resistance.trim() !== ''
        ).length > 0 && (
          <select
            value={selectedResistance[product._id] || ''}
            onChange={e => handleResistanceChange(e.target.value)}
          >
            <option value="">Оберіть опір</option>
            {product.description.resistance.map((resistance, index) =>
              resistance.trim() !== '' ? (
                <option
                  key={index}
                  value={resistance}
                  disabled={resistance.startsWith('❌')}
                >
                  {resistance}
                </option>
              ) : null
            )}
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
          <button onClick={handleBuyProduct} className={s.btnBuy}>
            Купити
          </button>
        </div>
      </div>
      {userEmail && userEmail === 'ivan@gmail.com' && (
        <NavLink
          to={`/products/${id}/edit`}
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
