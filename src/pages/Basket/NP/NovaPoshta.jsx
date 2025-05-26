import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './CityInput.module.scss'; // імпортуємо стилі

const API_KEY = '4c4cc38e7a31bd899f3eb60c965650ca';

const getNovaPoshtaCities = async searchString => {
  try {
    const response = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
      apiKey: API_KEY,
      modelName: 'Address',
      calledMethod: 'getCities',
      methodProperties: {
        FindByString: searchString, // Додаємо параметр для пошуку по назві міста
      },
    });
    if (response.data.success) {
      return response.data.data; // Повертаємо дані з API Нової Пошти
    } else {
      throw new Error('Не вдалося отримати список міст від Нової Пошти');
    }
  } catch (error) {
    console.error('Помилка при отриманні списку міст від Нової Пошти:', error);
    throw error;
  }
};

const getNovaPoshtaWarehouses = async (cityRef, category) => {
  try {
    const response = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
      apiKey: API_KEY,
      modelName: 'AddressGeneral',
      calledMethod: 'getWarehouses',
      methodProperties: {
        CityRef: cityRef,
        CategoryOfWarehouse: category, // Параметр для вибору типу відділення чи поштомату
      },
    });
    if (response.data.success) {
      return response.data.data; // Повертаємо дані з API Нової Пошти
    } else {
      throw new Error(
        'Не вдалося отримати список відділень/поштоматів Нової Пошти для даного міста'
      );
    }
  } catch (error) {
    console.error(
      'Помилка при отриманні списку відділень/поштоматів Нової Пошти:',
      error
    );
    throw error;
  }
};

const getNovaPoshtaStreets = async (cityRef, searchString) => {
  try {
    const response = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
      apiKey: API_KEY,
      modelName: 'Address',
      calledMethod: 'getStreet',
      methodProperties: {
        CityRef: cityRef,
        FindByString: searchString, // Додаємо параметр для пошуку по назві вулиці
      },
    });
    if (response.data.success) {
      return response.data.data; // Повертаємо дані з API Нової Пошти
    } else {
      throw new Error('Не вдалося отримати список вулиць від Нової Пошти');
    }
  } catch (error) {
    console.error(
      'Помилка при отриманні списку вулиць від Нової Пошти:',
      error
    );
    throw error;
  }
};

const getNovaPoshtaHouseNumbers = async (cityRef, streetRef, searchString) => {
  try {
    const response = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
      apiKey: API_KEY,
      modelName: 'Address',
      calledMethod: 'getBuildings',
      methodProperties: {
        CityRef: cityRef,
        StreetRef: streetRef,
        FindByString: searchString, // Додаємо параметр для пошуку по номеру будинку
      },
    });
    if (response.data.success) {
      return response.data.data.filter(building =>
        building.Description.toLowerCase().includes(searchString.toLowerCase())
      ); // Фільтруємо результати за введеним значенням
    } else {
      throw new Error('Не вдалося отримати список будинків від Нової Пошти');
    }
  } catch (error) {
    console.error(
      'Помилка при отриманні списку будинків від Нової Пошти:',
      error
    );
    throw error;
  }
};

