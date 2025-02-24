'use client'
const Login = () => {
  const loginUser = (e) => {
    e.preventDefault()
    const userEmail = document.getElementById("userEmail").value
    const password = document.getElementById("password").value
    console.log(userEmail , password)
    const isValid = verifyCredentials(userEmail, password)
    if(isValid){
      console.log("VALID CREDS")
    } else console.error("BAD CREDS")
  }
  
  const verifyCredentials = (userEmail, password) => {
    if(userEmail === "Billy" && password === "Billy") return true
    else return false
  }

  return(
  <div className="login">
    <h1>Welcome To Hospital System</h1>
    <div className="loginUserInputsContainer">
      <form>
        <h1>Login</h1>

        <div className="form-group">
          <input type="text" id="userEmail" name="userEmail" placeholder="Email Address" required/>
        </div>
        
        <div className="form-group">
          <input type="password" id="password" name="password" placeholder="Password" required/>
        </div>
        
        <div className="forgottenLloginDetails">
          <a href="#">Forgot Password?</a>
        </div>
        
        <div className="errorMessage hidden">
          <p>ERROR</p>
        </div>

        <button id="submitLoginDetails" className="btn" onClick={loginUser}>Login</button>
      </form>
    </div>
  </div>
  )
}

export default Login