import React from 'react';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';

const Imprint = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-12">Impressum</h1>
          
          <div className="space-y-12">
            {/* Betreiber der Website */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Betreiber der Website</h2>
              <p className="text-gray-700">Waureisen GmbH</p>
              <p className="text-gray-700">Kanzleistrasse 88</p>
              <p className="text-gray-700">8004 Zürich</p>
              <a href="mailto:hallo@waureisen.com" className="text-brand hover:underline">
                hallo@waureisen.com
              </a>
            </section>
            
            {/* Konzept und Design */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Konzept und Design</h2>
              <p className="text-gray-700">Waureisen GmbH</p>
              <p className="text-gray-700">Kanzleistrasse 88</p>
              <p className="text-gray-700">8004 Zürich</p>
              <a href="mailto:hallo@waureisen.com" className="text-brand hover:underline">
                hallo@waureisen.com
              </a>
            </section>
            
            {/* Technische Entwicklung */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Technische Entwicklung</h2>
              <p className="text-gray-700">Waureisen GmbH</p>
              <p className="text-gray-700">Kanzleistrasse 88</p>
              <p className="text-gray-700">8004 Zürich</p>
              <a href="mailto:hallo@waureisen.com" className="text-brand hover:underline">
                hallo@waureisen.com
              </a>
            </section>
            
            {/* Haftungshinweis */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Haftungshinweis</h2>
              <p className="text-gray-700">
                Der Inhalt unserer Webseiten wird mit grösstmöglicher Sorgfalt gepflegt. Es wird jedoch für
                den Inhalt keine Haftung übernommen. Die Waureisen GmbH lehnt jede Haftung für allfällige
                Ansprüche im Zusammenhang mit ihrer Website, den Angaben und Informationen auf ihrer
                Website und/oder der Benützung ihrer Website ausdrücklich und vollumfänglich ab.
                Insbesondere übernimmt die eisen GmbH keinerlei Haftung und/oder Verantwortung für auf
                ihrer Website verzeichnete Hinweise und/oder links auf Website Dritter und für im
                Zusammenhang damit möglicherweise auftretende Probleme.
              </p>
            </section>
            
            {/* Allgemeine Bestimmungen */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Allgemeine Bestimmungen</h2>
              <p className="text-gray-700">Copyright: 2024 Waureisen GmbH</p>
              <p className="text-gray-700">Der Inhalt aller Texte, Logos und Bilder sind urheberrechtlich geschützt.</p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Imprint;