const CityInput = ({
  defaultDeliveryMethod,
  onUpdateCity,
  onUpdateStreet,
  onUpdateHouseNumber,
  onUpdateWarehouses,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState(defaultDeliveryMethod); // Один обраний метод доставки
  const [suggestions, setSuggestions] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [streets, setStreets] = useState([]);
  const [streetInputValue, setStreetInputValue] = useState(''); // Додаємо стан для введення вулиці
  const [selectedStreet, setSelectedStreet] = useState(null);
  const [houseNumbers, setHouseNumbers] = useState([]);
  const [houseNumberInputValue, setHouseNumberInputValue] = useState(''); // Додаємо стан для введення номера будинку
  const [showSuggestions, setShowSuggestions] = useState(true); // Для показу або приховання списку підказок
  const [showStreetSuggestions, setShowStreetSuggestions] = useState(false); // Для показу або приховання списку підказок вулиць
  const [showHouseNumberSuggestions, setShowHouseNumberSuggestions] = useState(false); // Для показу або приховання списку підказок номерів будинків

  const [warehouseInputValue, setWarehouseInputValue] = useState('');
  const [warehouseSuggestions, setWarehouseSuggestions] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [showWarehouseSuggestions, setShowWarehouseSuggestions] = useState(false);

  console.log(selectedWarehouse)
  console.log(showWarehouseSuggestions)
 
  const handleFocusCiti = () => {
    const fetchCities = async () => {
      try {
        const data = await getNovaPoshtaCities(''); // Викликаємо функцію з порожнім значенням для отримання всіх міст
        setSuggestions(data);
      } catch (error) {
        console.error(
          'Помилка при отриманні списку міст від Нової Пошти:',
          error
        );
      }
    };

    fetchCities();
  };
  const handleFocusWarehouse = async () => {
    try {
      let warehouseType = '';
      if (deliveryMethod === 'department') {
        warehouseType = 'Warehouse';
      } else if (deliveryMethod === 'postomat') {
        warehouseType = 'Postomat';
      }

      const data = await getNovaPoshtaWarehouses(
        selectedCity.Ref,
        warehouseType
      );
      setWarehouseSuggestions(data);
      setShowWarehouseSuggestions(true); // Показуємо список підказок для відділень/поштоматів
    } catch (error) {
      console.error(
        'Помилка при отриманні списку відділень/поштоматів Нової Пошти:',
        error
      );
    }
  };
  useEffect(() => {
    if (inputValue.trim() !== '') {
      const fetchCities = async () => {
        try {
          const data = await getNovaPoshtaCities(inputValue); // Викликаємо функцію з новим значенням
          setSuggestions(data);
        } catch (error) {
          console.error(
            'Помилка при отриманні списку міст від Нової Пошти:',
            error
          );
        }
      };

      fetchCities();
    } else {
      setSuggestions([]); // Очищаємо список підказок, якщо поле вводу порожнє
    }
  }, [inputValue]);

  useEffect(() => {
    if (selectedCity && deliveryMethod !== '') {
      const fetchWarehouses = async () => {
        try {
          let warehouseType = '';
          if (deliveryMethod === 'department') {
            warehouseType = 'Warehouse';
          } else if (deliveryMethod === 'postomat') {
            warehouseType = 'Postomat';
          }

          const data = await getNovaPoshtaWarehouses(
            selectedCity.Ref,
            warehouseType
          );
          setWarehouses(data);
        } catch (error) {
          console.error(
            'Помилка при отриманні списку відділень/поштоматів Нової Пошти:',
            error
          );
        }
      };

      fetchWarehouses();
    }
  }, [selectedCity, deliveryMethod]);

  const handleSelectCity = city => {
    setInputValue(city.Description);
    setSelectedCity(city);
    setSuggestions([]);
    setWarehouseInputValue('');
    setWarehouseSuggestions([]);
    setShowSuggestions(false);
    onUpdateCity(city);
  };

  const handleCheckboxChange = event => {
    const { name } = event.target;
    setDeliveryMethod(name); // Встановлюємо обраний метод доставки
  };

  const handleStreetSearch = async searchString => {
    setStreetInputValue(searchString); // Оновлюємо стан введення вулиці
    if (searchString.trim() !== '') {
      try {
        const data = await getNovaPoshtaStreets(selectedCity.Ref, searchString);
        setStreets(data);
        setShowStreetSuggestions(true); // Показуємо список підказок для вулиць
      } catch (error) {
        console.error('Помилка при отриманні списку вулиць:', error);
      }
    } else {
      setStreets([]); // Очищаємо список підказок, якщо поле вводу порожнє
      setShowStreetSuggestions(false); // Приховуємо список підказок для вулиць
    }
  };

  const handleSelectStreet = street => {
    setStreetInputValue(street.Description);
    setSelectedStreet(street);
    setStreets([]);
    setShowStreetSuggestions(false); // При виборі вулиці приховуємо список підказок
    onUpdateStreet(street);
  };

  const handleHouseNumberSearch = async searchString => {
    setHouseNumberInputValue(searchString); // Оновлюємо стан введення номера будинку
    if (searchString.trim() !== '' && selectedStreet) {
      try {
        const data = await getNovaPoshtaHouseNumbers(
          selectedCity.Ref,
          selectedStreet.Ref,
          searchString
        );
        setHouseNumbers(data);
        setShowHouseNumberSuggestions(true); // Показуємо список підказок для номерів будинків
      } catch (error) {
        console.error('Помилка при отриманні списку будинків:', error);
      }
    } else {
      setHouseNumbers([]); // Очищаємо список підказок, якщо поле вводу порожнє або вулиця не вибрана
      setShowHouseNumberSuggestions(false); // Приховуємо список підказок для номерів будинків
    }
  };

  const handleSelectHouseNumber = houseNumber => {
    setHouseNumberInputValue(houseNumber.Description);
    setHouseNumbers([]);
    setShowHouseNumberSuggestions(false); // При виборі номера будинку приховуємо список підказок
    onUpdateHouseNumber(houseNumber);
  };

  const handleWarehouseSearch = async searchString => {
    setWarehouseInputValue(searchString);

    if (searchString.trim() !== '') {
      try {
        const warehouseType =
          deliveryMethod === 'department' ? 'Warehouse' : 'Postomat';
        const data = await getNovaPoshtaWarehouses(
          selectedCity.Ref,
          warehouseType
        );
        // Фільтрація списку підказок за введеним значенням
        const filteredWarehouses = data.filter(warehouse =>
          warehouse.Description.toLowerCase().includes(
            searchString.toLowerCase()
          )
        );

        setWarehouseSuggestions(filteredWarehouses);
      } catch (error) {
        console.error(
          'Помилка при отриманні списку складів/поштоматів:',
          error
        );
      }
    } else {
      setWarehouseSuggestions([]);
    }
  };

  const handleSelectWarehouse = warehouse => {
    setWarehouseInputValue(warehouse.Description);
    setSelectedWarehouse(warehouse);
    setWarehouseSuggestions([]);
    onUpdateWarehouses(warehouse);
  };


  return (
    <div className={styles['city-input']}>
      <label>
        Місто
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Введіть місто..."
          className={styles['input-field']}
          onFocus={handleFocusCiti}
        />
      </label>

      {showSuggestions && suggestions.length > 0 && (
        <ul className={styles['suggestions-list']}>
          {suggestions.map(city => (
            <li
              key={city.Ref}
              onClick={() => handleSelectCity(city)}
              className={styles['suggestion-item']}
            >
              {city.Description}
            </li>
          ))}
        </ul>
      )}
      {selectedCity && (
        <div className={styles['delivery-methods']}>
          <label>
            <input
              type="radio"
              name="department"
              checked={deliveryMethod === 'department'}
              onChange={handleCheckboxChange}
            />
            Відділення Нової Пошти
          </label>
          <label>
            <input
              type="radio"
              name="postomat"
              checked={deliveryMethod === 'postomat'}
              onChange={handleCheckboxChange}
            />
            Поштомат Нової Пошти
          </label>
          <label>
            <input
              type="radio"
              name="courier"
              checked={deliveryMethod === 'courier'}
              onChange={handleCheckboxChange}
            />
            Курʼєром Нової Пошти
          </label>
        </div>
      )}

      {/* Інпути залежно від обраного методу доставки */}
      {deliveryMethod === 'department' && warehouses.length > 0 && (
        <div className={styles['inputs-container']}>
          <label>
            Пункт отримання
            <input
              type="text"
              value={warehouseInputValue}
              onChange={e => handleWarehouseSearch(e.target.value)}
              placeholder="Виберіть пункт отримання"
              className={styles['input-field']}
              onFocus={handleFocusWarehouse}
            />
          </label>

          {warehouseSuggestions.length > 0 && (
            <ul className={styles['suggestions-list']}>
              {warehouseSuggestions.map(warehouse => (
                <li
                  key={warehouse.Description}
                  onClick={() => handleSelectWarehouse(warehouse)}
                  className={styles['suggestion-item']}
                >
                  {warehouse.Description}
                </li>
              ))}
            </ul>
          )}
          
        </div>
      )}
      {deliveryMethod === 'postomat' && warehouses.length > 0 && (
        <div className={styles['inputs-container']}>
          <label>
            Пункт отримання
            <input
              type="text"
              value={warehouseInputValue}
              onChange={e => handleWarehouseSearch(e.target.value)}
              placeholder="Виберіть пункт отримання"
              className={styles['input-field']}
              onFocus={handleFocusWarehouse}
            />
          </label>
          {warehouseSuggestions.length > 0 && (
            <ul className={styles['suggestions-list']}>
              {warehouseSuggestions.map(warehouse => (
                <li
                  key={warehouse.Description}
                  onClick={() => handleSelectWarehouse(warehouse)}
                  className={styles['suggestion-item']}
                >
                  {warehouse.Description}
                </li>
              ))}
            </ul>
          )}
          
        </div>
      )}
      {deliveryMethod === 'courier' && (
        <div className={styles['inputs-container']}>
          <div className={styles['street-input']}>
            <label>
              Вулиця
              <input
                type="text"
                value={streetInputValue}
                onChange={e => handleStreetSearch(e.target.value)}
                placeholder="Введіть вулицю..."
                className={styles['input-field']}
              />
            </label>

            {showStreetSuggestions && streets.length > 0 && (
              <ul className={styles['suggestions-list']}>
                {streets.map(street => (
                  <li
                    key={street.Ref}
                    onClick={() => handleSelectStreet(street)}
                    className={styles['suggestion-item']}
                  >
                    {street.Description}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={styles['house-number-input']}>
            <label>
              Будинок
              <input
                type="text"
                value={houseNumberInputValue}
                onChange={e => handleHouseNumberSearch(e.target.value)}
                placeholder="Введіть номер будинку..."
                className={styles['input-field']}
              />
            </label>

            {showHouseNumberSuggestions && houseNumbers.length > 0 && (
              <ul className={styles['suggestions-list']}>
                {houseNumbers.map(houseNumber => (
                  <li
                    key={houseNumber.Ref}
                    onClick={() => handleSelectHouseNumber(houseNumber)}
                    className={styles['suggestion-item']}
                  >
                    {houseNumber.Description}
                  </li>
                ))}
              </ul>
            )}
          </div>
         
        </div>
      )}
    </div>
  );
};

export default CityInput;
