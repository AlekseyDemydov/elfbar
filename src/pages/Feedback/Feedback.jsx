import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import config from '../../config';
import { useForm } from 'react-hook-form';
import Slider from 'react-slick';
import Modal from 'react-modal';
import Notiflix from 'notiflix';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './Feedback.module.scss';

// Встановіть елемент додатку для react-modal
Modal.setAppElement('#root');

export const Feedback = () => {
  const { register, handleSubmit, reset } = useForm();
  const [feedbacks, setFeedbacks] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
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
    slidesToShow: 4,
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
          <label className={styles.customFileUpload}>
            <input className={styles.fileInput} type="file" {...register('image')} />
            Оберіть файл
          </label>
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
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Зображення"
        className={styles.modal}
        overlayClassName={`${styles.overlay} ${modalIsOpen ? styles.open : ''}`}
        closeTimeoutMS={500}
      >
        <button className={styles.closeButton} onClick={closeModal}>
          &times;
        </button>
        {selectedImage && (
          <img crossOrigin="anonymous" src={selectedImage} alt="Modal" className={styles.modalImage} />
        )}
      </Modal>
    </div>
  );
};
