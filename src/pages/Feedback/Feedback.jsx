import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import config from '../../config';
import { useForm } from 'react-hook-form';
import Carousel from 'react-bootstrap/Carousel';
import Notiflix from 'notiflix';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Feedback.module.scss';
import ExampleCarouselImage from './ExampleCarouselImage/ExampleCarouselImage';

export const Feedback = () => {
  const { register, handleSubmit, reset } = useForm();
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState('');
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

      const feedbackResponse = await axios.post(`${config.baseURL}/feedback`, {
        imageUrl,
      });

      Notiflix.Notify.success('Відгук успішно створено:');
      setFeedbacks(prevFeedbacks => [...prevFeedbacks, feedbackResponse.data]);
      reset();
      setSelectedFileName(''); // Скидаємо ім'я вибраного файлу після успішного завантаження
    } catch (error) {
      Notiflix.Notify.failure('Помилка при створенні відгуку', error);
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

  const handleFileChange = event => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
    }
  };

  return (
    <div className={styles.feedbackContainer}>
      {userEmail === 'ivan@gmail.com' && (
        <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
          <label className={styles.customFileUpload}>
            <input
              className={styles.fileInput}
              type="file"
              {...register('image')}
              onChange={handleFileChange}
            />
            Оберіть файл
          </label>
          {selectedFileName && <p className={styles.fileName}>{selectedFileName}</p>}
          <button className={styles.submitButton} type="submit">
            Завантажити зображення
          </button>
        </form>
      )}
      <Carousel className={styles.feedbackList}>
        {feedbacks.map(feedback => (
          <Carousel.Item key={feedback._id}>
            <ExampleCarouselImage
              imageUrl={`${config.baseURL}${feedback.imageUrl}`}
              altText="Feedback"
            />
            {userEmail === 'ivan@gmail.com' && (
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(feedback._id)}
              >
                Видалити зображення
              </button>
            )}
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};
