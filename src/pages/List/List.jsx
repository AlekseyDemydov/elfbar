import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './List.module.scss';
import config from 'config';

const List = ({ products, handleDelete, handleBuy }) => {
  const [error, setError] = useState(null);
  const userEmail = localStorage.getItem('adminEmail') || '';

  const [productCounts, setProductCounts] = useState({});
  const [selectedFlavors, setSelectedFlavors] = useState({});
  const [selectedColors, setSelectedColors] = useState({});
  const [selectedResistances, setSelectedResistances] = useState({});

  const handleQuantityChange = (productId, quantity) => {
    setProductCounts(prevCounts => ({
      ...prevCounts,
      [productId]: quantity > 0 ? quantity : 1,
    }));
  };

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

  const handleResistanceChange = (productId, resistance) => {
    setSelectedResistances(prevSelectedResistances => ({
      ...prevSelectedResistances,
      [productId]: resistance,
    }));
  };

  const handleBuyProduct = productId => {
    const selectedFlavor = selectedFlavors[productId];
    const selectedColor = selectedColors[productId];
    const selectedResistance = selectedResistances[productId];
    const count = productCounts[productId] || 1;
    const product = products.find(prod => prod._id === productId);

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'add_to_cart',
    });

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

    if (
      product.description.resistance &&
      product.description.resistance.length > 0 &&
      !selectedResistance &&
      product.description.resistance[0].trim() !== ''
    ) {
      alert('Оберіть опір для продукту');
      return;
    }

    const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const existingOrderIndex = existingOrders.findIndex(
      order =>
        order.name === product.name &&
        order.flavor === selectedFlavor &&
        order.color === selectedColor &&
        order.resistance === selectedResistance
    );

    if (existingOrderIndex > -1) {
      existingOrders[existingOrderIndex].count += count;
    } else {
      const order = {
        id: product._id,
        name: product.name,
        flavor: selectedFlavor,
        color: selectedColor,
        resistance: selectedResistance,
        count: count,
        price: product.price,
        imageUrl: product.imageUrl,
      };
      existingOrders.push(order);
    }

    handleBuy(existingOrders);
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
          const selectedColor = selectedColors[product._id] || '';
          const selectedResistance = selectedResistances[product._id] || '';
          const count = productCounts[product._id] || 1;

          return (
            <li key={product._id} className={styles.item}>
              <Link to={`/products/${product._id}`} className={styles.link}>
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
                    {product.description.resistance &&
                      product.description.resistance.filter(
                        resistance => resistance.trim() !== ''
                      ).length > 0 && (
                        <li className={styles.listDesc}>
                          ✔Опір: {product.description.resistance.join(', ')}
                        </li>
                      )}
                  </ul>
                </div>
              </Link>
              <div className={styles.price}>{product.price} грн</div>

              <div className={styles.btnDown}>
                {product.flavor.filter(flavor => flavor.trim() !== '').length >
                  0 && (
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

                {product.description.resistance &&
                  product.description.resistance.filter(
                    resistance => resistance.trim() !== ''
                  ).length > 0 && (
                    <select
                      value={selectedResistance}
                      onChange={e =>
                        handleResistanceChange(product._id, e.target.value)
                      }
                    >
                      <option value="">Оберіть опір</option>
                      {product.description.resistance.map(
                        (resistance, index) =>
                          resistance.trim() !== '' && (
                            <option
                              key={index}
                              value={resistance}
                              disabled={resistance.startsWith('❌')}
                            >
                              {resistance}
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

List.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      imageUrl: PropTypes.string.isRequired,
      description: PropTypes.shape({
        quantity: PropTypes.string,
        strength: PropTypes.string,
        type: PropTypes.string,
        charging: PropTypes.string,
        volume: PropTypes.string,
        resistance: PropTypes.arrayOf(PropTypes.string),
      }).isRequired,
      flavor: PropTypes.arrayOf(PropTypes.string),
      color: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleBuy: PropTypes.func.isRequired,
};

export default List;
