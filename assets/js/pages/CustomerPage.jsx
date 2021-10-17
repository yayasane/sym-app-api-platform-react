import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Field from '../components/forms/Field'
import FormContentLoader from '../components/loaders/FormContentLoader'
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

  const [loading, setLoading] = useState(false)

  // Récupération du customer en fonction de l'idenfiant
  const fetchCustomer = async (id) => {
    try {
      const { firstName, lastName, email, company } = await customersAPI.find(
        id,
      )
      setCustomer({ firstName, lastName, email, company })
      setLoading(false)
    } catch (error) {
      // TODO: Notification flash d'une erreur
      toast.error("Le client n'a pas pu être chargé")
      history.replace('/customers')
    }
  }

  // Chargement du customer si besoin au chargement du composant ou au changement de l'identifiant
  useEffect(() => {
    if (id !== 'new') {
      setLoading(true)
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
      setErrors({})
      if (editing) {
        await customersAPI.update(id, customer)
        // TODO: Flash de notification
        toast.success('Le client a bien été modifié')
      } else {
        const response = await customersAPI.create(customer)
        // TODO : Flash notification de succés
        toast.success('Le client a bien été créé')
        history.replace('/customers')
      }
    } catch ({ response }) {
      const { violations } = error.response.data
      if (violations) {
        const apiErrors = {}
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message
        })
        setErrors(apiErrors)

        // TODO : Flash notification d'erreurs
        toast.error('Des erreurs dans votre formulaire !')
      }
    }
  }
  return (
    <>
      {(!editing && <h1>Création d'un client</h1>) || (
        <h1>Modification d'un client</h1>
      )}
      {loading && <FormContentLoader />}
      {!loading && (
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
          <div className="mb-3">
            <button type="submit" className="btn btn-success">
              Enregistrer
            </button>
            <Link to="/customers" className="btn btn-link">
              Retour à la liste
            </Link>
          </div>
        </form>
      )}
    </>
  )
}

export default CustomerPage
