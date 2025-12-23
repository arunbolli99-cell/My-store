import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UseAuth } from "./AuthContext";
import apiService from "./apiService";
import "./SignIn.css";

function SignIn() {
  const navigate = useNavigate();
  const { signin } = UseAuth();

  const [step, setStep] = useState("email");
  const [formData, setFormData] = useState({
    email: "",
  });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setError("");
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      setError("Please enter your email");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await apiService.sendOtp(formData.email);
      setStep("otp");
      alert("✅ OTP sent to your registered mobile number!");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to send OTP");
      alert(err.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await apiService.verifyOtp(formData.email, otp);
      
      signin({
        token: response.token,
        userId: response.userId,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email
      });

      alert(response.message || "Signed in successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message || "Invalid OTP");
      alert(err.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setOtp("");
    setError("");
  };

  return (
    <div className="signIn_container">
      <div className="signIn_box">
        <h1>Sign In Page</h1>

        {step === "email" && (
          <form className="sign-in_form" onSubmit={handleSendOtp}>
            <div id="username_div" className="form-group">
              <label>
                Email <span className="required">*</span>
              </label>
              <input
                id="username_input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                required
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            <button className="submit_btn" type="submit" disabled={isLoading}>
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form className="sign-in_form" onSubmit={handleVerifyOtp}>
            <p style={{ textAlign: "center", marginBottom: "20px" }}>
              OTP has been sent to your registered mobile number
            </p>

            <div className="form-group">
              <label>
                Enter OTP <span className="required">*</span>
              </label>
              <input
                type="text"
                value={otp}
                onChange={handleOtpChange}
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                required
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            <button className="submit_btn" type="submit" disabled={isLoading}>
              {isLoading ? "Verifying OTP..." : "Verify OTP"}
            </button>

            <button 
              type="button" 
              className="submit_btn" 
              style={{ marginTop: "10px", backgroundColor: "#6c757d" }}
              onClick={handleBackToEmail}
              disabled={isLoading}
            >
              Back to Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default SignIn;
