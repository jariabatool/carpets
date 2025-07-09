import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductSlider.css';

export default function ProductSlider({ products }) {
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const scroll = () => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        if (scrollLeft + clientWidth >= scrollWidth) {
          sliderRef.current.scrollLeft = 0;
        } else {
          sliderRef.current.scrollLeft += 1;
        }
      }
    };
    const interval = setInterval(scroll, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slider" ref={sliderRef}>
      {products.map((product) => (
        <div
          key={product._id}
          className="slide"
          onClick={() => navigate(`/product/${product._id}`)}
        >
          <ProductImageSlideshow images={product.images || [product.image]} />
          <div className="info">
            <h4>{product.name}</h4>
            <p>${product.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductImageSlideshow({ images }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="product-image-slideshow">
      <img src={images[index]} alt={`Slide ${index + 1}`} />
    </div>
  );
}
