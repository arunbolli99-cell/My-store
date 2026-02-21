
import { useState, useEffect, useCallback, useRef } from 'react';
import './BannerSlider.css';
import mens_wear from '../../assets/mens_wear.jpg';
import biggest_sale from '../../assets/biggest_sale.jpg';
import women_wear from '../../assets/women_wear.jpg';
import beauty_products from '../../assets/beauty_products.jpg';
import electronics from '../../assets/electronics.jpg';
import shopping from '../../assets/shopping.jpg';

const BannerSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const autoPlayRef = useRef();

    const slides = [
        {
            url: biggest_sale,
            alt: 'Mens wear'
        },
        {
            url: mens_wear,
            alt: 'This week sale'
        },
        {
            url: women_wear,
            alt: 'Women wear'
        },
        {
            url: beauty_products,
            alt: 'Beauty products'
        },
        {
            url: electronics,
            alt: 'Electronics'
        },
        {
            url: shopping,
            alt: 'Shopping'
        }
    ];

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
    }, [slides.length]);

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    // Set up auto-play
    useEffect(() => {
        if (!isPaused) {
            autoPlayRef.current = setInterval(() => {
                nextSlide();
            }, 5000); // Slide every 5 seconds
        }
        return () => {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
            }
        };
    }, [nextSlide, isPaused]);

    return (
        <div
            className="banner-slider"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="slider-container">
                {slides.map((slide, index) => (
                    <div
                        className={`slide ${currentIndex === index ? 'active' : ''}`}
                        key={index}
                    >
                        <img src={slide.url} alt={slide.alt} />
                    </div>
                ))}
            </div>

            {/* Manual Navigation */}
            <button className="slider-arrow prev-arrow" onClick={prevSlide}>
                <i className="bi bi-chevron-left"></i>
            </button>
            <button className="slider-arrow next-arrow" onClick={nextSlide}>
                <i className="bi bi-chevron-right"></i>
            </button>

            {/* Pagination Dots */}
            <div className="slider-dots">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`dot ${currentIndex === index ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                    ></button>
                ))}
            </div>
        </div>
    );
};

export default BannerSlider;
