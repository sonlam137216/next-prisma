'use client';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { EmblaCarouselType as CarouselApi } from "embla-carousel";

const HeroSlider = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
 
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

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    const interval = setInterval(() => {
      api?.scrollNext();
    }, 5000);
   
    return () => clearInterval(interval);
  }, [api]);

  const getSlideIndex = (index: number) => {
    if (index < 0) return slides.length - 1;
    if (index >= slides.length) return 0;
    return index;
  };

  return (
    <section className="relative h-[calc(100vh-180px)] overflow-hidden bg-white mt-4">
      <div className="relative h-full w-full">
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full h-full"
          setApi={setApi}
        >
          <CarouselContent className="h-full">
            {slides.map((slide, index) => (
              <CarouselItem key={index} className="h-full">
                <div className="relative h-full w-full flex items-center justify-center gap-4">
                  {/* Previous slide preview */}
                  <div className="w-[10%] h-[95%] transition-all duration-700 ease-in-out transform hover:scale-105">
                    <div className="relative h-full w-full rounded-lg overflow-hidden opacity-20 transition-all duration-700 ease-in-out">
                      <Image
                        src={slides[getSlideIndex(index - 1)].image}
                        alt="Previous slide"
                        fill
                        className="object-cover transition-transform duration-700 ease-in-out"
                      />
                    </div>
                  </div>

                  {/* Current slide */}
                  <div className="relative w-[80%] h-[95%] transition-all duration-700 ease-in-out z-10">
                    <div className="relative h-full w-full rounded-xl overflow-hidden shadow-2xl">
                      <Image
                        src={slide.image}
                        alt={`Slide ${index + 1}`}
                        fill
                        priority={index === 0}
                        className="object-cover transition-transform duration-700 ease-in-out"
                      />
                    </div>
                  </div>

                  {/* Next slide preview */}
                  <div className="w-[10%] h-[95%] transition-all duration-700 ease-in-out transform hover:scale-105">
                    <div className="relative h-full w-full rounded-lg overflow-hidden opacity-20 transition-all duration-700 ease-in-out">
                      <Image
                        src={slides[getSlideIndex(index + 1)].image}
                        alt="Next slide"
                        fill
                        className="object-cover transition-transform duration-700 ease-in-out"
                      />
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Custom Navigation Buttons */}
          <div className="absolute z-20 flex justify-between w-full top-1/2 transform -translate-y-1/2 px-8">
            <Button
              onClick={() => api?.scrollPrev()}
              variant="secondary"
              size="icon"
              className="h-12 w-12 rounded-full bg-black/10 hover:bg-black/20 backdrop-blur-sm text-black border-0 transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft size={24} />
            </Button>
            <Button
              onClick={() => api?.scrollNext()}
              variant="secondary"
              size="icon"
              className="h-12 w-12 rounded-full bg-black/10 hover:bg-black/20 backdrop-blur-sm text-black border-0 transition-all duration-300 hover:scale-110"
            >
              <ChevronRight size={24} />
            </Button>
          </div>

          {/* Dot indicators */}
          <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`h-3 rounded-full transition-all duration-500 ease-in-out ${
                  currentSlide === index
                    ? "w-8 bg-black"
                    : "w-3 bg-black/40 hover:bg-black/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default HeroSlider;