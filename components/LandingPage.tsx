'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import Image from "next/image";
import { HeroSection } from "./HeroSection";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("harmony");

  const stoneCategories = [
    {
      id: "harmony",
      name: "Harmony Stones",
      description: "Stones that promote balance and harmony in your living space.",
      products: [
        { id: 1, name: "Jade Harmony Stone", price: 49.99, image: "/images/stones/stone-1.jpg", description: "Natural jade stone known for its balancing properties." },
        { id: 2, name: "Rose Quartz Harmony", price: 39.99, image: "/images/stones/stone-1.jpg", description: "Promotes love and peaceful energy in your home." },
        { id: 3, name: "Black Obsidian Balance", price: 45.99, image: "/images/stones/stone-1.jpg", description: "Protective stone that absorbs negative energy." },
      ]
    },
    {
      id: "wealth",
      name: "Wealth Stones",
      description: "Stones that attract prosperity and abundance.",
      products: [
        { id: 4, name: "Citrine Wealth Stone", price: 59.99, image: "/images/stones/stone-1.jpg", description: "The merchant's stone, known for attracting wealth." },
        { id: 5, name: "Pyrite Prosperity", price: 34.99, image: "/images/stones/stone-1.jpg", description: "Also known as 'Fool's Gold', attracts abundance." },
        { id: 6, name: "Green Aventurine", price: 42.99, image: "/images/stones/stone-1.jpg", description: "The stone of opportunity and good fortune." },
      ]
    },
    {
      id: "health",
      name: "Health Stones",
      description: "Stones that promote well-being and vitality.",
      products: [
        { id: 7, name: "Amethyst Healing", price: 54.99, image: "/images/stones/stone-1.jpg", description: "Calming stone that promotes inner peace and healing." },
        { id: 8, name: "Clear Quartz", price: 29.99, image: "/images/stones/stone-1.jpg", description: "Master healer that amplifies energy and thought." },
        { id: 9, name: "Bloodstone Vitality", price: 47.99, image: "/images/stones/stone-1.jpg", description: "Revitalizing stone that cleanses and grounds energy." },
      ]
    }
  ];

  const testimonials = [
    { id: 1, name: "Emily R.", text: "The Jade Harmony Stone brought such peaceful energy to my living room. I can feel the difference every day!", rating: 5 },
    { id: 2, name: "Michael T.", text: "Since placing the Citrine Wealth Stone in my office, I've seen a noticeable increase in business opportunities.", rating: 5 },
    { id: 3, name: "Sarah L.", text: "The Rose Quartz has transformed the energy in my bedroom. I sleep better and feel more at peace.", rating: 4 },
  ];

  return (
    <div className="container mx-auto space-y-12 py-8">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center space-y-6 py-12">
        <HeroSection />
      </section>

      {/* Featured Categories */}
      <section className="py-8 max-w-screen-xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Discover Our Collections</h2>
        <Tabs defaultValue="harmony" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            {stoneCategories.map(category => (
              <TabsTrigger key={category.id} value={category.id}>{category.name}</TabsTrigger>
            ))}
          </TabsList>
          
          {stoneCategories.map(category => (
            <TabsContent key={category.id} value={category.id} className="pt-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-medium mb-2">{category.name}</h3>
                <p className="text-gray-600">{category.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {category.products.map(product => (
                  <Card key={product.id} className="overflow-hidden">
                    <Image src={product.image} alt={product.name} width={300} height={300} className="w-full h-64 object-cover" />
                    <CardHeader>
                      <CardTitle>{product.name}</CardTitle>
                      <div className="flex justify-between items-center">
                        <CardDescription>{product.description}</CardDescription>
                        <Badge variant="outline" className="text-lg">${product.price}</Badge>
                      </div>
                    </CardHeader>
                    <CardFooter>
                      <Button className="w-full">Add to Cart</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* Benefits Section */}
      <section className="py-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6 max-w-screen-xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">The Benefits of Feng Shui Stones</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Balance & Harmony</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Our stones are carefully selected to restore balance and create harmony in any space, aligning with the ancient principles of feng shui.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Energy Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Strategic placement of our stones helps to optimize the flow of chi (energy) throughout your home or office, removing blockages.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Prosperity & Abundance</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Certain stones are known to attract wealth and prosperity when placed in the right locations according to feng shui principles.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-8 max-w-screen-xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">What Our Customers Say</h2>
        <Carousel className="w-full max-w-4xl mx-auto">
          <CarouselContent>
            {testimonials.map(testimonial => (
              <CarouselItem key={testimonial.id}>
                <Card className="border-none shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col space-y-4 items-center text-center">
                      <div className="flex space-x-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-400">★</span>
                        ))}
                      </div>
                      <p className="text-lg italic">"{testimonial.text}"</p>
                      <p className="font-medium">- {testimonial.name}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      {/* How to Use Section */}
      <section className="py-8 max-w-screen-xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">How to Use Feng Shui Stones</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Placement Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Proper placement is key to maximizing the benefits of your feng shui stones. Here are some guidelines:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Place wealth stones in the southeast corner of your home or office</li>
                <li>Harmony stones work best in the center of your living space</li>
                <li>Health stones should be placed in the east or northeast areas</li>
                <li>For relationship enhancement, place appropriate stones in the southwest</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Cleansing & Charging</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>To maintain the positive energy of your stones:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cleanse monthly under running water or with sage smoke</li>
                <li>Recharge in moonlight or sunlight for 24 hours</li>
                <li>Set intentions when placing stones in new locations</li>
                <li>Rotate stones to different areas as your needs change</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6 max-w-screen-xl mx-auto">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold">Join Our Feng Shui Community</h2>
          <p className="text-lg text-gray-600">Subscribe to receive expert tips, exclusive offers, and be the first to know about new stone collections.</p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input type="email" placeholder="Your email address" className="rounded-md border border-gray-300 px-4 py-2 flex-1" />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="text-center py-12 max-w-screen-xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Space?</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">Discover the perfect feng shui stones to bring harmony, prosperity, and positive energy into your life.</p>
        <Button size="lg">Shop Our Collection</Button>
      </section>
    </div>
  );
}