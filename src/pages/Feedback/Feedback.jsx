import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import config from '../../config';
import { useForm } from 'react-hook-form';
import Slider from 'react-slick';
import Modal from 'react-modal'; // імпорт компоненту модального вікна
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './Feedback.module.scss';

export const Feedback = () => {
  const { register, handleSubmit, reset } = useForm();
  const [feedbacks, setFeedbacks] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false); // стан для відкриття/закриття модального вікна
  const [selectedImage, setSelectedImage] = useState(''); // для зберігання URL обраного зображення
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

      console.log('Відгук успішно створено:', feedbackResponse.data);
      setFeedbacks(prevFeedbacks => [...prevFeedbacks, feedbackResponse.data]);
      reset();
    } catch (error) {
      console.error('Помилка при створенні відгуку:', error);
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

  const openModal = imageUrl => {
    setSelectedImage(imageUrl);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedImage('');
    setModalIsOpen(false);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className={styles.feedbackContainer}>
      {userEmail === 'ivan@gmail.com' && (
        <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
          <input className={styles.fileInput} type="file" {...register('image')} />
          <button className={styles.submitButton} type="submit">
            Завантажити зображення
          </button>
        </form>
      )}
      <Slider {...settings} className={styles.feedbackList}>
        {feedbacks.map(feedback => (
          <div key={feedback._id} className={styles.feedbackItem}>
            <img
              crossOrigin="anonymous"
              src={`${config.baseURL}${feedback.imageUrl}`}
              alt="Feedback"
              className={styles.image}
              onClick={() => openModal(`${config.baseURL}${feedback.imageUrl}`)}
            />
            {userEmail === 'ivan@gmail.com' && (
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(feedback._id)}
              >
                Видалити зображення
              </button>
            )}
          </div>
        ))}
      </Slider>
      {/* Модальне вікно */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Зображення"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <button className={styles.closeButton} onClick={closeModal}>
          &times;
        </button>
        <img crossOrigin="anonymous" src={selectedImage} alt="Modal" className={styles.modalImage} />
      </Modal>
    </div>
  );
};
