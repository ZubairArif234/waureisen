import React from 'react';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';
import together from '../../assets/together.png';
import ceo from '../../assets/ceo.png';
import founder from '../../assets/partner.png';
import { PawPrint } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-20 pb-16">
        {/* About Us Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-5xl font-bold text-center mb-10">About us</h1>
          
          {/* About Text */}
          <div className="prose prose-lg mx-auto mb-12 text-gray-700">
            <p className="text-center mb-6">
            We are Simone and Charlie, and together we are Waureisen! 🐾 With over 10 years of
            experience in the tourism industry and a great passion for travel, we are the first Swiss
            travel company specializing in unforgettable vacation adventures for you and your dog.
            For the past two years, Charlie has officially been joining us on our travels, ensuring that
            no destination is too far when it comes to finding dog-friendly spots. 🌍✈️ Our journeys
            always start together – as a team on an adventure! We know exactly what it takes to
            make sure both you as a dog owner and your furry friend feel right at home. As a dog
            mom, Simone understands exactly what our four-legged companions need to feel not just
            "tolerated" but truly welcomed. 🐶❤️ We discover the best dog-friendly
            accommodations, activities, and restaurants – not only while traveling but also in our
            everyday lives. It's the special places we find that make a vacation unforgettable for all of
            us: a dog paradise to run around in, a café where dogs are welcome, or a hiking trail with
            breathtaking views that we can enjoy together. 🌲🏞️ Our mission at Waureisen is to help
            you and your dog have the perfect vacation. We take care of everything: from finding the
            best accommodations to handling entry requirements, dog-friendly restaurants, and
            beaches where your dog can happily run around. 🏖️🍴🐕 With our extensive experience
            in tourism and love for dogs, we are your personal travel partner – so you can focus on
            what matters most: the adventure with your dog! 💼🐕 Let’s plan your next vacation
            together – with the best tips for dog-friendly activities, hiking trails, and everything that
            will make your stay even more enjoyable. We make sure nothing is missing so you can
            create unforgettable memories with your dog! 🌟🐾 Ready for your next adventure?
            We’re excited to help you find the perfect destination for both of you! 🐕💫
            </p>
            
          </div>
          
          {/* Together Image */}
          <div className="flex justify-center mb-20">
            <img 
              src={together} 
              alt="Simone and Charlie together" 
              className="rounded-lg shadow-md max-w-full md:max-w-2xl"
            />
          </div>
          
          {/* Team Section */}
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-10">The team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Simone Card */}
            <div className="bg-white rounded-lg overflow-hidden">
              <img 
                src={ceo} 
                alt="Simone" 
                className="w-full h-80 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-xl font-bold text-left">👧 Simone, CEO and Founder</h3>
                </div>
                <p className="text-gray-700 text-left">
                Hi, I’m Simone! With over 10 years of experience in the tourism industry, a heart full of love for dogs, and a passion for exploring unique accommodations, I’ve made it my mission to craft unforgettable travel experiences for you and your four-legged companion. Whether you're seeking a peaceful retreat or an adventurous getaway, I know just the right places where both you and your dog will feel completely at home. Let’s create memories that will last a lifetime, together!
                </p>
              </div>
            </div>
            
            {/* Charlie Card */}
            <div className="bg-white rounded-lg overflow-hidden">
              <img 
                src={founder} 
                alt="Charlie" 
                className="w-full h-80 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-xl text-left font-bold ">🐶 Charlie, Co-Founder, Office Princess</h3>
                </div>
                <p className="text-gray-700 text-left">
                Hi, I’m Charlie, a curious and playful Maltipoo female with two years of travel experience – and yes, I’m also the "office princess"! Together with my best friend Simone, I explore the world and test the most beautiful accommodations. My mission? To make sure that my furry friends have just as much fun as I do! Whether traveling or in the office – we never get bored!
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;