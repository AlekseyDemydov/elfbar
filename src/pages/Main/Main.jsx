import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from '../../axios';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import banner from './img/banner.jpg';
import s from './Main.module.scss';
import List from 'pages/List/List';
import './Main.css';
import config from 'config';

const Main = () => {
  const [products, setProducts] = useState([]);
  const [types, setTypes] = useState([]);
  const [quantitys, setQuantity] = useState([]);
  const [sortByQuantity, setSortByQuantity] = useState('');
  const [sortByType, setSortByType] = useState('');
  const [error, setError] = useState(null);
  const userEmail = localStorage.getItem('adminEmail') || '';
  const handleDelete = productId => {
    axios
      // .delete(`${process.env.REACT_APP_API_URL}/products/${productId}`)
      .delete(`${config.baseURL}/products/${productId}`)
      .then(response => {
        // console.log(response.data);
        setProducts(prevProducts =>
          prevProducts.filter(product => product._id !== productId)
        );
      })
      .catch(error => {
        console.error('Помилка при видаленні продукту:', error);
      });
  };

  const handleSortByQuantityChange = event => {
    setSortByQuantity(event.target.value);
  };

  useEffect(() => {
    axios
      // .get(`${process.env.REACT_APP_API_URL}/products`)
      .get(`${config.baseURL}/products`)
      .then(response => {
        let sortedProducts = response.data;

        const uniqueTypes = [
          ...new Set(sortedProducts.map(product => product.description.type)),
        ];
        setTypes(uniqueTypes);

        if (sortByType) {
          sortedProducts = sortedProducts.filter(
            product => product.description.type === sortByType
          );
        }

        setProducts(sortedProducts);
      })
      .catch(error => {
        console.error('Помилка при завантаженні продуктів:', error);
        setError(
          'Не вдалося завантажити список продуктів. Будь ласка, спробуйте пізніше.'
        );
      });
  }, [sortByType]);

  useEffect(() => {
    axios
      .get(`${config.baseURL}/products`)
      .then(response => {
        let sortedProducts = response.data;

        let uniqueQuantity = [
          ...new Set(
            sortedProducts.map(product => product.description.quantity)
          ),
          
        ];

        uniqueQuantity = uniqueQuantity.filter(quantity => quantity !== '');

        // Sorting quantities in ascending order
        uniqueQuantity.sort((a, b) => a - b);

        setQuantity(uniqueQuantity);

        if (sortByQuantity) {
          sortedProducts = sortedProducts.filter(
            product => product.description.quantity === sortByQuantity
            
          );
        }
        setProducts(sortedProducts);
      })
      .catch(error => {
        console.error('Помилка при завантаженні продуктів:', error);
        setError(
          'Не вдалося завантажити список продуктів. Будь ласка, спробуйте пізніше.'
        );
      });
  }, [sortByQuantity]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      {userEmail === 'ivan@gmail.com' && (
        <NavLink to="/elfbar/products/add" className={s.btnCreate}>
          Створити
        </NavLink>
      )}
      <img src={banner} alt="banner" className={s.banner} />

      <div className={s.sortContainer}>
        <div className={s.sortType}>
          <Tabs
            activeKey={sortByType}
            onSelect={k => setSortByType(k)}
            id="controlled-tab-example"
            className="mb-3"
            variant="tabs"
          >
            <Tab eventKey="" title="Всі"></Tab>
            {types.map(type => (
              <Tab eventKey={type} title={type} key={type}></Tab>
            ))}
          </Tabs>
        </div>
      </div>

      <div className={s.listContainer}>
      <div className={s.sortQuantity}>
      <h3>Кількість тяг:</h3>
      <div className={s.checkboxGroup}>
        <label className={s.check}>
          <input
            type="checkbox"
            value=""
            checked={sortByQuantity === ''}
            onChange={handleSortByQuantityChange}
          />
          Всі
        </label>
        {quantitys.map((quantity) => (
          <label key={quantity}>
            <input
              type="checkbox"
              value={quantity}
              checked={sortByQuantity === quantity}
              onChange={handleSortByQuantityChange}
            />
            {quantity}
          </label>
        ))}
      </div>
      <select
        className={s.quantitySelect}
        value={sortByQuantity}
        onChange={handleSortByQuantityChange}
      >
        <option value="">Всі</option>
        {quantitys.map((quantity) => (
          <option key={quantity} value={quantity}>
            {quantity}
          </option>
        ))}
      </select>
    </div>
        <div className={s.listBox}>
          <List products={products} handleDelete={handleDelete} />
        </div>
      </div>
    </>
  );
};

export default Main;
