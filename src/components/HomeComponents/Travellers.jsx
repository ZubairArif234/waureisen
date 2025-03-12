import React from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import logo from '../../assets/logo.png';

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
            className="w-6 h-6 object-contain"
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
  const testimonials = [
    {
      review: "Booking through Waureisen was incredibly easy and stress-free. We were well advised from start to finish and were able to plan our trip exactly as we wanted. All details were perfectly organized, making our vacation especially enjoyable. It was a great experience that we will definitely repeat!",
      author: "Claudia Meier",
      date: "January 2025"
    },
    {
      review: "Our stay was absolutely perfect! The cottage was cozy, well-equipped, and surrounded by beautiful nature. Our dog loved the spacious, fenced garden, giving us peace of mind while we relaxed. The quiet location was exactly what we needed for a stress-free getaway. We can't wait to return!",
      author: "Peter Fässler",
      date: "December 2024"
    }
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headings */}
        <div className="text-center mb-12">
          <p className="text-brand text-lg mb-3">Travellers</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            What they said about us
          </h2>
        </div>

        {/* Testimonials Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center z-10">
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center z-10">
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                review={testimonial.review}
                author={testimonial.author}
                date={testimonial.date}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Travellers;