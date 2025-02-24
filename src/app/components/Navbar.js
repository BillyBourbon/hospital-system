'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
const Navbar = () => {
  const pages = [
    {link: "/", title: "Home"},
  ]
  const [menuState, setMenuState] = useState(false)
  
  const navbarButton = () => {setMenuState(!menuState)}
  
  return(
  <div className="navBar" >
    <div className='logo'>
      <Link href="/"><Image
        src = "/images/logos/downloadIcon.png"
        width={50}
        height={50}
        alt='HospitalSystemLogo'
        className='logo'
      /></Link>
    </div>
    <div className={`dropdown ${menuState?"active":""}`}>
      <div className="navLinks" onClick={navbarButton}>
        {
          pages.map((page, i)=>(<button className='btn' key={i}><Link href={page.link}>{page.title}</Link></button>))
        }        
      </div>
    </div>
    <button className='btn burgerMenu' onClick={navbarButton}>&#8801;</button>
  
  </div>
  )
}

export default Navbar