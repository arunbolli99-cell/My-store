
import "./SignIn.css";

function  SignIn() {
  return (
    <div className="signIn_container">
      <div className="signIn_box">
      <h1>Sign In Page</h1>
      <form className="sign-in_form">
        <div id="username_div" className="form-group">
        <label>
          Username <span className="required">*</span>
        </label>
        <input id="username_input" type="text" name="username" />
        </div>
        
         <div id="password_div" className="form-group">
        <label>
          Password <span className="required">*</span> 
        </label>
        <input id="password_input" type="password" name="password" />
        </div>
        <button className="submit_btn" type="submit">Sign In</button>
      </form>
      </div>
    </div>
  )
}

export default SignIn