import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import config from '../../config';
import { useForm } from 'react-hook-form';
import Carousel from 'react-bootstrap/Carousel';
import Notiflix from 'notiflix';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Feedback.module.scss';
import ExampleCarouselImage from './ExampleCarouselImage/ExampleCarouselImage';

const Feedback = () => {
  const { register, handleSubmit } = useForm();
  const [feedbacks, setFeedbacks] = useState([]);
  const [productData, setProductData] = useState({ imageUrl: '' });
  const inputFileRef = useRef(null);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    fetchFeedbacks();
  }, []);
  useEffect(() => {
    const email = localStorage.getItem('adminEmail') || '';
    setUserEmail(email);
  }, []);
  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(`${config.baseURL}/feedback`);
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Помилка при завантаженні відгуків:', error);
    }
  };

  const handleDelete = async id => {
    try {
      await axios.delete(`${config.baseURL}/feedback/${id}`);
      setFeedbacks(prevFeedbacks =>
        prevFeedbacks.filter(feedback => feedback._id !== id)
      );
    } catch (error) {
      console.error('Помилка при видаленні відгуку:', error);
    }
  };

  const handleChangeFile = event => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('image', file);

      axios
        .post(`${config.baseURL}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          const imageUrl = response.data.url;
          setProductData({ imageUrl });
        })
        .catch(error => {
          console.error('Помилка при завантаженні зображення:', error);
          Notiflix.Notify.failure('Не вдалося завантажити зображення');
        });
    } catch (error) {
      console.error('Помилка при завантаженні зображення:', error);
      Notiflix.Notify.failure('Не вдалося завантажити зображення');
    }
  };

  const handleSubmitFeedback = async data => {
    try {
      await axios.post(`${config.baseURL}/feedback`, {
        imageUrl: productData.imageUrl,
      });
      fetchFeedbacks(); // Оновлюємо список відгуків після додавання нового
      setProductData({ imageUrl: '' }); // Очищаємо дані після успішного додавання
      Notiflix.Notify.success('Відгук успішно додано');
    } catch (error) {
      console.error('Помилка при додаванні відгуку:', error);
      Notiflix.Notify.failure('Не вдалося додати відгук');
    }
  };

  return (
    <div className={styles.feedbackContainer}>
    
    { userEmail === 'ivan@gmail.com' &&  (<form
        className={styles.formContainer}
        onSubmit={handleSubmit(handleSubmitFeedback)}
      >
        <label>
          
          <input
            type="text"
            {...register('imageUrl')}
            value={productData.imageUrl}
            readOnly
            className={styles.inpImgUrl}
          />
        </label>
        <br />
        <input
          ref={inputFileRef}
          type="file"
          className={styles.fileInput}
          onChange={handleChangeFile}
          accept="image/*"
          hidden
        />
        <button
          type="button"
          className={styles.customFileUpload}
          onClick={() => inputFileRef.current.click()}
        >
          Завантажити зображення
        </button>
        <span className={styles.fileName}>
          {productData.imageUrl && `Файл: ${productData.imageUrl}`}
        </span>
        <br />
        {productData.imageUrl && (
          <img
            crossOrigin="anonymous"
            src={`${config.baseURL}${productData.imageUrl}`}
            alt="Uploaded"
            className={styles.image}
          />
        )}
        <br />
        <button type="submit" className={styles.submitButton}>
          Додати відгук
        </button>
      </form>
)}
      <Carousel className={styles.feedbackList}>
        {feedbacks.map(feedback => (
          <Carousel.Item key={feedback._id} className={styles.feedbackItem}>
            <ExampleCarouselImage
              imageUrl={`${config.baseURL}${feedback.imageUrl}`}
              altText="Feedback"
            />
            { userEmail === 'ivan@gmail.com' &&  (<button
              className={styles.deleteButton}
              onClick={() => handleDelete(feedback._id)}
            >
              Видалити відгук
            </button>)}
            
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default Feedback;
