'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
const Navbar = () => {
  const pages = [
    {link: "/", title: "Home"},
  ]
  const [menuState, setMenuState] = useState(false)
  const [fixed, setFixed] = useState(0)
  
  const navbarButton = () => {setMenuState(!menuState)}
  
  useEffect(()=>{
    const setScrollY = () => {setFixed(window.scrollY)}
    window.addEventListener("scroll",setScrollY)
    return () => {window.removeEventListener("scroll",setScrollY)}
  },[])
  
  return(
  <div className="navBar" >
  
    <div className='logo'>
      <Link href="/"><Image
        src = "/public/images/backgrounds/backgroundLogin.jpg"
        width={50}
        height={50}
        alt='HospitalSystemLogo'
        className='logo'
      /></Link>
    </div>
    
    <button className='btn' onClick={navbarButton}>&#8801;</button>
    <div className='dropdown'>
      <div className="navLinks" style={menuState ? {display:"block"} : {display:"none"}} onClick={navbarButton}>
        {
          pages.map((page, i)=>(<li key={i}><Link href={page.link}>{page.title}</Link></li>))
        }        
      </div>
    </div>
  
  </div>
  )
}

export default Navbar