import React, { useState, useRef, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import styles from "./AddProduct.module.scss"; // Шлях до файлу стилів
import config from '../../config'

const AddProduct = () => {
  const { id } = useParams();
  const [productData, setProductData] = useState({
    name: "",
    description: {
      quantity: "",
      strength: "",
      type: "",
      charging: "",
      volume:"",
      resistance:""
      
    },
    flavor:"",
    price: 0,
    imageUrl: "",
  });

  const [isLoading, setLoading] = useState(false);
  const inputFileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          // const response = await axios.get(`${process.env.REACT_APP_API_URL}/products/${id}`);
          const response = await axios.get(`${config.baseURL}/products/${id}`);
          const { data } = response;
          setProductData({
            name: data.name || "",
            description: {
              quantity: data.description.quantity || "",
              strength: data.description.strength || "",
              type: data.description.type || "",
              charging: data.description.charging || "",
              volume: data.description.volume || "",
              resistance: data.description.resistance || "",
            },
            flavor: data.flavor.join('\n') || "",
            price: data.price || 0,
            imageUrl: data.imageUrl || "",
          });
        } catch (error) {
          console.error("Error fetching default product data:", error);
        }
      };

      fetchData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('description.')) {
      const key = name.split('.')[1];
      setProductData((prevData) => ({
        ...prevData,
        description: { ...prevData.description, [key]: value }
      }));
    } else {
      setProductData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("image", file);
      const { data } = await axios.post("/upload", formData);
      setProductData((prevData) => ({ ...prevData, imageUrl: data.url }));
    } catch (err) {
      console.warn(err);
      alert("Помилка при завантаженні файлу");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Перевірка, чи є значення в полі "Тип" (type)
    // if (!productData.type || !productData.type.trim()) {
    //   alert("Будь ласка, введіть тип продукту");
    //   return;
    // }

    const productDataToSubmit = {
      ...productData,
      flavor: productData.flavor.split('\n'), // Перетворити смак на масив рядків
    };

    try {
      setLoading(true);
      if (id) {
        // await axios.put(`${process.env.REACT_APP_API_URL}/products/${id}`, productDataToSubmit);
        await axios.put(`${config.baseURL}/products/${id}`, productDataToSubmit);
      } else {
        // await axios.post(`${process.env.REACT_APP_API_URL}/products`, productDataToSubmit);
        await axios.post(`${config.baseURL}/products`, productDataToSubmit);
      }
      navigate("/elfbar");
    } catch (error) {
      console.error("Error creating/updating product:", error);
      alert("Помилка при створенні/оновленні продукту");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.addProductContainer}>
      <h2>{id ? "Редагувати продукт" : "Додати новий продукт"}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Назва:
          <input type="text" name="name" value={productData.name} onChange={handleChange} />
        </label>
        <br />
        <label>
          Кількість тяг:
          <input type="text" name="description.quantity" value={productData.description.quantity} onChange={handleChange} placeholder="тільки число"/>
        </label>
        <br />
        <label>
          Міцність:
          <input type="text" name="description.strength" value={productData.description.strength} onChange={handleChange} />
        </label>
        <br />
        <label>
          Тип:
          <input type="text" name="description.type" value={productData.description.type} onChange={handleChange} placeholder="тип писати обов'яково перша літера велика"/>
        </label>
        <br />
        <label>
          Об'єм:
          <input type="text" name="description.volume" value={productData.description.volume} onChange={handleChange} />
        </label>
        <br />
        <label>
          Опір:
          <input type="text" name="description.resistance" value={productData.description.resistance} onChange={handleChange} />
        </label>
        <br />
        <label>
          Зарядка:
          <input type="text" name="description.charging" value={productData.description.charging} onChange={handleChange} />
        </label>
        <br />
        <label>
          Смак: ❌  ✅
          <textarea name="flavor" value={productData.flavor} onChange={handleChange} placeholder="Всі смаки треба вводити через Enter"/>
        </label>
        <br />
        <label>
          Ціна:
          <input type="number" name="price" value={productData.price} onChange={handleChange} />
        </label>
        <br />
        <label style={{ display: 'none' }}>
          Зображення URL:
          <input type="text" name="imageUrl" value={productData.imageUrl} onChange={handleChange} />
        </label>
        <br />
        <input
          ref={inputFileRef}
          type="file"
          onChange={handleChangeFile}
          hidden
        />
        <button type="button" onClick={() => inputFileRef.current.click()}>
          Завантажити зображення
        </button>
        <br />
        {productData.imageUrl && (
          <img
            crossOrigin="anonymous"
            src={`${config.baseURL}${productData.imageUrl}`}
            // src={`${process.env.REACT_APP_API_URL}${productData.imageUrl}`}
            alt="Uploaded"
            className={styles.uploadedImage}
          />
        )}
        <br />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Завантаження..." : id ? "Оновити продукт" : "Додати продукт"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;