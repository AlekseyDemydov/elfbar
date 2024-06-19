// Feedback.jsx

import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import config from '../../config';
import { useForm } from 'react-hook-form';
import styles from './Feedback.module.scss'; // імпорт CSS-модуля

export const Feedback = () => {
  const { register, handleSubmit, reset } = useForm();
  const [feedbacks, setFeedbacks] = useState([]);
  const userEmail = localStorage.getItem('adminEmail') || '';

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(`${config.baseURL}/feedback`);
        setFeedbacks(response.data);
      } catch (error) {
        console.error('Помилка при завантаженні відгуків:', error);
      }
    };

    fetchFeedbacks();
  }, []);

  const onSubmit = async data => {
    const formData = new FormData();
    formData.append('image', data.image[0]);

    try {
      // Завантаження зображення на сервер
      const uploadResponse = await axios.post(
        `${config.baseURL}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const imageUrl = uploadResponse.data.url;

      // Збереження URL зображення в базі даних
      const feedbackResponse = await axios.post(`${config.baseURL}/feedback`, {
        imageUrl,
      });

      console.log('Відгук успішно створено:', feedbackResponse.data);
      setFeedbacks(prevFeedbacks => [...prevFeedbacks, feedbackResponse.data]);
      reset();
    } catch (error) {
      console.error('Помилка при створенні відгуку:', error);
    }
  };

  const handleDelete = async id => {
    try {
      // Отримуємо URL зображення, щоб потім видалити його з сервера
      const feedbackToDelete = feedbacks.find(feedback => feedback._id === id);
      const imageUrlToDelete = feedbackToDelete.imageUrl;
  
      // Видаляємо відгук із сервера
      await axios.delete(`${config.baseURL}/feedback/${id}`);
  
      // Видаляємо зображення з сервера
      await axios.delete(imageUrlToDelete);
  
      // Оновлюємо стан, видаляючи відгук із масиву feedbacks
      setFeedbacks(prevFeedbacks =>
        prevFeedbacks.filter(feedback => feedback._id !== id)
      );
    } catch (error) {
      console.error('Помилка при видаленні відгуку:', error);
    }
  };

  return (
    <div className={styles.feedbackContainer}>
      {userEmail === 'ivan@gmail.com' && (
        <form
          className={styles.formContainer}
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            className={styles.fileInput}
            type="file"
            {...register('image')}
          />
          <button className={styles.submitButton} type="submit">
            Завантажити зображення
          </button>
        </form>
      )}
      <div className={styles.feedbackList}>
        {feedbacks.map(feedback => (
          <div key={feedback._id} className={styles.feedbackItem}>
            <img
              crossOrigin="anonymous"
              src={`${config.baseURL}${feedback.imageUrl}`}
              alt="Feedback"
              className={styles.image}
            />
            {userEmail === 'ivan@gmail.com' && (
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(feedback._id)}
              >
                Видалити зображення!
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
