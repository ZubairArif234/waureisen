import React from 'react';

const MockMap = () => {
  return (
    <div className="h-[calc(100vh-220px)] lg:relative lg:top-[35px] fixed top-[120px] left-0 right-0 bottom-16">
      <div className="absolute inset-0 z-10 pointer-events-none" />
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15057.534307180755!2d-43.18815!3d-22.906847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1651234567890!5m2!1sen!2s"
        className="w-full h-full rounded-lg"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

export default MockMap;