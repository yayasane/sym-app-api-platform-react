import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import AuthContext from '../contexts/AuthContext'
import authAPI from '../services/authAPI'

const Navbar = ({ history }) => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext)

  const handleLogout = () => {
    authAPI.logout()
    setIsAuthenticated(false)
    history.push('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          SymReact
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarColor03"
          aria-controls="navbarColor03"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarColor03">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/customers">
                Clients
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/invoices">
                Factures
              </NavLink>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto">
            {(!isAuthenticated && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">
                    Inscription
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="btn btn-success" to="/login">
                    Connexion
                  </NavLink>
                </li>
              </>
            )) || (
              <li className="nav-item">
                <button
                  onClick={handleLogout}
                  href="#"
                  className="btn btn-danger"
                >
                  Deconnexion
                </button>
              </li>
            )}
          </ul>
          {/* <ul className="navbar-nav ">
            <li className="nav-item">
              <NavLink className="nav-link" to="/register">
                Inscription
              </NavLink>
            </li>
            <li className="nav-item">
              <Navlink to="/login" className="btn btn-success">
                Connexion !
              </Navlink>
            </li>
            <li className="nav-item">
              <button
                onClick={handleLogout}
                href="#"
                className="btn btn-danger"
              >
                Deconnexion
              </button>
            </li>
          </ul> */}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
