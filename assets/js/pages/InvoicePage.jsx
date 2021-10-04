import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Field from '../components/forms/Field'
import FormContentLoader from '../components/loaders/FormContentLoader'
import Select from '../components/forms/Select'
import customerAPI from '../services/customersAPI'
import invoicesAPI from '../services/invoicesAPI'
const InvoicePage = ({ history, match }) => {
  const { id = 'new' } = match.params
  const [invoice, setInvoice] = useState({
    amount: '',
    customer: '',
    status: 'SENT',
  })

  const [customers, setCustomers] = useState([])

  const [editing, setEditing] = useState(false)

  const [errors, setErrors] = useState({
    amount: '',
    customer: '',
    status: '',
  })

  const [loading, setLoading] = useState(true)

  // Gestion des inputs dans le formulaire
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget
    setInvoice((i) => ({ ...i, [name]: value }))
  }

  // Récupération des clients
  const fetchCustomers = async () => {
    try {
      const data = await customerAPI.findAll()

      setCustomers(data)
      setLoading(false)
      if (id == 'new') {
        if (!invoice.customer)
          setInvoice((i) => ({ ...i, customer: data[0].id }))
      }
    } catch (error) {
      // TODO: Flash notification error
      toast.error('Impossible de charger les clients')
      history.replace('/invoices')
    }
  }

  //Récupération d'une facture
  const fetchInvoice = async (id) => {
    try {
      const { amount, customer, status } = await invoicesAPI.find(id)
      setInvoice({ amount, customer: customer.id, status })
      setLoading(false)
    } catch (error) {
      // TODO: Flash notification error
      toast.error('Impossible de charger la facture demandée')
      history.replace('/invoices')
    }
  }

  // Récupération de la liste des clients à chaque chargement du composant
  useEffect(() => {
    fetchCustomers()
  }, [])

  // Récupération de la bonne facture quand l'idenfiant de l'URL change
  useEffect(() => {
    if (id !== 'new') {
      setEditing(true)
      fetchInvoice(id)
    }
  }, [id])

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await invoicesAPI.update(id, invoice)
        // TODO: Flash notification success
        toast.success('La facture a bien été modifiée')
      } else {
        await invoicesAPI.create(invoice)
        // TODO: Flash notification success
        toast.success('La facture a bien été enregistrée')
        history.replace('/invoices')
      }
    } catch ({ response }) {
      const { violations } = response.data
      const apiErrors = {}
      if (violations) {
        violations.forEach(
          ({ propertyPath, message }) => (apiErrors[propertyPath] = message),
        )
      }
      setErrors(apiErrors)
      // TODO: Flash Notification d'erreurs
      toast.error('Des erreurs dans votre formulaire')
    }
    console.log(invoice)
  }

  return (
    <>
      {(!editing && <h1>Création d'une facture</h1>) || (
        <h1>Modification d'une facture</h1>
      )}
      {loading && <FormContentLoader />}
      {!loading && (
        <form action="" onSubmit={handleSubmit}>
          <Field
            name="amount"
            placeholder="Montant de la facture"
            label="Montant"
            onChange={handleChange}
            type="number"
            value={invoice.amount}
            error={errors.amount}
          />
          <Select
            name="customer"
            label="Client"
            onChange={handleChange}
            value={invoice.customer}
            error={errors.customer}
          >
            {customers.map((customer) => (
              <option
                key={customer.id}
                value={customer.id}
              >{`${customer.firstName} ${customer.lastName}`}</option>
            ))}
          </Select>
          <Select
            name="status"
            label="Status"
            onChange={handleChange}
            value={invoice.status}
            error={errors.status}
          >
            <option value="SENT">Envoyée</option>
            <option value="PAID">Payée</option>
            <option value="CANCELED">Annulée</option>
          </Select>
          <div className="form-group">
            <button className="btn btn-success">Enregistrer</button>
            <Link to="/invoices" className="btn btn-link">
              Retour aux factures
            </Link>
          </div>
        </form>
      )}
    </>
  )
}

export default InvoicePage
