import React, { useContext, useState } from 'react'
import AuthContext from '../contexts/AuthContext'
import authAPI from '../services/authAPI'
import Field from '../components/Field'

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
        <Field
          label="Adresse email"
          name="username"
          value={credentials.username}
          onChange={handleChange}
          placeholder="Adresse email de connexion"
          error={error}
        />
        <Field
          label="Mot de passe"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          placeholder="Mot de passe"
          error={error}
        />
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
