import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './List.module.scss';
import BasketMenu from 'pages/Basket/BasketMenu/BasketMenu';

const List = ({ products, handleDelete }) => {
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const userEmail = localStorage.getItem('adminEmail') || '';

  // Стан для зберігання кількості кожного продукту
  const [productCounts, setProductCounts] = useState({});

  // Стан для зберігання обраного смаку для кожного продукту
  const [selectedFlavors, setSelectedFlavors] = useState({});

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    setOrders(storedOrders);
  }, []);

  // Обробник подій для збереження кількості продукту
  const handleQuantityChange = (productId, quantity) => {
    setProductCounts(prevCounts => ({
      ...prevCounts,
      [productId]: quantity
    }));
  };

  // Обробник подій для збереження обраного смаку продукту
  const handleFlavorChange = (productId, flavor) => {
    setSelectedFlavors(prevSelectedFlavors => ({
      ...prevSelectedFlavors,
      [productId]: flavor
    }));
  };

  // Обробник події для додавання продукту в кошик
  const handleBuy = productId => {
    const selectedFlavor = selectedFlavors[productId];
    const count = productCounts[productId] || 1;
    const product = products.find(prod => prod._id === productId);
  
    if (product.flavor.length > 0 && !selectedFlavor && product.flavor[0].trim() !== '') {
      alert('Оберіть смак для продукту');
      return;
    }

    const existingOrders = [...orders];
    const existingOrderIndex = existingOrders.findIndex(
      order => order.name === product.name && order.flavor === selectedFlavor
    );
  
    if (existingOrderIndex > -1) {
      existingOrders[existingOrderIndex].count += count;
    } else {
      const order = {
        name: product.name,
        flavor: selectedFlavor,
        count: count,
        price: product.price,
      };
      existingOrders.push(order);
    }
  
    localStorage.setItem('orders', JSON.stringify(existingOrders));
    setOrders(existingOrders);
  };

  // Перевірка наявності помилки
  if (error) {
    setError(error);
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles['product-list']}>
      <ul className={styles.list}>
        {products.map(product => {
          const selectedFlavor = selectedFlavors[product._id] || '';
          const count = productCounts[product._id] || 1;

          return (
            <li key={product._id} className={styles.item}>
              <Link
                to={`/elfbar/products/${product._id}`}
                className={styles.link}
              >
                <img
                  crossOrigin="anonymous"
                  src={`http://localhost:4444${product.imageUrl}`}
                  alt={product.name}
                  className={styles.image}
                />
                <div className={styles.description}>
                  <div className={styles.title}>{product.name}</div>
                  <ul>
                    {product.description.quantity && (
                      <li className={styles.listDesc}>
                        ✔Кількість тягу: {product.description.quantity}
                      </li>
                    )}
                    {product.description.strength && (
                      <li className={styles.listDesc}>
                        ✔Міцність: {product.description.strength}
                      </li>
                    )}
                    {product.description.type && (
                      <li className={styles.listDesc}>
                        ✔Тип: {product.description.type}
                      </li>
                    )}
                    {product.description.charging && (
                      <li className={styles.listDesc}>
                        ✔Зарядка: {product.description.charging}
                      </li>
                    )}
                    {product.description.volume && (
                      <li className={styles.listDesc}>
                        ✔Об'єм: {product.description.volume}
                      </li>
                    )}
                    {product.description.resistance && (
                      <li className={styles.listDesc}>
                        ✔Опір: {product.description.resistance}
                      </li>
                    )}
                  </ul>
                </div>
              </Link>
              <div className={styles.price}>{product.price} грн</div>
              {product.flavor.filter(flavor => flavor.trim() !== '').length > 0 && (
                <select
                  value={selectedFlavor}
                  onChange={e => handleFlavorChange(product._id, e.target.value)}
                >
                  <option value="">Оберіть смак</option>
                  {product.flavor.map(
                    (flavor, index) =>
                      flavor.trim() !== '' && (
                        <option key={index} value={flavor}>
                          {flavor}
                        </option>
                      )
                  )}
                </select>
              )}
              <div className={styles.btnBuyCount}>
                <div className={styles.boxCount}>
                  <button
                    onClick={() => handleQuantityChange(product._id, count - 1)}
                    className={styles.btnInc}
                    disabled={count <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={count}
                    onChange={e => handleQuantityChange(product._id, parseInt(e.target.value))}
                    min="1"
                    className={styles.btnNumb}
                  />
                  <button
                    onClick={() => handleQuantityChange(product._id, count + 1)}
                    className={styles.btnInc}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleBuy(product._id)}
                  className={styles.btnBuy}
                >
                  купити
                </button>
              </div>
              {userEmail === 'ivan@gmail.com' && (
                <button
                  onClick={() => handleDelete(product._id)}
                  className={styles.btnDelete}
                >
                  видалити
                </button>
              )}
            </li>
          );
        })}
      </ul>
      {orders.length > 0 && (
        <BasketMenu orders={orders} onUpdateOrder={setOrders} />
      )}
    </div>
  );
};

export default List;