import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './CityInput.module.css';

const API_KEY = 'your_api_key_here'; // Ваш ключ API Нової Пошти

const getNovaPoshtaCities = async (searchString) => {
  try {
    const response = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
      apiKey: API_KEY,
      modelName: 'Address',
      calledMethod: 'getCities',
      methodProperties: {
        FindByString: searchString
      }
    });
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error('Не вдалося отримати список міст від Нової Пошти');
    }
  } catch (error) {
    console.error('Помилка при отриманні списку міст від Нової Пошти:', error);
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
        FindByString: searchString
      }
    });
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error('Не вдалося отримати список вулиць від Нової Пошти');
    }
  } catch (error) {
    console.error('Помилка при отриманні списку вулиць від Нової Пошти:', error);
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
        FindByString: searchString
      }
    });
    if (response.data.success) {
      return response.data.data.filter((building) =>
        building.Description.toLowerCase().includes(searchString.toLowerCase())
      );
    } else {
      throw new Error('Не вдалося отримати список будинків від Нової Пошти');
    }
  } catch (error) {
    console.error('Помилка при отриманні списку будинків від Нової Пошти:', error);
    throw error;
  }
};

const CityInput = ({ onUpdateReceiver }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [streets, setStreets] = useState([]);
  const [streetInputValue, setStreetInputValue] = useState('');
  const [selectedStreet, setSelectedStreet] = useState(null);
  const [houseNumbers, setHouseNumbers] = useState([]);
  const [houseNumberInputValue, setHouseNumberInputValue] = useState('');
  const [showStreetSuggestions, setShowStreetSuggestions] = useState(false);
  const [showHouseNumberSuggestions, setShowHouseNumberSuggestions] = useState(false);
  const [receiverName, setReceiverName] = useState('');

  useEffect(() => {
    if (inputValue.trim() !== '') {
      const fetchCities = async () => {
        try {
          const data = await getNovaPoshtaCities(inputValue);
          setSuggestions(data);
        } catch (error) {
          console.error('Помилка при отриманні списку міст від Нової Пошти:', error);
        }
      };
      fetchCities();
    } else {
      setSuggestions([]);
    }
  }, [inputValue]);

  useEffect(() => {
    if (selectedCity) {
      const fetchStreets = async () => {
        try {
          const data = await getNovaPoshtaStreets(selectedCity.Ref, streetInputValue);
          setStreets(data);
        } catch (error) {
          console.error('Помилка при отриманні списку вулиць від Нової Пошти:', error);
        }
      };
      fetchStreets();
    }
  }, [selectedCity, streetInputValue]);

  useEffect(() => {
    if (selectedStreet) {
      const fetchHouseNumbers = async () => {
        try {
          const data = await getNovaPoshtaHouseNumbers(selectedCity.Ref, selectedStreet.Ref, houseNumberInputValue);
          setHouseNumbers(data);
        } catch (error) {
          console.error('Помилка при отриманні списку будинків від Нової Пошти:', error);
        }
      };
      fetchHouseNumbers();
    }
  }, [selectedStreet, houseNumberInputValue]);

  const handleSelectCity = (city) => {
    setInputValue(city.Description);
    setSelectedCity(city);
    setShowSuggestions(false);
  };

  const handleSelectStreet = (street) => {
    setStreetInputValue(street.Description);
    setSelectedStreet(street);
    setShowStreetSuggestions(false);
  };

  const handleSelectHouseNumber = (houseNumber) => {
    setHouseNumberInputValue(houseNumber.Description);
    setShowHouseNumberSuggestions(false);
  };

  const handleReceiverNameChange = (event) => {
    setReceiverName(event.target.value);
  };

  useEffect(() => {
    onUpdateReceiver(receiverName); // Передача ім'я отримувача назад у Basket
  }, [receiverName, onUpdateReceiver]);

  return (
    <div className={styles.cityInput}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Введіть місто..."
        className={styles.inputField}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className={styles.suggestionsList}>
          {suggestions.map((city) => (
            <li
              key={city.Ref}
              onClick={() => handleSelectCity(city)}
              className={styles.suggestionItem}
            >
              {city.Description}
            </li>
          ))}
        </ul>
      )}

      <div className={styles.streetInput}>
        <input
          type="text"
          value={streetInputValue}
          onChange={(e) => setStreetInputValue(e.target.value)}
          placeholder="Введіть вулицю..."
          className={styles.inputField}
        />
        {showStreetSuggestions && streets.length > 0 && (
          <ul className={styles.suggestionsList}>
            {streets.map((street) => (
              <li
                key={street.Ref}
                onClick={() => handleSelectStreet(street)}
                className={styles.suggestionItem}
              >
                {street.Description}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.houseNumberInput}>
        <input
          type="text"
          value={houseNumberInputValue}
          onChange={(e) => setHouseNumberInputValue(e.target.value)}
          placeholder="Введіть номер будинку..."
          className={styles.inputField}
        />
        {showHouseNumberSuggestions && houseNumbers.length > 0 && (
          <ul className={styles.suggestionsList}>
            {houseNumbers.map((houseNumber) => (
              <li
                key={houseNumber.Ref}
                onClick={() => handleSelectHouseNumber(houseNumber)}
                className={styles.suggestionItem}
              >
                {houseNumber.Description}
              </li>
            ))}
          </ul>
        )}
      </div>

      <input
        type="text"
        value={receiverName}
        onChange={handleReceiverNameChange}
        placeholder="Ім'я отримувача"
        className={styles.inputField}
      />
    </div>
  );
};

export default CityInput;