import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import TableLoader from '../components/loaders/TableLoader'
import Pagination from '../components/Pagination'
import InvoicesAPI from '../services/invoicesAPI'
const STATUS_CLASSES = {
  PAID: 'success',
  SENT: 'primary',
  CANCELED: 'danger',
}

const STATUS_LABELS = {
  PAID: 'Payée',
  SENT: 'Envoyée',
  CANCELED: 'Annulée',
}
const InvoicesPage = (props) => {
  const [invoices, setInvoices] = useState([])

  const [currentPage, setCurrentPage] = useState(1)

  const [search, setSearch] = useState('')

  const [loading, setLoading] = useState(true)

  const itemsPerPage = 10

  //Récupération de invoces au près de l'API
  const fetchInvoices = async () => {
    try {
      const data = await InvoicesAPI.findAll()
      setInvoices(data)
      setLoading(false)
    } catch (e) {
      toast.error('Erreur lors du chargement des factures !')
    }
  }

  //Charger les invoices au chargement du composant
  useEffect(() => {
    fetchInvoices()
  }, [])

  //Gestion du changement de page
  const handlePageChange = (page) => setCurrentPage(page)

  //Gestion de la recherche
  const handleSearch = ({ currentTarget }) => setSearch(currentTarget.value)

  //Gestion de la suppression
  const handleDelete = async (id) => {
    const originalInvoices = [...invoices]

    setInvoices(invoices.filter((i) => i.id !== id))

    try {
      await InvoicesAPI.delete(id)
      toast.success('La facture a été bien supprimée')
    } catch (error) {
      setInvoices(originalInvoices)
      toast.error('Une erreur est survenue')
    }
  }

  //Gestion du format de la date
  const formatDate = (str) => moment(str).format('DD/MM/YYYY')

  const filteredInvoices = invoices.filter(
    (i) =>
      i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      i.amount.toString().startsWith(search.toLowerCase()) ||
      STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase()),
  )

  //Pagination des données
  const paginatedInvoices = Pagination.getData(
    filteredInvoices,
    currentPage,
    itemsPerPage,
  )

  return (
    <>
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <h1>Liste des factures</h1>
        <Link to="/invoices/new">
          <button type="submit" className="btn btn-primary">
            Créer une facture
          </button>
        </Link>
      </div>
      <div className="form-group">
        <input
          type="text"
          onChange={handleSearch}
          value={search}
          className="form-control"
          placeholder="Rechercher ..."
        />
      </div>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Numéro</th>
              <th>Client</th>
              <th className="text-center">Montant</th>
              <th className="text-center">Statut</th>
              <th className="text-center">Montant</th>
              <th></th>
            </tr>
          </thead>
          {!loading && (
            <tbody>
              {paginatedInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.chrono}</td>
                  <td>
                    <Link
                      to={'/invoices/' + invoice.id}
                    >{`${invoice.customer.firstName} ${invoice.customer.lastName}`}</Link>
                  </td>
                  <td className="text-center">{formatDate(invoice.sentAt)}</td>
                  <td className="text-center">
                    <span
                      className={'badge bg-' + STATUS_CLASSES[invoice.status]}
                    >
                      {STATUS_LABELS[invoice.status]}
                    </span>
                  </td>
                  <td className="text-center">
                    {invoice.amount.toLocaleString()} €
                  </td>
                  <td>
                    <Link
                      to={'/invoices/' + invoice.id}
                      className="btn btn-sm btn-primary me-1"
                    >
                      Editer
                    </Link>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(invoice.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      {loading && <TableLoader />}
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChanged={handlePageChange}
        length={filteredInvoices.length}
      />
    </>
  )
}

export default InvoicesPage
