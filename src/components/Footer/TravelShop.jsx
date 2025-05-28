import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../utils/LanguageContext';
import travelshopBg from '../../assets/travelshop.png';
import cs1 from '../../assets/cs1.avif';
import cs2 from '../../assets/cs2.avif';
import cs3 from '../../assets/cs3.avif';
import cs4 from '../../assets/cs4.avif';
import cs5 from '../../assets/cs5.avif';
import tm1 from '../../assets/tm1.avif';
import tm2 from '../../assets/tm2.avif';
import tm3 from '../../assets/tm3.avif';
import tm4 from '../../assets/tm4.avif';
import tm5 from '../../assets/tm5.avif';
import tm6 from '../../assets/tm6.avif';
import tm7 from '../../assets/tm7.avif';
import tm8 from '../../assets/tm8.avif';
import tb1 from '../../assets/tb1.avif';
import tb2 from '../../assets/tb2.avif';
import tb3 from '../../assets/tb3.avif';
import tb4 from '../../assets/tb4.avif';
import tb5 from '../../assets/tb5.avif';
import tb6 from '../../assets/tb6.avif';
import tb7 from '../../assets/tb7.avif';
import tb8 from '../../assets/tb8.avif';
import tb9 from '../../assets/tb9.avif';
import tb10 from '../../assets/tb10.avif';
import tb12 from '../../assets/tb11.webp';
import tb11 from '../../assets/tb12.webp';
import db1 from '../../assets/db1.avif';
import db2 from '../../assets/db2.avif';
import db3 from '../../assets/db3.avif';
import db4 from '../../assets/db4.avif';
import db5 from '../../assets/db5.avif';
import db6 from '../../assets/db6.avif';
import db7 from '../../assets/db7.avif';
import db8 from '../../assets/db8.avif';
import db9 from '../../assets/db9.avif';
import db10 from '../../assets/db10.avif';
import db11 from '../../assets/db11.avif';
import cl1 from '../../assets/cl1.avif';
import cl2 from '../../assets/cl2.avif';
import cl3 from '../../assets/cl3.avif';
import cl4 from '../../assets/cl4.avif';
import cl5 from '../../assets/cl5.avif';
import cl6 from '../../assets/cl6.avif';
import cl7 from '../../assets/cl7.avif';
import cl8 from '../../assets/cl8.avif';
import cl9 from '../../assets/cl9.avif';
import cl10 from '../../assets/cl10.avif';
import cl11 from '../../assets/cl11.avif';
import cl12 from '../../assets/cl12.avif';
import cl13 from '../../assets/cl13.avif';
import cl14 from '../../assets/cl14.avif';
import cl15 from '../../assets/cl15.avif';
import fb1 from '../../assets/fb1.avif';
import fb2 from '../../assets/fb2.avif';
import fb3 from '../../assets/fb3.avif';
import fb4 from '../../assets/fb4.avif';
import fb5 from '../../assets/fb5.avif';
import clh1 from '../../assets/clh1.avif';
import clh2 from '../../assets/clh2.avif';
import clh3 from '../../assets/clh3.avif';
import clh4 from '../../assets/clh4.avif';
import clh5 from '../../assets/clh5.avif';
import clh6 from '../../assets/clh6.avif';
import clh7 from '../../assets/clh7.avif';
import clh8 from '../../assets/clh8.avif';
import clh9 from '../../assets/clh9.avif';
import clh10 from '../../assets/clh10.avif';
import clh11 from '../../assets/clh11.avif';
import clh12 from '../../assets/clh12.avif';
import clh13 from '../../assets/clh13.avif';
import clh14 from '../../assets/clh14.avif';
import clh15 from '../../assets/clh15.avif';
import clh16 from '../../assets/clh16.avif';
import clh17 from '../../assets/clh17.avif';
import clh18 from '../../assets/clh18.avif';
import clh19 from '../../assets/clh19.avif';
import sn1 from '../../assets/sn1.avif';
import sn2 from '../../assets/sn2.avif';
import sn3 from '../../assets/sn3.avif';
import sn4 from '../../assets/sn4.avif';
import sn5 from '../../assets/sn5.avif';
import sn6 from '../../assets/sn6.avif';
import well1 from '../../assets/well1.avif';
import well2 from '../../assets/well2.avif';
import well3 from '../../assets/well3.avif';
import well4 from '../../assets/well4.avif';
import well5 from '../../assets/well5.avif';
import well6 from '../../assets/well6.avif';
import well7 from '../../assets/well7.avif';
import well8 from '../../assets/well8.avif';
import ta1 from '../../assets/ta1.avif';
import ta2 from '../../assets/ta2.avif';
import ta3 from '../../assets/ta3.avif';
import ta4 from '../../assets/ta4.avif';
import ta5 from '../../assets/ta5.avif';
import ta6 from '../../assets/ta6.avif';
import ta7 from '../../assets/ta7.avif';
import ta8 from '../../assets/ta8.avif';
import ta9 from '../../assets/ta9.avif';
import { changeMetaData } from '../../utils/extra';
import { useLocation, useNavigate } from 'react-router-dom';








