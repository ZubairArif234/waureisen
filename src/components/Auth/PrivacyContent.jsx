import React from 'react';

const PrivacyContent = () => {
  return (
    <div className="prose prose-sm max-w-none">
      <h1 className="text-4xl font-bold mb-12 text-center">Privacy Policy</h1>
      
      <div className="space-y-6">
        <p className="text-lg text-gray-700">
          Every marketplace business needs a privacy policy. To launch your
          marketplace fast, use our template as a basis for your policy.
        </p>

        <p className="text-lg text-gray-700">
          You can find the template{' '}
          <a 
            href="https://www.sharetribe.com/help/en/articles/8410839-free-templates-for-your-terms-of-service-and-privacy-policy#h_cb5658a86a"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:text-brand/80 underline transition-colors"
          >
            here
          </a>
          .
        </p>

      </div>
    </div>
  );
};

export default PrivacyContent;