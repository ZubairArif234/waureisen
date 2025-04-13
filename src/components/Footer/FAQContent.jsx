import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../../utils/LanguageContext';

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
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null);

  const faqItems = [
    {
      question: t('faq1_question'),
      answer: t('faq1_answer')
    },
    {
      question: t('faq2_question'),
      answer: t('faq2_answer')
    },
    {
      question: t('faq3_question'),
      answer: t('faq3_answer')
    },
    {
      question: t('faq4_question'),
      answer: t('faq4_answer')
    },
    {
      question: t('faq5_question'),
      answer: t('faq5_answer')
    },
    {
      question: t('faq6_question'),
      answer: t('faq6_answer')
    },
    {
      question: t('faq7_question'),
      answer: t('faq7_answer')
    },
    {
      question: t('faq8_question'),
      answer: t('faq8_answer')
    },
    {
      question: t('faq9_question'),
      answer: t('faq9_answer')
    }
  ];

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headings */}
        <div className="text-center mb-12">
        <p className="text-brand text-lg mb-3">{t('faq_title')}</p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          {t('frequently_asked_questions')}
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