const TravelShop = () => {
  // Sample product categories - these would typically come from an API
  const { t } = useLanguage();
  const  location  = useLocation();
  const  navigate  = useNavigate();
    useEffect(() => {
      changeMetaData("Travel Shop - Waureisen");
    }, []);
      useEffect(() => {
        if (location?.pathname != "/travelshop") navigate("/travelshop");
      }, [location.pathname]);
  const productCategories = [
    {
      title: t("car_seats"),
      products: [
        { id: 1, image: cs1, url: "https://petandco.ch/products/harry-cord-teddy-luxury-car-seat-with-orthoptic-visco-foam-in-khaki?_pos=1&_sid=b9b9a11f8&_ss=r&ref=waureisen" },
        { id: 2, image: cs2, url: "https://petandco.ch/collections/hundebetten/products/harry-faux-leather-luxury-car-seat-with-orthoptic-visco-foam-in-beige?ref=waureisen " },
        // { id: 3, image: cs3, url: "https://petandco.ch/collections/orthopaedische-hundebetten/products/harry-faux-leather-black?ref=waureisen " },
        { id: 4, image: cs4, url: "https://kitsuneandjo.ch/de/products/schleifen-leit-mittnacht-1?ref=waureisen " },
        { id: 5, image: cs5, url: "https://petandco.ch/products/harry-cord-luxury-car-seat-with-orthoptic-visco-foam-in-gray?_pos=3&_sid=b9b9a11f8&_ss=r&ref=waureisen " }
      ]
    },
    {
      title: t("travel_mats"),
      products: [
        { id: 1, image: tm1, url: "https://petandco.ch/products/garry-luxury-dog-mat?_pos=1&_sid=004f875c1&_ss=r&ref=waureisen " },
        { id: 2, image: tm2, url: "https://kitsuneandjo.ch/de/products/nomad-bed-pink?ref=waureisen " },
        { id: 3, image: tm3, url: "https://petandco.ch/products/gino-luxury-dog-mat?_pos=1&_sid=dc347bff1&_ss=r&ref=waureisen " },
        { id: 4, image: tm4, url: "https://petandco.ch/products/aventura-luxury-dog-travel-mat-in-cool-gray?_pos=5&_sid=dc347bff1&_ss=r&ref=waureisen " },
        { id: 5, image: tm5, url: "https://kitsuneandjo.ch/de/products/nomad-bed?ref=waureisen " },
        { id: 6, image: tm6, url: "https://petandco.ch/products/aventura-luxury-dog-travel-mat-graphite?ref=waureisen " },
        { id: 7, image: tm7, url: "https://petandco.ch/products/charly-luxury-dog-travel-mat-bag?_pos=2&_sid=d0fe0e9f4&_ss=r&ref=waureisen " },
        { id: 8, image: tm8, url: "https://petandco.ch/products/charly-cord-luxury-dog-travel-mat-bag-in-khaki?_pos=7&_sid=d0fe0e9f4&_ss=r&ref=waureisen " }
      ]
    },
    {
      title:  t("travel_bags"),
      products: [
        { id: 1, image: tb1, url: "https://petandco.ch/products/lucky-canvas-luxury-dog-bag-in-gray?_pos=7&_sid=d80c23648&_ss=r&ref=waureisen " },
        { id: 2, image: tb2, url: "https://kitsuneandjo.ch/products/olla-petite-dog-carrier?ref=waureisen" },
        { id: 3, image: tb3, url: "https://hundelicious.ch/product/the-canvas-bag-tragetasche-fuer-kleine-hunde/?ref=waureisen" },
        { id: 4, image: tb4, url: "https://petandco.ch/products/lucky-canvas-dark-olive?ref=waureisen" },
        { id: 5, image: tb5, url: "https://petandco.ch/products/lucky-luxury-dog-bag-in-brown?ref=waureisen " },
        { id: 6, image: tb6, url: "https://petandco.ch/products/lucky-paper-luxury-dog-bag-in-silver?_pos=12&_sid=d80c23648&_ss=r&ref=waureisen " },
        { id: 7, image: tb7, url: "https://petandco.ch/products/lucky-canvas-graphite?ref=waureisen" },
        { id: 8, image: tb8, url: "https://petandco.ch/products/lucky-dog-bag-khaki?ref=waureisen" },
        { id: 9, image: tb9, url: "https://kitsuneandjo.ch/de/products/eco-packable-sling-dog-carrier?ref=waureisen" },
        { id: 10, image: tb10, url: "https://petandco.ch/products/lucky-paper-luxury-dog-bag-in-black?ref=waureisen " },
        { id: 11, image: tb11, url: "https://kitsuneandjo.ch/de/products/schleifen-leit-mittnacht-2?ref=waureisen " },
        { id: 12, image: tb12, url: "https://kitsuneandjo.ch/de/products/schleifen-leit-mittnacht-3?ref=waureisen" }
      ]
    },
    {
      title: t("dog_beds"),
      products: [
        { id: 1, image: db1, url: "https://petandco.ch/products/kingston-cord-double-face-khaki?ref=waureisen" },
        // { id: 2, image: db2, url: "https://petandco.ch/products/cordi-hundebett-charcocal?ref=waureisen" },
        { id: 3, image: db3, url: "https://petandco.ch/products/goofy?ref=waureisen" },
        { id: 4, image: db4, url: "https://petandco.ch/products/ronny-cord-hundebett-dusky-pink?ref=waureisen" },
        { id: 5, image: db5, url: "https://petandco.ch/products/cordi-sand?ref=waureisen" },
        { id: 6, image: db6, url: "https://petandco.ch/products/snuggle-cord-faux-fur-khaki?ref=waureisen" },
        { id: 7, image: db7, url: "https://petandco.ch/products/louis-cord-sand?ref=waureisen" },
        { id: 8, image: db8, url: "https://petandco.ch/products/roi-hundebett?ref=waureisen" },
        { id: 9, image: db9, url: "https://petandco.ch/products/cordi-dusky-pink?ref=waureisen" },
        { id: 10, image: db10, url: "https://petandco.ch/products/kingston-basic-gray?ref=waureisen" },
        { id: 11, image: db11, url: "https://petandco.ch/products/cordi-khaki?ref=waureisen" }
      ]
    },
    {
      title: t("clothing"),
      products: [
        { id: 1, image: cl1, url: "https://kitsuneandjo.ch/de/products/raincoat-tropical?ref=waureisen" },
        { id: 2, image: cl2, url: "https://petandco.ch/collections/dog-wear/products/finn-quilted-coat-gray?ref=waureisen" },
        { id: 3, image: cl3, url: "https://hundelicious.ch/product/the-glow-jumper-crystal-sky/?ref=waureisen" },
        { id: 4, image: cl4, url: "https://kitsuneandjo.ch/de/products/life-jacket?ref=waureisen" },
        { id: 5, image: cl5, url: "https://petandco.ch/collections/dog-wear/products/finn-quilted-coat-blue?ref=waureisen" },
        { id: 6, image: cl6, url: "https://kitsuneandjo.ch/de/products/mini-meadow-reversible-dog-jacket?ref=waureisen" },
        { id: 7, image: cl7, url: "https://kitsuneandjo.ch/de/products/waffle-dog-apparel?ref=waureisen" },
        { id: 8, image: cl8, url: "https://kitsuneandjo.ch/de/products/dog-raincoat?ref=waureisen" },
        { id: 9, image: cl9, url: "https://hundelicious.ch/product/regenmantel-the-glow-raincoat/?ref=waureisen" },
        { id: 10, image: cl10, url: "https://kitsuneandjo.ch/de/products/teddy-drying-robe?ref=waureisen" },
        { id: 11, image: cl11, url: "https://petandco.ch/collections/dog-wear/products/milo-rain-coat-black?ref=waureisen" },
        { id: 12, image: cl12, url: "https://hundelicious.ch/product/the-glow-jumper-neon-matcha/?ref=waureisen" },
        { id: 13, image: cl13, url: "https://petandco.ch/collections/dog-wear/products/ruby-quilted-coat-with-harness-brown?ref=waureisen" },
        { id: 14, image: cl14, url: "https://hundelicious.ch/product/the-glow-raincoat-neon-tangerine-tiger-regular-fit/?ref=waureisen" },
        { id: 15, image: cl15, url: "https://petandco.ch/collections/dog-wear/products/ruby-quilted-coat-with-harness-olive?ref=waureisen" }
      ]
    },
    {
      title:  t("folding_bowls"),
      products: [
        { id: 1, image: fb1, url: "https://kitsuneandjo.ch/de/products/foldable-travel-bowl-kaki?ref=waureisen" },
        { id: 2, image: fb2, url: "https://hundelicious.ch/product/napf-to-go-tura-anthrazit/?ref=waureisen" },
        { id: 3, image: fb3, url: "https://kitsuneandjo.ch/de/products/go-portable-bowls-for-dogs?ref=waureisen" },
        { id: 4, image: fb4, url: "https://kitsuneandjo.ch/de/products/foldable-duo-travel-bowl-mint?ref=waureisen" },
        { id: 5, image: fb5, url: "https://hundelicious.ch/product/napf-to-go-tura-taupe/?ref=waureisen" }
      ]
    },
    {
      title:  t("collar_leash_harness"),
      products: [
        { id: 1, image: clh1, url: "https://kitsuneandjo.ch/de/products/hug-harness-mint?ref=waureisen" },
        { id: 2, image: clh2, url: "https://kitsuneandjo.ch/de/products/comfort-harness-terracotta?ref=waureisen" },
        { id: 3, image: clh3, url: "https://kitsuneandjo.ch/de/products/aviator-harness-black?ref=waureisen" },
        { id: 4, image: clh4, url: "https://kitsuneandjo.ch/de/products/the-fritz-collar-baby-blue?ref=waureisen" },
        { id: 5, image: clh5, url: "https://kitsuneandjo.ch/de/products/rainbow-harness?ref=waureisen" },
        { id: 6, image: clh6, url: "https://kitsuneandjo.ch/de/products/teddy-adjustable-neck-harness?ref=waureisen" },
        { id: 7, image: clh7, url: "https://kitsuneandjo.ch/de/products/cloud-lite-dog-harness-chai-brown?ref=waureisen" },
        { id: 8, image: clh8, url: "https://kitsuneandjo.ch/de/products/theo-teddy-adjustable-neck-harness?ref=waureisen" },
        { id: 9, image: clh9, url: "https://kitsuneandjo.ch/de/products/mulberry-waterproof-dog-collar?ref=waureisen" },
        { id: 10, image: clh10, url: "https://kitsuneandjo.ch/de/products/ivory-tort-adjustable-neck-harness?ref=waureisen" },
        { id: 11, image: clh11, url: "https://kitsuneandjo.ch/de/products/schleifen-leit-mittnacht?ref=waureisen" },
        { id: 12, image: clh12, url: "https://kitsuneandjo.ch/de/products/schleifenkragen-mitternacht?ref=waureisen" },
        { id: 13, image: clh13, url: "https://kitsuneandjo.ch/de/products/9m-waterpoof-dog-leash-chai-brown?ref=waureisen" },
        { id: 14, image: clh14, url: "https://kitsuneandjo.ch/de/products/braided-rope-leash-terracotta?ref=waureisen" },
        { id: 15, image: clh15, url: "https://kitsuneandjo.ch/de/products/festival-crochet-harness?ref=waureisen" },
        { id: 16, image: clh16, url: "https://kitsuneandjo.ch/de/products/9m-waterpoof-dog-leash-pistachio?ref=waureisen" },
        // { id: 17, image: clh17, url: "https://kitsuneandjo.ch/de/products/le-luxe-dog-collar-neo?ref=waureisen" },
        { id: 18, image: clh18, url: "https://kitsuneandjo.ch/de/products/braided-rope-leash-teal?ref=waureisen" },
        { id: 19, image: clh19, url: "https://kitsuneandjo.ch/de/products/lake-day-harness?ref=waureisen" }
      ]
    },
    {
      title: t("snacks"),
      products: [
        { id: 1, image: sn1, url: "https://hundelicious.ch/product/beef-lung-nuggets/?ref=waureisen" },
        { id: 2, image: sn2, url: "https://kitsuneandjo.ch/de/products/golden-bones?ref=waureisen" },
        { id: 3, image: sn3, url: "https://kitsuneandjo.ch/de/products/liver-blueberry-chewy-dog-treats?ref=waureisen" },
        { id: 4, image: sn4, url: "https://kitsuneandjo.ch/de/products/peanut-butter-banana-chewy-dog-treats?ref=waureisen" },
        { id: 5, image: sn5, url: "https://kitsuneandjo.ch/de/products/sweet-dreams?ref=waureisen" },
        { id: 6, image: sn6, url: "https://kitsuneandjo.ch/de/products/balance-calm?ref=waureisen" }
      ]
    },
    {
      title: t("wellness"),
      products: [
        // { id: 1, image: well1, url: "https://kitsuneandjo.ch/de/products/dog-towel-tan?ref=waureisen" },
        { id: 2, image: well2, url: "https://kitsuneandjo.ch/de/products/amino-acid-pet-shampoo?ref=waureisen" },
        // { id: 3, image: well3, url: "https://kitsuneandjo.ch/de/products/crystal-infused-luxury-pet-shampoo?ref=waureisen" },
        { id: 4, image: well4, url: "https://kitsuneandjo.ch/de/products/kiss-me-dental-spray?ref=waureisen" },
        { id: 5, image: well5, url: "https://hundelicious.ch/product/lucky-pup-reiseset/?ref=waureisen" },
        { id: 6, image: well6, url: "https://kitsuneandjo.ch/de/products/dream-cream?ref=waureisen" },
        { id: 7, image: well7, url: "https://kitsuneandjo.ch/de/products/certified-organic-dry-shampoo?ref=waureisen" },
        // { id: 8, image: well8, url: "https://kitsuneandjo.ch/de/products/calm-balm?ref=waureisen" }
      ]
    },
    {
      title: t("toys_additional"),
      products: [
        { id: 1, image: ta1, url: "https://kitsuneandjo.ch/de/products/butternut-toy-s?ref=waureisen" },
        { id: 2, image: ta2, url: "https://hundelicious.ch/product/die-schweiz-mit-hund-erleben/?ref=waureisen" },
        { id: 3, image: ta3, url: "https://hundelicious.ch/product/gassitasche-emma-taupe/?ref=waureisen" },
        { id: 4, image: ta4, url: "https://kitsuneandjo.ch/de/products/popcorn?ref=waureisen" },
        { id: 5, image: ta5, url: "https://hundelicious.ch/product/leckerlibeutel-karl-dunkelblau/?ref=waureisen" },
        { id: 6, image: ta6, url: "https://hundelicious.ch/product/reiseflasche-beige/?ref=waureisen" },
        { id: 7, image: ta7, url: "https://kitsuneandjo.ch/de/products/floral-pouch?_pos=19&_sid=9fe75d9e8&_ss=r&ref=waureisen" },
        { id: 8, image: ta8, url: "https://hundelicious.ch/product/leckerlibeutel-greta-anthrazit/?ref=waureisen" },
        { id: 9, image: ta9, url: "https://kitsuneandjo.ch/de/products/der-fritz-vogel-1?ref=waureisen" }
      ]
    }
  ];

  // ProductCategory component included directly in the file
  const ProductCategory = ({ category }) => {
    const scrollContainerRef = useRef(null);

    const scroll = (direction) => {
      const container = scrollContainerRef.current;
      const scrollAmount = direction === 'left' ? -container.offsetWidth : container.offsetWidth;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    return (
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-center mb-8">{category.title}</h2>
        
        <div className="relative">
          {/* Left scroll button */}
          <button 
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 focus:outline-none"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          
          {/* Product container */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide scroll-smooth px-12"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {category.products.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 max-w-xs">
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={`${category.title} product`}
                    className="w-full h-64 object-cover object-center"
                    onError={(e) => {
                      // Fallback for missing images in development
                      e.target.src = "https://placehold.co/600x400?text=Product+Image";
                    }}
                  />
                  <div className="p-4 flex justify-center">
                    <a 
                      href={product.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-6 py-2 bg-[#B4A481] text-white rounded-md hover:bg-[#a3927b] transition-colors"
                    >
                        {t('view_more')}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Right scroll button */}
          <button 
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 focus:outline-none"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
    );
  };



  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section with Background Image */}
      <div 
        className="relative h-[50vh] md:h-[90vh] w-full bg-cover bg-center mt-20"
        style={{ backgroundImage: `url(${travelshopBg})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl text-center md:text-6xl font-bold text-white">  {t('welcome_travelshop')}</h1>
        </div>
      </div>
      
      {/* Introduction Text */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-lg text-gray-700 leading-relaxed">
            {t('travelshop_intro')}
          </p>
        </div>
      </div>
      
   
      
      {/* Product Categories */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {productCategories.map((category, index) => (
          <ProductCategory key={index} category={category} />
        ))}
      </div>
      
      <Footer />
    </div>
  );
};

export default TravelShop;