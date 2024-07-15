import React from 'react';
import PropTypes from 'prop-types';
import styles from './ExampleCarouselImage.module.scss';

const ExampleCarouselImage = ({ imageUrl, altText }) => (
  <div className={styles.imageContainer}>
    <img crossOrigin="anonymous" src={imageUrl} alt={altText} className={styles.carouselImage} />
  </div>
);

ExampleCarouselImage.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  altText: PropTypes.string.isRequired,
};

export default ExampleCarouselImage;
