import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Field from '../components/Field'
import customersAPI from '../services/customersAPI'

const CustomerPage = ({ match, history }) => {
  const { id = 'new' } = match.params

  const [customer, setCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
  })

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
  })

  const [editing, setEditing] = useState(false)

  // Récupération du customer en fonction de l'idenfiant
  const fetchCustomer = async (id) => {
    try {
      const { firstName, lastName, email, company } = await customersAPI.find(
        id,
      )
      setCustomer({ firstName, lastName, email, company })
    } catch (error) {
      // TODO: Notification flash d'une erreur
      history.replace('/customers')
    }
  }

  // Chargement du customer si besoin au chargement du composant ou au changement de l'identifiant
  useEffect(() => {
    if (id !== 'new') {
      setEditing(true)
      fetchCustomer(id)
    }
  }, [id])

  // Geston des changements des inputs dans le formulaire
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget
    setCustomer((c) => ({ ...c, [name]: value }))
  }

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await customersAPI.update(id, customer)
        // TODO: Flash de notification
      } else {
        const response = await customersAPI.create(customer)
        // TODO : Flash notification de succés
        history.replace('/customers')
      }
      setErrors({})
    } catch ({ response }) {
      const { violations } = error.response.data
      if (violations) {
        const apiErrors = {}
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message
        })
        setErrors(apiErrors)

        // TODO : Flash notification d'erreurs
      }
    }
  }
  return (
    <>
      {(!editing && <h1>Création d'un client</h1>) || (
        <h1>Modification d'un client</h1>
      )}
      <form onSubmit={handleSubmit}>
        <Field
          name="lastName"
          label="Nom de famille"
          placeholder="Nom de famille du client"
          value={customer.lastName}
          onChange={handleChange}
          error={errors.lastName}
        />
        <Field
          name="firstName"
          label="Prénom"
          placeholder="Prénom du client"
          value={customer.firstName}
          onChange={handleChange}
          error={errors.firstName}
        />
        <Field
          name="email"
          label="Email"
          type="email"
          placeholder="Adresse email du client"
          value={customer.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Field
          name="company"
          label="Entreprise"
          placeholder="Entreprise du client"
          value={customer.company}
          onChange={handleChange}
          error={errors.company}
        />
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Enregistrer
          </button>
          <Link to="/customers" className="btn btn-link">
            Retour à la liste
          </Link>
        </div>
      </form>
    </>
  )
}

export default CustomerPage
