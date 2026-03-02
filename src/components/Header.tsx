import { NavLink } from "react-router-dom"
import NavLogo from '../assets/img/no-bg-main-logo.png'

const Header = () => {
  return (
    <header className="bg-blue-500">
      <nav className="flex items-center justify-between container mx-auto">
        <div>
          <NavLink to='/'>
            <img className="w-37.5" src={NavLogo} />
          </NavLink>
        </div>
        <div>
          <ul className="flex gap-5 text-xl text-white">
            <li className="hover:underline"><NavLink to='/dashboard'>Dashboard</NavLink></li>
            <li className="hover:underline"><NavLink to='/calendar'>Calendar</NavLink></li>
            <li className="hover:underline"><NavLink to='/trades'>Trades</NavLink></li>
            <li className="hover:underline"><NavLink to='/settings'>Settings</NavLink></li>
          </ul>
        </div>
      </nav>
    </header>
  )
}

export default Header