import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './List.module.scss';
import BasketMenu from 'pages/Basket/BasketMenu/BasketMenu';

const List = ({ products, handleDelete }) => {
  const [error, setError] = useState(null);
  const [selectedFlavors, setSelectedFlavors] = useState({});
  const [productCounts, setProductCounts] = useState({});
  const [orders, setOrders] = useState([]);
  const userEmail = localStorage.getItem('adminEmail') || '';

  useEffect(() => {
    const counts = {};
    products.forEach(product => {
      counts[product._id] = {};
      product.flavor.forEach(flavor => {
        counts[product._id][flavor] = 1;
      });
    });
    setProductCounts(counts);

    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    setOrders(storedOrders);
  }, [products]);

  const handleFlavorChange = (productId, flavor) => {
    setSelectedFlavors(prevSelectedFlavors => ({
      ...prevSelectedFlavors,
      [productId]: flavor,
    }));
  };

  const handleCountChange = (productId, flavor, count) => {
    setProductCounts(prevCounts => ({
      ...prevCounts,
      [productId]: {
        ...prevCounts[productId],
        [flavor]: Math.max(count, 1),
      },
    }));
  };

  const incrementCount = (productId, flavor) => {
    setProductCounts(prevCounts => ({
      ...prevCounts,
      [productId]: {
        ...prevCounts[productId],
        [flavor]: (prevCounts[productId][flavor] || 0) + 1,
      },
    }));
  };

  const decrementCount = (productId, flavor) => {
    setProductCounts(prevCounts => ({
      ...prevCounts,
      [productId]: {
        ...prevCounts[productId],
        [flavor]: Math.max((prevCounts[productId][flavor] || 1) - 1, 1),
      },
    }));
  };

  const handleBuy = productId => {
    const selectedFlavor = selectedFlavors[productId];
    const count = productCounts[productId]?.[selectedFlavor];
    const product = products.find(prod => prod._id === productId);
  
    if (product.flavor.filter(flavor => flavor !== '').length > 0 && !selectedFlavor) {
      alert('Даний продукт має смак, оберіть його для покупки');
      return;
    }
  
    if (count && count > 0 && (product.flavor || !selectedFlavor)) {
      const existingOrders = [...orders];
  
      const existingOrderIndex = existingOrders.findIndex(
        order => order.name === product.name && order.flavor === selectedFlavor
      );
  
      if (existingOrderIndex > -1) {
        existingOrders[existingOrderIndex].count += count;
        // existingOrders[existingOrderIndex].price += product.price * count;
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
    } else {
      alert('Оберіть смак для продукту або перевірте наявність');
    }
  };

  const updateOrders = updatedOrders => {
    setOrders(updatedOrders);
  };

  if (error) {
    setError(error);
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles['product-list']}>
      <ul className={styles.list}>
        {products.map(product => {
          const selectedFlavor = selectedFlavors[product._id] || '';
          const count = selectedFlavor
            ? productCounts[product._id][selectedFlavor]
            : 1;

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
                        ✔Кількість тягu: {product.description.quantity}
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
              {product.flavor.filter(flavor => flavor !== '').length > 0 && (
                <select
                  value={selectedFlavor}
                  onChange={e =>
                    handleFlavorChange(product._id, e.target.value)
                  }
                >
                  <option value="">Оберіть смак</option>
                  {product.flavor.map(
                    (flavor, index) =>
                      flavor !== '' && (
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
                    onClick={() => decrementCount(product._id, selectedFlavor)}
                    className={styles.btnInc}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={count}
                    onChange={e =>
                      handleCountChange(
                        product._id,
                        selectedFlavor,
                        parseInt(e.target.value)
                      )
                    }
                    min="1"
                    className={styles.btnNumb}
                  />
                  <button
                    onClick={() => incrementCount(product._id, selectedFlavor)}
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
        <BasketMenu orders={orders} onUpdateOrder={updateOrders} />
      )}
    </div>
  );
};

export default List;
