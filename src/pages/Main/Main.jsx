import React, { useEffect, useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import Tab from 'react-bootstrap/Tab';
import { useOutletContext } from 'react-router';
import Tabs from 'react-bootstrap/Tabs';
import s from './Main.module.scss';
import List from 'pages/List/List';
import './Main.css';
import config from 'config';
import Marquee from 'react-fast-marquee';

const Main = () => {
  const [products, setProducts] = useState([]);
  const [types, setTypes] = useState([]);
  const [quantitys, setQuantitys] = useState([]);
  const [sortByQuantity, setSortByQuantity] = useState('');
  const [sortByType, setSortByType] = useState('');
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('adminEmail') || '';
    setUserEmail(email);
  }, []);

  const { handleBuy } = useOutletContext();

  const handleDelete = useCallback((productId) => {
    axios
      .delete(`${config.baseURL}/products/${productId}`)
      .then(() => {
        setProducts(prevProducts =>
          prevProducts.filter(product => product._id !== productId)
        );
      })
      .catch(error => {
        console.error('Помилка при видаленні продукту:', error);
      });
  }, []);

  const handleSortByQuantityChange = (event) => {
    const value = event.target.value;
    setSortByQuantity(value);
    if (value !== '') {
      setSortByType('Одноразові');
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'puffs-selected' });
    }
  };

  const handleSortByTypeChange = (selectedType) => {
    setSortByType(selectedType);
    if (selectedType !== 'Одноразові') {
      setSortByQuantity('');
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${config.baseURL}/products`);
        let sortedProducts = response.data;

        const uniqueTypes = [
          ...new Set(sortedProducts.map(product => product.description.type)),
        ];
        setTypes(uniqueTypes);

        let uniqueQuantitys = [
          ...new Set(sortedProducts.map(product => product.description.quantity)),
        ];
        uniqueQuantitys = uniqueQuantitys.filter(quantity => quantity !== '');
        uniqueQuantitys.sort((a, b) => a - b);
        setQuantitys(uniqueQuantitys);

        if (sortByType) {
          sortedProducts = sortedProducts.filter(
            product => product.description.type === sortByType
          );
        }

        if (sortByQuantity) {
          sortedProducts = sortedProducts.filter(
            product => product.description.quantity === sortByQuantity
          );
        }

        setProducts(sortedProducts);
      } catch (error) {
        console.error('Помилка при завантаженні продуктів:', error);
        setError(
          'Не вдалося завантажити список продуктів. Будь ласка, спробуйте пізніше.'
        );
      }
    };

    fetchProducts();
  }, [sortByType, sortByQuantity]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      {userEmail === 'ivan@gmail.com' && (
        <NavLink to="/products/add" className={s.btnCreate}>
          Створити
        </NavLink>
      )}

      <Marquee
        style={{
          backgroundColor: '#ff5100',
          padding: '10px',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '15px',
          textTransform: 'uppercase',
        }}
        className="marquee-container"
        autoFill={true}
        play={true}
        pauseOnHover={false}
        pauseOnClick={false}
        direction="left"
        speed={80}
        delay={0}
        loop={0}
      >
        <p className={s.textMarquee}>Відправка в день замовлення </p>{' '}
        <span className={s.dot}></span>
      </Marquee>

      <div className={s.sortContainer}>
        <div className={s.titleBox}>
          <h1 className={s.title}>Каталог</h1>
          <span className={s.titleUnder}></span>
        </div>

        <div className={s.sortType}>
          <Tabs
            activeKey={sortByType}
            onSelect={handleSortByTypeChange}
            id="controlled-tab-example"
            className="mb-3"
            variant="tabs"
          >
            <Tab eventKey="" title="Всі"></Tab>
            {['Одноразові', ...types.filter(type => type !== 'Одноразові')].map(
              type => (
                <Tab eventKey={type} title={type} key={type}></Tab>
              )
            )}
          </Tabs>
        </div>
      </div>

      <div className={s.listContainer}>
        <div className={s.sortQuantity}>
          <h3 className={s.gradientText}>Оберіть розмір:</h3>
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
            {quantitys.map(quantity => (
              <label key={quantity} className={s.check}>
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
            {quantitys.map(quantity => (
              <option key={quantity} value={quantity}>
                {quantity}
              </option>
            ))}
          </select>
        </div>
        <div className={s.listBox}>
          <List
            products={products}
            handleDelete={handleDelete}
            handleBuy={handleBuy}
          />
        </div>
      </div>
    </>
  );
};

export default Main;
