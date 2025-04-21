'use client';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
 
  // Updated slider data with only images
  const slides = [
    {
      image: "/images/products/6a1996e6-935d-4a97-b842-0a0090dd1ba7.png"
    },
    {
      image: "/images/products/7649c11f-5d66-42fd-8aed-3305abb496a2.jpg"
    },
    {
      image: "/images/products/f92fc962-aa88-4fd8-9b9a-07ad2c49fb99.jpg"
    },
  ];

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
   
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative h-[calc(90vh-5rem)] overflow-hidden">
      {/* Slider images */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            currentSlide === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={`Slide ${index + 1}`}
            fill
            priority={index === 0}
            className="object-cover"
          />
        </div>
      ))}
     
      {/* Navigation arrows */}
      <div className="absolute z-20 flex justify-between w-full top-1/2 transform -translate-y-1/2 px-4 sm:px-6">
        <Button
          onClick={goToPrevSlide}
          variant="secondary"
          size="icon"
          className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-0"
        >
          <ChevronLeft size={20} />
        </Button>
        <Button
          onClick={goToNextSlide}
          variant="secondary"
          size="icon"
          className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-0"
        >
          <ChevronRight size={20} />
        </Button>
      </div>
     
      {/* Dot indicators */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              currentSlide === index
                ? "w-6 bg-primary"
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;