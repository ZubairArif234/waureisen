import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const AccordionItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="bg-[#FAFAFA] rounded-lg overflow-hidden">
      <button
        className="w-full px-6 py-2 text-left flex justify-between items-center"
        onClick={onClick}
      >
        <span className="text-gray-700">{question}</span>
        <ChevronDown 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      <div 
        className={`px-6 overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-96 pb-4' : 'max-h-0'
        }`}
      >
        <p className="text-gray-600">{answer}</p>
      </div>
    </div>
  );
};

const FAQContent = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqItems = [
    {
      question: "How can I find dog-friendly accommodations in Europe through Waureisen?",
      answer: "You can easily find dog-friendly accommodations using our specialized search filters. Simply enter your destination, dates, and select 'traveling with dog' in the search options. Our platform offers over 30+ dog-specific filters to help you find the perfect stay that matches both your and your dog's needs."
    },
    {
      question: "Do I need travel insurance for my dog?",
      answer: "While not always mandatory, we highly recommend getting pet travel insurance. It can cover veterinary emergencies, trip cancellations due to pet illness, and other unexpected situations. Check with your regular pet insurance provider about international coverage or consider specialized pet travel insurance."
    },
    {
      question: "What are the entry requirements for dogs in the Netherlands?",
      answer: "Dogs entering the Netherlands must have a valid EU Pet Passport or veterinary certificate, a microchip, current rabies vaccination, and be at least 15 weeks old. The rabies vaccination must be given at least 21 days before travel. Additional requirements may apply depending on your country of origin."
    },
    {
      question: "What accessories should I bring for my trip with my dog?",
      answer: "Essential items include: leash and collar with ID tags, food and water bowls, familiar bedding, waste bags, grooming supplies, any regular medications, copies of health records, and favorite toys. For longer trips, consider bringing a portable water bottle and collapsible bowls."
    },
    {
      question: "Should I visit a veterinarian before traveling?",
      answer: "Yes, it's recommended to visit your vet 2-4 weeks before travel. They can ensure vaccinations are up-to-date, provide necessary health certificates, check your dog's fitness for travel, and offer specific advice based on your destination and dog's health condition."
    },
    {
      question: "How can I prepare my dog for a long car ride?",
      answer: "Start with short car trips to build positive associations. Ensure your dog has a comfortable, secure space with familiar bedding. Plan regular breaks every 2-3 hours for water, bathroom, and exercise. Consider using a crash-tested car harness or carrier for safety."
    },
    {
      question: "Can I travel with my dog on public transportation in Spain?",
      answer: "Most public transportation in Spain allows dogs, but rules vary by region and transport type. Generally, small dogs in carriers are allowed on most trains and metros. Larger dogs may need to be leashed and muzzled, and you might need to pay an additional fee. Always check specific carrier policies before traveling."
    },
    {
      question: "Are food and water bowls provided in all accommodations for my dog?",
      answer: "While many of our dog-friendly accommodations provide basic pet amenities, we recommend checking the specific listing details. Some properties offer complete pet packages including bowls, beds, and treats, while others may require you to bring your own supplies."
    },
    {
      question: "Are there dog bans on beaches in Europe?",
      answer: "Beach access for dogs varies by location and season. Many European beaches have specific dog-friendly sections or allow dogs during off-peak hours/seasons. Some beaches may completely restrict dog access, especially during peak tourist season. Check local regulations for your specific destination."
    }
  ];

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headings */}
        <div className="text-center mb-12">
          <p className="text-brand text-lg mb-3">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>    
    </section>
  );
};

export default FAQContent;