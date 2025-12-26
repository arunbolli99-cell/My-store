import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UseAuth } from "./AuthContext";
import apiService from "./apiService";
import "./SignIn.css";

function SignIn() {
  const navigate = useNavigate();
  const { signin } = UseAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!formData.password.trim()) {
      setError("Please enter your password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await apiService.login(formData.email, formData.password);
      
      signin({
        token: response.token,
        userId: response.userId,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email
      });

      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signIn_container">
      <div className="signIn_box">
        <h1>Sign In Page</h1>

        <form className="sign-in_form" onSubmit={handleLogin}>
          <div id="username_div" className="form-group">
            <label>
              Email <span className="required">*</span>
            </label>
            <input
              id="username_input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>
              Password <span className="required">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button className="submit_btn" type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
