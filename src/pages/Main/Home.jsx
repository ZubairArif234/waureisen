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

const Home = memo(() => {
  useEffect(() => {
                changeMetaData("Waureisen");
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
