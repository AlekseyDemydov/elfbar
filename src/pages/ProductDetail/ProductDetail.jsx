import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, NavLink } from 'react-router-dom';
import s from './ProductDetail.module.scss';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedFlavors, setSelectedFlavors] = useState({});
  
  const userEmail = localStorage.getItem('adminEmail') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await axios.get(`${process.env.REACT_APP_API_URL}/products/${id}`);
        const response = await axios.get(`http://localhost:4444/products/${id}`);
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
      [productId]: flavor
    }));
  };

  const handleQuantityChange = quantity => {
    setQuantity(quantity);
  };

  const handleBuy = () => {
    const count = quantity;
    const selectedFlavorValue = selectedFlavors[product._id];
    
    // Перевірка чи обрано смак для продукту, якщо він доступний
    if (product.flavor.length > 0 && !selectedFlavorValue && product.flavor[0].trim() !== '') {
      alert('Оберіть смак для продукту');
      return;
    }
    
    // Перевірка чи кількість товару валідна
    if (count <= 0) {
      alert('Вкажіть коректну кількість товару');
      return;
    }
    
    // Створення нового замовлення
    const order = {
      id: product._id, // Передача ідентифікатора продукту
      name: product.name,
      count: count,
      price: product.price,
      imageUrl: product.imageUrl // Додаємо зображення продукту
    };

    // Додаємо flavor тільки якщо він обраний
    if (selectedFlavorValue) {
      order.flavor = selectedFlavorValue;
    }

    // Отримання існуючих замовлень з локального сховища
    const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Пошук чи існує замовлення з таким самим продуктом і смаком (якщо обраний)
    const existingOrderIndex = existingOrders.findIndex(
      existingOrder => existingOrder.id === order.id && (!order.flavor || existingOrder.flavor === order.flavor)
    );
    
    // Якщо замовлення вже існує, оновити кількість
    if (existingOrderIndex > -1) {
      existingOrders[existingOrderIndex].count += count;
    } else {
      // Додати нове замовлення до списку
      existingOrders.push(order);
    }
    
    // Збереження замовлень в локальному сховищі
    localStorage.setItem('orders', JSON.stringify(existingOrders));
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
          // src={`${process.env.REACT_APP_API_URL}${product.imageUrl}`}
          src={`http://localhost:4444${product.imageUrl}`}
          alt={product.name}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      )}
      <div>
        <h2>{product.name}</h2>
        <div className={s.description}>
          <div className={s.title}>{product.name}</div>
          <ul>
            {product.description.quantity && (
              <li className={s.listDesc}>
                ✔Кількість тягу: {product.description.quantity}
              </li>
            )}
            {product.description.strength && (
              <li className={s.listDesc}>
                ✔Міцність: {product.description.strength}
              </li>
            )}
            {product.description.type && (
              <li className={s.listDesc}>
                ✔Тип: {product.description.type}
              </li>
            )}
            {product.description.charging && (
              <li className={s.listDesc}>
                ✔Зарядка: {product.description.charging}
              </li>
            )}
            {product.description.volume && (
              <li className={s.listDesc}>
                ✔Об'єм: {product.description.volume}
              </li>
            )}
            {product.description.resistance && (
              <li className={s.listDesc}>
                ✔Опір: {product.description.resistance}
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
            {product.flavor.map((flavor, index) =>
              flavor.trim() !== '' && (
                <option key={index} value={flavor}>
                  {flavor}
                </option>
              )
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
          <button onClick={handleBuy} className={s.btnBuy}>
            купити
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