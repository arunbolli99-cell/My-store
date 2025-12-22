
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UseAuth } from './AuthContext';
import apiService from './apiService';
import './SignUp.css';

function SignUp() {
  const navigate = useNavigate();
  const { signup } = UseAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.agreeToTerms)
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendWelcomeEmail = async (userEmail, userName) => {
    try {
      await fetch('https://my-store-backend-h6ho.onrender.com/send-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          subject: 'Welcome to Our Store',
          userName: userName
        })
      });
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await apiService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone
      });

      signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email
      });

      const fullName = `${formData.firstName} ${formData.lastName}`;
      await sendWelcomeEmail(formData.email, fullName);
      alert('✅ Account created successfully!');
      navigate('/sign-in');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(`❌ ${error.message || 'Failed to create account'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h2>Create Account</h2>
          <p>Join us today and start shopping!</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          {/* First Name */}
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
            />
            {errors.firstName && <p className="error-message">{errors.firstName}</p>}
          </div>

          {/* Last Name */}
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
            />
            {errors.lastName && <p className="error-message">{errors.lastName}</p>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter 10-digit phone number"
            />
            {errors.phone && <p className="error-message">{errors.phone}</p>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label>Confirm Password</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
          </div>

          {/* Terms */}
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
              />
              I agree to the <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy</Link>
            </label>
            {errors.agreeToTerms && <p className="error-message">{errors.agreeToTerms}</p>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="signup-btn" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="signin-link">
          Already have an account? <Link to="/signin">Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
