import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slices/authSlice";
import { setCart } from "../../redux/slices/cartSlice";
import { API_BASE_URL } from "../../api/apiService";
import "./SignIn.css";

function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Where to go after login — back to the page that triggered the redirect, or home
  const from = location.state?.from || "/";

  // step: "credentials" | "otp"
  const [step, setStep] = useState("credentials");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Store user data received from step 1 so we can use it after OTP verify
  const pendingUserData = useRef(null);

  const otpRefs = useRef([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // ── STEP 1: Submit credentials → backend sends OTP to email ──
  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Backend verified credentials & sent OTP — move to OTP step
        // Optionally store any partial user info for after verify
        pendingUserData.current = { email: formData.email };
        setStep("otp");
        startResendCooldown();
      } else {
        setError(data.message || data.error || "Invalid email or password");
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError("Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── STEP 2: Verify OTP → complete login ──
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      setError("Please enter the full 6-digit OTP.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: otpValue }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token
        const token = data.token || data.authToken || data.accessToken;
        if (token) localStorage.setItem("authToken", token);

        // Extract user details
        let firstName = data.firstName || data.user?.firstName;
        let lastName = data.lastName || data.user?.lastName || "";
        let email = data.email || formData.email;
        let phone = data.phone || "";
        let userCart = data.cart || [];

        if (userCart && !Array.isArray(userCart)) {
          if (userCart.products_items && Array.isArray(userCart.products_items)) {
            userCart = userCart.products_items;
          } else if (userCart.cart_items && Array.isArray(userCart.cart_items)) {
            userCart = userCart.cart_items;
          } else {
            userCart = [];
          }
        }

        if (!firstName) {
          const userData = data.user || data;
          firstName = userData.firstname || userData.name || userData.username || "User";
        }
        if (firstName === "User" && email) {
          const emailName = email.split("@")[0];
          if (emailName) firstName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
        }

        const user = { firstName, lastName, email, phone, userId: data.userId, username: email };

        dispatch(loginSuccess({ user, userId: data.userId, firstName, lastName, email, phone, cart: userCart, token }));
        dispatch(setCart(Array.isArray(userCart) ? userCart : []));

        navigate(from, { replace: true });
      } else {
        setError(data.message || data.error || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("OTP verify error:", err);
      setError("Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ──
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/login/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setOtp(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
        startResendCooldown();
      } else {
        setError(data.message || "Failed to resend OTP.");
      }
    } catch {
      setError("Could not resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  const startResendCooldown = () => {
    setResendCooldown(30);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  // ── OTP box keyboard handling ──
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // only digits
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    setError("");
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const updated = [...otp];
    pasted.split("").forEach((char, i) => { updated[i] = char; });
    setOtp(updated);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <div className="signIn_container">
      <div className="signIn_box">

        {/* ── STEP 1: Credentials ── */}
        {step === "credentials" && (
          <>
            <div className="signin-header">
              <div className="signin-icon">🔐</div>
              <h1>Sign In</h1>
              <p className="signin-subtitle">Welcome back! Please sign in to continue.</p>
            </div>

            <form className="sign-in_form" onSubmit={handleCredentialsSubmit}>
              <div className="form-group">
                <label>Email <span className="required">*</span></label>
                <input
                  id="username_input"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password <span className="required">*</span></label>
                <div className="password-input-wrapper">
                  <input
                    id="password_input"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={{ width: "100%" }}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {error && <div className="error-message">⚠️ {error}</div>}

              <button className="submit_btn" type="submit" disabled={loading}>
                {loading ? (
                  <span className="btn-loading"><span className="spinner"></span> Sending OTP...</span>
                ) : (
                  "Send OTP →"
                )}
              </button>

              <p className="signin-footer">
                Don't have an account? <a href="/sign-up">Sign Up</a>
              </p>
            </form>
          </>
        )}

        {/* ── STEP 2: OTP Verification ── */}
        {step === "otp" && (
          <>
            <div className="signin-header">
              <div className="signin-icon">📧</div>
              <h1>Verify OTP</h1>
              <p className="signin-subtitle">
                We sent a 6-digit OTP to<br />
                <strong>{formData.email}</strong>
              </p>
            </div>

            <form className="sign-in_form" onSubmit={handleOtpSubmit}>
              <div className="otp-boxes" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    className="otp-input"
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              {error && <div className="error-message">⚠️ {error}</div>}

              <button className="submit_btn" type="submit" disabled={loading}>
                {loading ? (
                  <span className="btn-loading"><span className="spinner"></span> Verifying...</span>
                ) : (
                  "✓ Verify & Login"
                )}
              </button>

              <div className="otp-actions">
                <button
                  type="button"
                  className="resend-btn"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || loading}
                >
                  {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Resend OTP"}
                </button>

                <button
                  type="button"
                  className="back-btn"
                  onClick={() => { setStep("credentials"); setError(""); setOtp(["", "", "", "", "", ""]); }}
                >
                  ← Change Email
                </button>
              </div>
            </form>
          </>
        )}

      </div>
    </div>
  );
}

export default SignIn;
