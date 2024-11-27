import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto px-4 py-24">
        <div className="bg-gradient-to-r from-primary/20 to-primary-dark/20 rounded-2xl p-12 backdrop-blur-lg">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
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
    </div>
  );
};

export default CTASection;
