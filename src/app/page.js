const Home = () => {
  return(
  <div>
    <h1 className="title">Welcome To Hospital System</h1>
    <div className="loginMenu">
      <button id="btnNavToLogin" className="btn" type="submit"><a href="/login">Login As Patient</a></button>
      <button id="btnNavToLogin" className="btn" type="submit"><a href="/login">Login As Staff</a></button>
    </div>
  </div>
  )
}

export default Home