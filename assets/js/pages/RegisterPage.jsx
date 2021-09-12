import axios from 'axios'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Field from '../components/forms/Field'
import usersAPI from '../services/usersAPI'
const RegisterPage = ({ history }) => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
  })

  const [errors, setErrors] = useState({
    fisrtName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
  })

  // Gestion des changements des inputs du formulaire
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget
    setUser((u) => ({ ...u, [name]: value }))
  }

  //Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault()
    const apiErrors = {}
    if (user.password !== user.passwordConfirm) {
      apiErrors.passwordConfirm =
        "Votre confirmation de mot de passe n'est pas conforme avec le mot de passe original"
      setErrors(apiErrors)
      toast.error('Des erreurs dans votre formulaire !')
      return
    }

    try {
      const response = await usersAPI.register(user)
      //   setErrors({})
      // TODO: Flash success
      toast.success(
        'Vous êtes désormais inscrites, vous pouvez vous connecté !',
      )
      history.replace('/login')
    } catch (error) {
      console.log(error.response)
      const { violations } = error.response.data
      if (violations) {
        const apiErrors = {}
        violations.forEach(
          ({ propertyPath, message }) => (apiErrors[propertyPath] = message),
        )
        const { firstName, lastName, email, password } = apiErrors
        setErrors({ firstName, lastName, email, password })
      }
      // TODO: Flash error
      toast.error('Des erreurs dans votre formulaire !')
    }
  }

  return (
    <>
      <h1>Inscription</h1>
      <form action="" onSubmit={handleSubmit}>
        <Field
          name="firstName"
          label="Prénom"
          placeholder="Votre joli prénom"
          value={user.fisrtName}
          error={errors.firstName}
          onChange={handleChange}
        />
        <Field
          name="lastName"
          label="Nom de famille"
          placeholder="Votre nom de famille"
          value={user.lastName}
          error={errors.lastName}
          onChange={handleChange}
        />
        <Field
          name="email"
          label="Adresse email"
          placeholder="Votre adresse email"
          type="email"
          value={user.email}
          error={errors.email}
          onChange={handleChange}
        />
        <Field
          name="password"
          label="Mot de passe"
          type="password"
          placeholder="Votre mot de passe ultra sécurisé"
          value={user.password}
          error={errors.password}
          onChange={handleChange}
        />
        <Field
          name="passwordConfirm"
          label="Confirmation de mot de passe"
          type="password"
          placeholder="Confirmez votre mot de passe"
          value={user.passwordConfirm}
          error={errors.passwordConfirm}
          onChange={handleChange}
        />

        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Confirmation
          </button>
          <Link to="/login" className="btn btn-link">
            j'ai déja un compte
          </Link>
        </div>
      </form>
    </>
  )
}

export default RegisterPage
