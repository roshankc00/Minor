import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Navigation */}
      <nav className="bg-transparent py-6 fixed w-full z-50 top-0 backdrop-blur-lg bg-gray-900/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white">HealthAI</span>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Your Personal AI Healthcare Assistant
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Experience the future of healthcare with our AI-powered chatbot. Get instant medical information, symptom analysis, and health recommendations 24/7.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                to="/signup"
                className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started
              </Link>
              
              <Link
              to="/chat"
              className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Lets chat
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-800/50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Choose HealthAI?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-8 transform hover:scale-105 transition-transform duration-200 text-center"
              >
                <div className="text-primary mb-4 w-12 h-12 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-gradient-to-r from-primary/20 to-primary-dark/20 rounded-2xl p-12 backdrop-blur-lg">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust HealthAI for their healthcare needs. Start your journey to better health today.
            </p>
            <Link
              to="/signup"
              className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg text-lg font-semibold inline-block transition-colors duration-200"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-300">
            Find answers to common questions about HealthAI
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="mb-4"
            >
              <button
                className="w-full text-left bg-gray-800/30 hover:bg-gray-800/50 rounded-xl p-6 transition-all duration-200 border border-gray-700/30"
                onClick={() => toggleFaq(index)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-white pr-8">
                    {faq.question}
                  </h3>
                  <svg
                    className={`w-6 h-6 text-primary transform transition-transform duration-200 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                <div
                  className={`mt-4 text-gray-300 overflow-hidden transition-all duration-200 ${
                    openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  {faq.answer}
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <span className="text-2xl font-bold text-white">HealthAI</span>
              <p className="text-gray-400 mt-4">
                Your trusted AI healthcare companion, available 24/7 to assist with your health-related queries.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">How it Works</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Twitter</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">LinkedIn</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Facebook</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8">
            <p className="text-center text-gray-400">
              2024 HealthAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: '24/7 AI Assistance',
    description: 'Get instant medical information and support anytime, anywhere. Our AI is always here to help you with your health concerns.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Fast & Accurate',
    description: 'Powered by advanced AI technology, get quick and accurate responses to your health-related questions and concerns.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Private & Secure',
    description: 'Your health data is encrypted and secure. We prioritize your privacy and follow strict security protocols.',
  },
];

const faqs = [
  {
    question: "How accurate is HealthAI's medical advice?",
    answer: "HealthAI uses advanced AI technology trained on extensive medical data to provide accurate information. However, it's important to note that our AI is designed to provide general health information and should not replace professional medical advice.",
  },
  {
    question: "Is my health data secure?",
    answer: "Yes, we take your privacy seriously. All data is encrypted end-to-end, and we comply with healthcare data protection regulations. Your personal information is never shared without your explicit consent.",
  },
  {
    question: "Can HealthAI diagnose medical conditions?",
    answer: "While HealthAI can provide information about symptoms and potential conditions, it does not provide official medical diagnoses. Always consult with a qualified healthcare professional for proper diagnosis and treatment.",
  },
  {
    question: "Is HealthAI available 24/7?",
    answer: "Yes, HealthAI is available round-the-clock to assist you with health-related questions and information. You can access our services anytime, anywhere.",
  },
  {
    question: "How do I get started with HealthAI?",
    answer: "Getting started is easy! Simply sign up for an account, complete your health profile, and you can immediately begin interacting with HealthAI. Our intuitive interface makes it simple to ask questions and receive health information.",
  },
];

export default Home;
