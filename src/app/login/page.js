'use client'
import { dbGet } from "../scripts/dbHelper"
import { useRouter } from "next/router"
const Login = () => {
  const router = useRouter()  
  const loginUser = async (e) => {
    e.preventDefault()
    const accountType = "patient"
    const scriptOutputBox = document.getElementById("scriptBox")
    scriptOutputBox.innerHTML = ""
    const email = document.getElementById("userEmail").value
    const password = document.getElementById("password").value
    // console.log("Email: ", email)
    // console.log("Password: ", password)
    // console.log("Account Type: ", accountType)

    if(email.length === 0 || password.length === 0) return scriptOutputBox.innerHTML = "Please Enter Your Email And Password"

    const query = `SELECT * FROM ${accountType} WHERE email_address = "${email}"`
    const { rows:userData } = await dbGet(query)

    if(userData.length === 0) {
      // console.error("No User With This Email")
      return scriptOutputBox.innerHTML = "No Account Found"
    }

    const isValid = password === userData[0].password

    // console.log(userData)
    // console.log("Is Valid Password: ", isValid)
    if(!isValid) return scriptOutputBox.innerHTML = "Invalid Password Please Try Again"

    router.push('/dashboard')
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
        
        <div id="scriptBox" className="errorMessage hidden"></div>

        <button id="submitLoginDetails" className="btn" onClick={loginUser}>Login</button>
      </form>
    </div>
  </div>
  )
}

export default Login