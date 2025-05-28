import React, { useEffect } from "react";
import Navbar from "../../components/Shared/Navbar";
import Footer from "../../components/Shared/Footer";
import { useLanguage } from "../../utils/LanguageContext";
import { changeMetaData } from "../../utils/extra";
import { useLocation, useNavigate } from "react-router-dom";

const Imprint = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location?.pathname != "/imprint") navigate("/imprint");
  }, [location.pathname]);
  useEffect(() => {
    changeMetaData("Inprint - Waureisen");
  }, []);
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-12">
            {t("imprint")}
          </h1>

          <div className="space-y-12">
            {/* Betreiber der Website */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t("website_operator")}
              </h2>
              <p className="text-gray-700">Waureisen GmbH</p>
              <p className="text-gray-700">Kanzleistrasse 88</p>
              <p className="text-gray-700">8004 Zürich</p>
              <a
                href="mailto:hallo@waureisen.com"
                className="text-brand hover:underline"
              >
                hallo@waureisen.com
              </a>
            </section>

            {/* Konzept und Design */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t("concept_design")}
              </h2>
              <p className="text-gray-700">Waureisen GmbH</p>
              <p className="text-gray-700">Kanzleistrasse 88</p>
              <p className="text-gray-700">8004 Zürich</p>
              <a
                href="mailto:hallo@waureisen.com"
                className="text-brand hover:underline"
              >
                hallo@waureisen.com
              </a>
            </section>

            {/* Technische Entwicklung */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t("technical_development")}
              </h2>
              <p className="text-gray-700">Waureisen GmbH</p>
              <p className="text-gray-700">Kanzleistrasse 88</p>
              <p className="text-gray-700">8004 Zürich</p>
              <a
                href="mailto:hallo@waureisen.com"
                className="text-brand hover:underline"
              >
                hallo@waureisen.com
              </a>
            </section>

            {/* Haftungshinweis */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t("liability_notice")}
              </h2>
              <p className="text-gray-700">{t("liability_text")}</p>
            </section>

            {/* Allgemeine Bestimmungen */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t("general_provisions")}
              </h2>
              <p className="text-gray-700">{t("copyright_info")}</p>
              <p className="text-gray-700">{t("content_copyright")}</p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Imprint;
