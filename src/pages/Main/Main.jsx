import React, { useEffect, useState } from 'react';
import axios from '../../axios';

import banner from './img/banner.jpg';
import s from './Main.module.scss';
import List from 'pages/List/List';

const Main = () => {
  const [products, setProducts] = useState([]);
  const [types, setTypes] = useState([]);
  const [sortByPrice, setSortByPrice] = useState('price_low_to_high');
  const [sortByQuantity, setSortByQuantity] = useState('quantity_high_to_low');
  const [sortByType, setSortByType] = useState('');
  const [error, setError] = useState(null);

  const handleDelete = productId => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/products/${productId}`)
      .then(response => {
        console.log(response.data);
        setProducts(prevProducts =>
          prevProducts.filter(product => product._id !== productId)
        );
      })
      .catch(error => {
        console.error('Помилка при видаленні продукту:', error);
      });
  };

  const handleSortByPriceChange = event => {
    setSortByPrice(event.target.value);
  };

  const handleSortByTypeChange = event => {
    setSortByType(event.target.value);
  };

  const handleSortByQuantityChange = event => {
    setSortByQuantity(event.target.value);
  };

  useEffect(() => {
    // Отримання списку продуктів з сервера
    axios
      .get('${process.env.REACT_APP_API_URL}/products')
      .then(response => {
        let sortedProducts = response.data;


        // Сортування за ціною
        if (sortByPrice === 'price_low_to_high') {
          sortedProducts.sort((a, b) => a.price - b.price);
        } else if (sortByPrice === 'price_high_to_low') {
          sortedProducts.sort((a, b) => b.price - a.price);
        }

        // Оновлення стану products
        setProducts(sortedProducts);
      })
      .catch(error => {
        // Обробка помилок під час отримання даних
        console.error('Помилка при завантаженні продуктів:', error);
        setError(
          'Не вдалося завантажити список продуктів. Будь ласка, спробуйте пізніше.'
        );
      });
  }, [ sortByPrice]);

  useEffect(() => {
    // Отримання списку продуктів з сервера
    axios
      .get('${process.env.REACT_APP_API_URL}/products')
      .then(response => {
        let sortedProducts = response.data;

        // Отримання унікальних типів продуктів
        const uniqueTypes = [
          ...new Set(sortedProducts.map(product => product.description.type)),
        ];
        setTypes(uniqueTypes);

        // Фільтрація продуктів за типом, якщо sortByType задано
        if (sortByType) {
          sortedProducts = sortedProducts.filter(
            product => product.description.type === sortByType
          );
        }

        

        // Оновлення стану products
        setProducts(sortedProducts);
      })
      .catch(error => {
        // Обробка помилок під час отримання даних
        console.error('Помилка при завантаженні продуктів:', error);
        setError(
          'Не вдалося завантажити список продуктів. Будь ласка, спробуйте пізніше.'
        );
      });
  }, [sortByType]);

  useEffect(() => {
    // Отримання списку продуктів з сервера
    axios
      .get('${process.env.REACT_APP_API_URL}/products')
      .then(response => {
        let sortedProducts = response.data;
        // Сортування за кількістю
        if (sortByQuantity === 'quantity_high_to_low') {
          sortedProducts.sort((a, b) => b.description.quantity - a.description.quantity);
        } else if (sortByQuantity === 'quantity_low_to_high') {
          sortedProducts.sort((a, b) => a.description.quantity - b.description.quantity);
        }

        // Оновлення стану products
        setProducts(sortedProducts);
      })
      .catch(error => {
        // Обробка помилок під час отримання даних
        console.error('Помилка при завантаженні продуктів:', error);
        setError(
          'Не вдалося завантажити список продуктів. Будь ласка, спробуйте пізніше.'
        );
      });
  }, [sortByQuantity]);

  if (error) {
    setError(error);
    return <div>{error}</div>;
  }

  return (
    <>
      <img src={banner} alt="banner" className={s.banner} />

      <div className={s.sortContainer}>
        <div>
          <h3>Сортувати за ціною:</h3>
          <select value={sortByPrice} onChange={handleSortByPriceChange}>
            <option value="price_high_to_low">
              Від найдорожчого до дешевшого
            </option>
            <option value="price_low_to_high">
              Від дешевшого до найдорожчого
            </option>
          </select>
        </div>
        <div>
          <h3>Сортувати за кількістю:</h3>
          <select value={sortByQuantity} onChange={handleSortByQuantityChange}>
            <option value="quantity_high_to_low">
              Від більшої до меншої кількості
            </option>
            <option value="quantity_low_to_high">
              Від меншої до більшої кількості
            </option>
          </select>
        </div>
        <div>
          <h3>Сортувати за типом:</h3>
          <select value={sortByType} onChange={handleSortByTypeChange}>
            <option value="">Всі</option>
            {types.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={s.listContainer}>
        <List products={products} handleDelete={handleDelete} />
      </div>
    </>
  );
};

export default Main;
