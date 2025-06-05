import React, { memo, useEffect } from "react";
import Hero from "../../components/HomeComponents/Hero";
import Recommendations from "../../components/HomeComponents/Recommendations";
import Features from "../../components/HomeComponents/Features";
import Travellers from "../../components/HomeComponents/Travellers";
import Register from "../../components/HomeComponents/Register";
import Footer from "../../components/Shared/Footer";
import Calendly from "../../components/HomeComponents/Calendly";
import ChatWidget from "../../components/Shared/ChatWidget";
import { useNavigate } from "react-router-dom";
import { changeMetaData } from "../../utils/extra";
import axios from "axios";
// import fs from "fs"

const Home = memo(() => {
  useEffect(() => {
                changeMetaData("Waureisen - Urlaub mit Hund");
              }, [])
  const navigate = useNavigate()
  const userType = localStorage?.getItem("userType")

  useEffect(() => {
    if (userType == "provider"){
navigate("/provider/dashboard")
}else if (userType == "admin"){
      navigate("/admin/accommodations")

    }
  }, [userType]);

  useEffect(() => {
    const downloadJSON = (data, filename = "dog_friendly_accommodations.json") => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  
  URL.revokeObjectURL(url);
};
    const url = 'http://localhost:5000/api/interhome/accommodation/all';
    const all = [];
    const batchSize = 10;

    const fetchDetailsInBatches = async () => {
      try {
        const response = await axios.get(url);
        const items = response?.data?.data?.accommodationItem || [];

        console.log(`✅ Total accommodations: ${items.length}`);

        for (let i = 39000; i < 39686; i += batchSize) {
          const batch = items.slice(i, i + batchSize);

          console.log(`⏳ Processing batch ${i / batchSize + 1} (${batch.length} items)...`);

          await Promise.all(
            batch.map(async (acco) => {
              try {
                const res2 = await axios.get(`http://localhost:5000/api/interhome/accommodation/detail/${acco?.code}`);
                const attributes = res2?.data?.data?.accommodation?.attributes?.attribute || [];
                const descriptions = res2?.data?.data?.accommodation?.descriptions?.description;
console.log(res2)
                const hasDogAttribute = attributes.some(attr =>
                  attr?.name?.toLowerCase().includes("dog") || attr?.name?.toLowerCase().includes("hund")
                );
                const hasDogDescription = descriptions.some(attr =>
                  attr?.value?.toLowerCase().includes("hund") ||  attr?.value?.toLowerCase().includes("dog")
                );

                if (hasDogAttribute || hasDogDescription) {
                  all.push(res2.data.data);
                }
              } catch (err) {
                console.error(`❌ Error fetching detail for ${acco?.code}:`, err.message);
              }
            })
          );

          // Optional delay between batches
          await new Promise(resolve => setTimeout(resolve, 300)); // 300ms pause
        }

        console.log(`🐶 Done! Dog-friendly accommodations: ${all.length}`);
        console.log(all);
        downloadJSON(all);
      } catch (err) {
        console.error('❌ Error fetching main list:', err.message);
      }
    };

    // fetchDetailsInBatches();
  }, []);
  return (
    <main className="min-h-screen">
      <Hero />
      <Recommendations />
      <Features />
      <Travellers />
      <Register />
      <Calendly />
      <ChatWidget />
      <Footer />
    </main>
  );
});

export default Home;
