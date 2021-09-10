import React, { useContext, useState } from 'react'
import AuthContext from '../contexts/AuthContext'
import authAPI from '../services/authAPI'

const LoginPage = ({ history }) => {
  const { setIsAuthenticated } = useContext(AuthContext)
  const [credentials, setCredentials] = useState({ username: '', password: '' })

  const [error, setError] = useState('')

  //Gestion des champs
  const handleChange = ({ currentTarget }) => {
    const { value, name } = currentTarget

    setCredentials((s) => ({ ...s, [name]: value }))
  }

  //Gestion du submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await authAPI.authenticate(credentials)
      setError('')
      setIsAuthenticated(true)
      history.replace('/customers')
    } catch (error) {
      console.log(error.response)
      setError(
        'Aucun compte ne posséde cette adresse ou alors les informations ne correspondent pas',
      )
    }
    console.log(credentials)
  }
  return (
    <>
      <form action="" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Adresse email</label>
          <input
            value={credentials.username}
            onChange={handleChange}
            type="email"
            placeholder="Adresse email"
            name="username"
            id="username"
            className={'form-control ' + (error && 'is-invalid')}
          />
          {error && <p className="invalid-feedback">{error}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="">Mot de passe</label>
          <input
            value={credentials.password}
            onChange={handleChange}
            type="password"
            placeholder="Mot de passe"
            name="password"
            id="password"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Je me connecte
          </button>
        </div>
      </form>
    </>
  )
}

export default LoginPage
