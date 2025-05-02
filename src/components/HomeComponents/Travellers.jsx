import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import logo from '../../assets/together.png';
import { useLanguage } from '../../utils/LanguageContext';

const TestimonialCard = ({ review, author, date }) => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-300">
      {/* Star Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={20}
            className="fill-orange-400 text-orange-400"
          />
        ))}
      </div>

      {/* Review Text */}
      <p className="text-gray-600 leading-relaxed mb-6">{review}</p>

      {/* Author Info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <img 
            src={logo} 
            alt="Profile" 
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
        <div className="flex items-center">
          <span className="text-gray-900 font-medium">{author}</span>
          <span className="text-gray-400 mx-2">•</span>
          <span className="text-gray-400">{date}</span>
        </div>
      </div>
    </div>
  );
};

const Travellers = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { t, language } = useLanguage();
  
  const testimonials = [
    {
      review: {
        en: "Booking through Waureisen was incredibly easy and stress-free. We were well advised from start to finish and were able to plan our trip exactly as we wanted. All details were perfectly organized, making our vacation especially enjoyable. It was a great experience that we will definitely repeat!",
        de: "Die Buchung über Waureisen war unglaublich einfach und stressfrei. Wir wurden von Anfang bis Ende gut beraten und konnten unsere Reise genau nach unseren Wünschen planen. Alle Details waren perfekt organisiert, was unseren Urlaub besonders angenehm machte. Es war eine großartige Erfahrung, die wir definitiv wiederholen werden!"
      },
      author: "Claudia Meier",
      date: "January 2025"
    },
    {
      review: {
        en: "Our stay was absolutely perfect! The cottage was cozy, well-equipped, and surrounded by beautiful nature. Our dog loved the spacious, fenced garden, giving us peace of mind while we relaxed. The quiet location was exactly what we needed for a stress-free getaway. We can't wait to return!",
        de: "Unser Aufenthalt war absolut perfekt! Das Ferienhaus war gemütlich, gut ausgestattet und von wunderschöner Natur umgeben. Unser Hund liebte den geräumigen, eingezäunten Garten, was uns die nötige Ruhe gab, während wir uns entspannten. Die ruhige Lage war genau das, was wir für einen stressfreien Urlaub brauchten. Wir können es kaum erwarten, wiederzukommen!"
      },
      author: "Peter Fässler",
      date: "December 2024"
    },
    {
      review: {
        en: "What sets Waureisen apart is their attention to pet-friendly details. They found us a beautiful chalet with secure outdoor space for our dog. The local recommendations for dog-friendly restaurants and hiking trails were invaluable. It's refreshing to find a service that truly understands pet owners' needs.",
        de: "Was Waureisen auszeichnet, ist ihre Aufmerksamkeit für hundefreundliche Details. Sie fanden uns ein wunderschönes Chalet mit sicherem Außenbereich für unseren Hund. Die lokalen Empfehlungen für hundefreundliche Restaurants und Wanderwege waren unschätzbar. Es ist erfrischend, einen Service zu finden, der die Bedürfnisse von Haustierbesitzern wirklich versteht."
      },
      author: "Sarah Schmidt",
      date: "March 2025"
    },
    {
      review: {
        en: "An exceptional experience from start to finish. The accommodation exceeded our expectations with its perfect blend of comfort and luxury. The dedicated dog areas and thoughtful pet amenities made our furry friend feel just as welcome as we did. We've already booked our next stay!",
        de: "Eine außergewöhnliche Erfahrung von Anfang bis Ende. Die Unterkunft übertraf unsere Erwartungen mit ihrer perfekten Mischung aus Komfort und Luxus. Die speziellen Hundezonen und die durchdachten Haustier-Ausstattungen ließen unseren vierbeinigen Freund sich genauso willkommen fühlen wie uns. Wir haben bereits unseren nächsten Aufenthalt gebucht!"
      },
      author: "Michael Weber",
      date: "February 2025"
    }
  ];

  const testimonialsPerPage = 2;
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const visibleTestimonials = testimonials.slice(
    currentPage * testimonialsPerPage,
    (currentPage + 1) * testimonialsPerPage
  );

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headings */}
        <div className="text-center mb-12">
          <p className="text-brand text-lg mb-3">{t('travelers_love')}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {t('testimonials')}
          </h2>
        </div>

        {/* Testimonials Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button 
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center z-10 transition-transform hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center z-10 transition-transform hover:scale-110"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-8">
            {visibleTestimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="transition-all duration-300 transform"
              >
                <TestimonialCard
                  review={testimonial.review[language]}
                  author={testimonial.author}
                  date={testimonial.date}
                />
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 gap-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentPage === index 
                    ? 'bg-brand w-4' 
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Travellers;