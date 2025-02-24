const Home = () => {
  return(
  <div className="home">
    <h1>Welcome To Hospital System</h1>
    <div className="loginUserInputsContainer">
      <form action="" method="POST">
        <h1>Login</h1>

        <div className="inputBox">
          <input type="text" id="username" name="username" placeholder="Username" required/>
          <i></i>
        </div>
        
        <div className="inputBox">
          <input type="password" id="password" name="password" placeholder="Password" required/>
          <i></i>
        </div>
        
        <div className="forgottenLloginDetails">
          <a href="#">Forgot Username?</a>
          <a href="#">Forgot Password?</a>
        </div>
        
        <div className="errorMessage hidden">
          <p>ERROR</p>
        </div>

        <button id="submitLoginDetails" className="btn" type="submit">Login</button>
      </form>
    </div>
  </div>
  )
}

export default Home