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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      alert(response.message || "Signed in successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message || "Invalid credentials");
      alert(err.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signIn_container">
      <div className="signIn_box">
        <h1>Sign In Page</h1>

        <form className="sign-in_form" onSubmit={handleSubmit}>
          <div id="username_div" className="form-group">
            <label>
              Email <span className="required">*</span>
            </label>
            <input
              id="username_input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div id="password_div" className="form-group">
            <label>
              Password <span className="required">*</span>
            </label>
            <input
              id="password_input"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button className="submit_btn" type="submit" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
