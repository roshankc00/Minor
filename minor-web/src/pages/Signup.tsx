import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { SignupFormData } from '../types/auth';
import toast from 'react-hot-toast';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
      agreeToTerms: Yup.boolean()
        .oneOf([true], 'You must accept the terms and conditions')
        .required('You must accept the terms and conditions'),
    }),
    onSubmit: async (values: SignupFormData) => {
      try {
        const response = await fetch('http://localhost:8000/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({...values, username: values.name}),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Registration failed');
        }

        toast.success('Successfully registered! Please login.');
        navigate('/login');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Registration failed');
      }
    },
  });

  return (
    <div className="flex min-h-screen">
      {/* Left Content */}
      <div className="hidden w-full lg:block lg:w-1/2">
        <div className="flex h-full items-center justify-center bg-gray-900 px-20">
          <div>
            <h2 className="text-4xl font-bold text-white">
              Join HealthAI Today
            </h2>
            <p className="mt-3 text-lg text-gray-300">
              Experience the future of healthcare with our AI-powered platform.
            </p>
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="w-full lg:w-1/2">
        <div className="flex h-full flex-col justify-center px-6 py-12 lg:px-20">
          <div className="w-full max-w-md mx-auto">
            {/* Logo */}
            <div className="mb-8">
              <Link to="/" className="inline-block">
                <span className="text-3xl font-bold text-primary">HealthAI</span>
              </Link>
            </div>

            {/* Title */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white dark:text-white">
                Create Your Account
              </h2>
              <p className="mt-2 text-white dark:text-gray-400">
                Join our community of health-conscious individuals
              </p>
            </div>

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="mb-2.5 text-white block font-medium text-black dark:text-white">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    {...formik.getFieldProps('name')}
                    className="w-full rounded-lg border border-gray-300 bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-gray-600 dark:bg-gray-800"
                  />
                </div>
                {formik.touched.name && formik.errors.name && (
                  <p className="mt-1 text-sm text-red-500">{formik.errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="mb-2.5 text-white block font-medium text-black dark:text-white">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    {...formik.getFieldProps('email')}
                    className="w-full rounded-lg border border-gray-300 bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-gray-600 dark:bg-gray-800"
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-1 text-sm text-red-500">{formik.errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="mb-2.5 block text-white font-medium text-black dark:text-white">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...formik.getFieldProps('password')}
                    className="w-full rounded-lg border border-gray-300 bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-gray-600 dark:bg-gray-800"
                  />
                  <span 
                    className="absolute right-4 top-4 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11 9.62499C8.42188 9.62499 6.35938 7.59687 6.35938 5.12187C6.35938 2.64687 8.42188 0.618744 11 0.618744C13.5781 0.618744 15.6406 2.64687 15.6406 5.12187C15.6406 7.59687 13.5781 9.62499 11 9.62499ZM11 2.16562C9.28125 2.16562 7.90625 3.50624 7.90625 5.12187C7.90625 6.73749 9.28125 8.07812 11 8.07812C12.7188 8.07812 14.0938 6.73749 14.0938 5.12187C14.0938 3.50624 12.7188 2.16562 11 2.16562ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52188 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11.0688V17.2906ZM3.25 14.4124C4.90625 17.6687 7.75 19.8343 11 19.8343C14.25 19.8343 17.0938 17.6687 18.75 14.4124C17.0938 11.1562 14.25 8.99057 11 8.99057C7.75 8.99057 4.90625 11.1562 3.25 14.4124Z"
                          fill=""
                        />
                        <path
                          d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52188 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11.0688V17.2906ZM3.25 14.4124C4.90625 17.6687 7.75 19.8343 11 19.8343C14.25 19.8343 17.0938 17.6687 18.75 14.4124C17.0938 11.1562 14.25 8.99057 11 8.99057C7.75 8.99057 4.90625 11.1562 3.25 14.4124Z"
                          fill=""
                        />
                      </svg>
                    ) : (
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52188 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11.0688V17.2906ZM3.25 14.4124C4.90625 17.6687 7.75 19.8343 11 19.8343C14.25 19.8343 17.0938 17.6687 18.75 14.4124C17.0938 11.1562 14.25 8.99057 11 8.99057C7.75 8.99057 4.90625 11.1562 3.25 14.4124Z"
                          fill=""
                        />
                      </svg>
                    )}
                  </span>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="mt-1 text-sm text-red-500">{formik.errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className=" text-white mb-2.5 block font-medium text-black dark:text-white">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    {...formik.getFieldProps('confirmPassword')}
                    className="w-full rounded-lg border border-gray-300 bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-gray-600 dark:bg-gray-800"
                  />
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{formik.errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  {...formik.getFieldProps('agreeToTerms')}
                  className="h-5 w-5 rounded border-gray-300 bg-transparent text-primary focus:ring-primary dark:border-gray-600"
                />
                <label
                  htmlFor="agreeToTerms"
                  className="ml-3 text-sm font-medium text-white dark:text-gray-300"
                >
                  I agree to the{' '}
                  <Link
                    to="/terms"
                    className="text-primary hover:underline"
                  >
                    Terms and Conditions
                  </Link>
                </label>
              </div>
              {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.agreeToTerms}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full cursor-pointer rounded-lg border bg-primary py-4 text-white transition hover:bg-opacity-90"
              >
                Create Account
              </button>

              {/* Sign in link */}
              <div className="text-center">
                <p className="text-base text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-primary hover:underline"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
