function  SignIn() {
  return (
    <div>
      <h1>Sign In Page</h1>
      <form className="sign-in_form">
        <label>
          Username:
          <input id="username_input" type="text" name="username" />
        </label>
        <br />
        <label>
          Password:
          <input id="password_input" type="password" name="password" />
        </label>
        <br />
        <button type="submit">Sign In</button>
      </form>
    </div>
  )
}

export default SignIn