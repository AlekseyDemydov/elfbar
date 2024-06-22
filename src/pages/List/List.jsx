import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './List.module.scss';
import config from 'config';

const List = ({ products, handleDelete, handleBuy }) => {
  const [error, setError] = useState(null);
  const userEmail = localStorage.getItem('adminEmail') || '';

  // Стан для зберігання кількості кожного продукту
  const [productCounts, setProductCounts] = useState({});

  // Стан для зберігання обраного смаку для кожного продукту
  const [selectedFlavors, setSelectedFlavors] = useState({});

  // Стан для зберігання обраного кольору для кожного продукту
  const [selectedColors, setSelectedColors] = useState({});

  // Обробник подій для збереження кількості продукту
  const handleQuantityChange = (productId, quantity) => {
    setProductCounts(prevCounts => ({
      ...prevCounts,
      [productId]: quantity,
    }));
  };

  // Обробник подій для збереження обраного смаку продукту
  const handleFlavorChange = (productId, flavor) => {
    setSelectedFlavors(prevSelectedFlavors => ({
      ...prevSelectedFlavors,
      [productId]: flavor,
    }));
  };

  // Обробник подій для збереження обраного кольору продукту
  const handleColorChange = (productId, color) => {
    setSelectedColors(prevSelectedColors => ({
      ...prevSelectedColors,
      [productId]: color,
    }));
  };

  // Обробник події для додавання продукту в кошик
  const handleBuyProduct = productId => {
    const selectedFlavor = selectedFlavors[productId];
    const selectedColor = selectedColors[productId];
    const count = productCounts[productId] || 1;
    const product = products.find(prod => prod._id === productId);

    if (!product) {
      console.error('Продукт не знайдено');
      return;
    }

    if (
      product.flavor.length > 0 &&
      !selectedFlavor &&
      product.flavor[0].trim() !== ''
    ) {
      alert('Оберіть смак для продукту');
      return;
    }

    if (
      product.color.length > 0 &&
      !selectedColor &&
      product.color[0].trim() !== ''
    ) {
      alert('Оберіть колір для продукту');
      return;
    }

    const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const existingOrderIndex = existingOrders.findIndex(
      order =>
        order.name === product.name &&
        order.flavor === selectedFlavor &&
        order.color === selectedColor
    );

    if (existingOrderIndex > -1) {
      existingOrders[existingOrderIndex].count += count;
    } else {
      const order = {
        id: product._id,
        name: product.name,
        flavor: selectedFlavor,
        color: selectedColor,
        count: count,
        price: product.price,
        imageUrl: product.imageUrl,
      };
      existingOrders.push(order);
    }

    handleBuy(existingOrders);
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
          const selectedColor = selectedColors[product._id] || '';
          const count = productCounts[product._id] || 1;

          return (
            <li key={product._id} className={styles.item}>
              <Link
                to={`/elfbar/products/${product._id}`}
                className={styles.link}
              >
                <div className={styles.imgBox}>
                  <img
                    crossOrigin="anonymous"
                    src={`${config.baseURL}${product.imageUrl}`}
                    alt={product.name}
                    className={styles.image}
                  />
                </div>

                <div className={styles.description}>
                  <div className={styles.title}>{product.name}</div>
                  <ul className={styles.listDescr}>
                    {product.description.quantity && (
                      <li className={styles.listDesc}>
                        ✔Кількість тяг: {product.description.quantity}
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

              <div className={styles.btnDown}>
                {/* <div className={styles.selectBox}> */}
                  {product.flavor.filter(flavor => flavor.trim() !== '')
                    .length > 0 && (
                    <select
                      value={selectedFlavor}
                      onChange={e =>
                        handleFlavorChange(product._id, e.target.value)
                      }
                    >
                      <option value="">Оберіть смак</option>
                      {product.flavor.map(
                        (flavor, index) =>
                          flavor.trim() !== '' && (
                            <option
                              key={index}
                              value={flavor}
                              disabled={flavor.startsWith('❌')}
                            >
                              {flavor}
                            </option>
                          )
                      )}
                    </select>
                  )}
               
                  {product.color.filter(color => color.trim() !== '').length >
                    0 && (
                    <select
                      value={selectedColor}
                      onChange={e =>
                        handleColorChange(product._id, e.target.value)
                      }
                    >
                      <option value="">Оберіть колір</option>
                      {product.color.map(
                        (color, index) =>
                          color.trim() !== '' && (
                            <option
                              key={index}
                              value={color}
                              disabled={color.startsWith('❌')}
                            >
                              {color}
                            </option>
                          )
                      )}
                    </select>
                  )}
                

                <div className={styles.btnBuyCount}>
                  <div className={styles.boxCount}>
                    <button
                      onClick={() =>
                        handleQuantityChange(product._id, count - 1)
                      }
                      className={styles.btnInc}
                      disabled={count <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={count}
                      onChange={e =>
                        handleQuantityChange(
                          product._id,
                          parseInt(e.target.value)
                        )
                      }
                      min="1"
                      className={styles.btnNumb}
                    />
                    <button
                      onClick={() =>
                        handleQuantityChange(product._id, count + 1)
                      }
                      className={styles.btnInc}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleBuyProduct(product._id)}
                    className={styles.btnBuy}
                  >
                    купити
                  </button>
                </div>
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
    </div>
  );
};

export default List;
