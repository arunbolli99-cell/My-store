import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignUp.css';

function SignUp() {
  const navigate = useNavigate();
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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        // Get existing users from localStorage
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if user already exists
        const userExists = existingUsers.some(user => user.email === formData.email);
        
        if (userExists) {
          setErrors({ email: 'An account with this email already exists' });
          setIsLoading(false);
          return;
        }
        
        // Create new user object
        const newUser = {
          id: Date.now().toString(),
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password, // In production, this should be hashed
          phone: formData.phone,
          createdAt: new Date().toISOString()
        };
        
        // Save to localStorage
        existingUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(existingUsers));
        let storedUser = JSON.parse(localStorage.getItem("users"));
        console.log(storedUser.name);
        
        setIsLoading(false);
        alert('Account created successfully! Please sign in.');
        navigate('/signin');
      }, 1000);
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
          {/* Name Fields */}
        
            <div className="form-group">
              <label htmlFor="firstName">
                First Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? 'error' : ''}
                placeholder="Enter first name"
              />
              
            </div>

            <div className="form-group">
              <label htmlFor="lastName">
                Last Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? 'error' : ''}
                placeholder="Enter last name"
              />
              
            </div>
          

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">
              Email Address <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter email address"
            />
            
          </div>

          {/* Phone Field */}
          <div className="form-group">
            <label htmlFor="phone">
              Phone Number <span className="required">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'error' : ''}
              placeholder="Enter 10-digit phone number"
            />
            
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">
              Password <span className="required">*</span>
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                placeholder="Create a password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i>
              </button>
            </div>
            
            <small className="password-hint">
              Password must be at least 6 characters with uppercase, lowercase, and number
            </small>
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirm Password <span className="required">*</span>
            </label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error' : ''}
                placeholder="Confirm password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <i className={showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i>
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="error-message">
                <i className="bi bi-exclamation-circle"></i> {errors.confirmPassword}
              </span>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
              />
              <span>
                I agree to the <Link to="/terms">Terms and Conditions</Link> and{' '}
                <Link to="/privacy">Privacy Policy</Link>
              </span>
            </label>
            {errors.agreeToTerms && (
              <span className="error-message">
                <i className="bi bi-exclamation-circle"></i> {errors.agreeToTerms}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="signup-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Sign In Link */}
        <div className="signin-link">
          Already have an account? <Link to="/sign-in">Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
