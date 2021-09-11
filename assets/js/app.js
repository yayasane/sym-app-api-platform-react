import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route, Switch, withRouter } from 'react-router-dom'
// start the Stimulus application
import '../bootstrap'
/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */
// any CSS you import will output into a single css file (app.css in this case)
import '../styles/app.css'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoutes'
import AuthContext from './contexts/AuthContext'
import CustomerPage from './pages/CustomerPage'
import CustomersPage from './pages/CustomersPage'
import HomePage from './pages/HomePage'
import InvoicePage from './pages/InvoicePage'
import InvoicesPage from './pages/InvoicesPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import authAPI from './services/authAPI'

authAPI.setup()

const App = () => {
  // TODO : il faudrait par défaut qu'on demande à notre AuthAPI si on est connecté ou pas
  const [isAuthenticated, setIsAuthenticated] = useState(
    authAPI.isAuthenticated(),
  )

  const NavBarWithRouter = withRouter(Navbar)

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      <HashRouter>
        <NavBarWithRouter />
        <main className="container pt-5">
          <Switch>
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
            <PrivateRoute path="/invoices/:id" component={InvoicePage} />
            <PrivateRoute path="/invoices" component={InvoicesPage} />
            <PrivateRoute path="/customers/:id" component={CustomerPage} />
            <PrivateRoute path="/customers" component={CustomersPage} />
            <Route path="/" component={HomePage} />
          </Switch>
        </main>
      </HashRouter>
    </AuthContext.Provider>
  )
}

const rootElement = document.querySelector('#app')
ReactDOM.render(<App />, rootElement)
