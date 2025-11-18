import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignIn.css";

function SignIn() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isloged, setIsloged] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // stop page refresh
    console.log(formData);

    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        formData,
        { withCredentials: true }
      );

      alert(response.data.message);

      if (response.status === 200) {
        setIsloged(true);
        
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userId", response.data.userId);

        navigate("/");
      }
    } catch (error) {
      console.error(error);
      alert("Invalid credentials");
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
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
            />
          </div>

          <button className="submit_btn" type="submit">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
