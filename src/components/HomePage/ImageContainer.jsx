import React from 'react';
import people1 from '../../assets/images/people-1.png';
import people2 from '../../assets/images/people-2.png';

const ImageContainer = () => {
  return (
    <div className="image-container">
      <img src={people1} alt="House-Party-1" className="responsive-image" />
      <img src={people2} alt="House-Party-2" className="responsive-image" />
    </div>
  );
};

export default ImageContainer;
