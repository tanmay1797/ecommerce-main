import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const Carousel = () => {
  const [images, setImages] = useState([]);

  const fetchCarouselImages = async () => {
    try {
      const response = await axiosInstance.get("/uploads/get");
      setImages(response.data.images || []);
    } catch (error) {
      console.error("Error fetching carousel images:", error);
    }
  };

  useEffect(() => {
    fetchCarouselImages();
  }, []);

  useEffect(() => {
    if (images.length > 0 && window.bootstrap) {
      const el = document.querySelector("#carouselExampleAutoplaying");
      if (el) {
        new window.bootstrap.Carousel(el, {
          interval: 3000,
          ride: "carousel",
        });
      }
    }
  }, [images]);

  if (images.length === 0) return null;

  return (
    <div
      id="carouselExampleAutoplaying"
      className="carousel slide mb-4"
      data-bs-ride="carousel"
      data-bs-interval="3000"
    >
      <div className="carousel-inner rounded">
        {images.map((imgUrl, index) => (
          <div
            key={index}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <img
              src={imgUrl}
              className="d-block w-100"
              alt={`Slide ${index + 1}`}
            />
          </div>
        ))}
      </div>

      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleAutoplaying"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>

      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleAutoplaying"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Carousel;
