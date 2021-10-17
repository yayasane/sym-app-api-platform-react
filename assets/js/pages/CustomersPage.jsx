import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import TableLoader from '../components/loaders/TableLoader'
import Pagination from '../components/Pagination'
import CustomersAPI from '../services/customersAPI'
const CustomersPage = (props) => {
  const [customers, setCustomers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  //permet d'aller récupérer les customers
  const fetchCustomers = async () => {
    try {
      const data = await CustomersAPI.findAll()
      setCustomers(data)
      setLoading(false)
    } catch (error) {
      toast.error('Impossible de charger es clients')
    }
  }

  // Au chargement du composant on va aller cherher les customers
  useEffect(() => {
    fetchCustomers()
  }, [])

  //Gestion de la suppression d'un customer
  const handleDelete = async (id) => {
    const originalCustomers = [...customers]
    setCustomers((customers) =>
      customers.filter((customer) => customer.id !== id),
    )
    try {
      await CustomersAPI.delete(id)
      toast.success('Le client a été bien supprimé')
    } catch (e) {
      setCustomers(originalCustomers)
      toast.error("la suppresion du client n'a pas pu fonctionner")
    }
  }

  //Gestion du changement de page
  const handlePageChange = (page) => setCurrentPage(page)

  //Gestion de la recherche
  const handleSearch = ({ currentTarget }) => setSearch(currentTarget.value)

  // console.log(pages)

  const itemsPerPage = 10

  // Filtrage des customers en fonction de la recherche
  const filteredCustomers = customers.filter((customer) => {
    return (
      customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(search.toLowerCase())
    )
  })

  //Pagination des données
  const paginatedCustomers = Pagination.getData(
    filteredCustomers,
    currentPage,
    itemsPerPage,
  )

  return (
    <>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h1>Liste des clients</h1>
        <Link to="/customers/new" className="btn btn-primary">
          Créer un client
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
              <th>ID</th>
              <th>Client</th>
              <th>Email</th>
              <th>Entreprise</th>
              <th className="text-center">Factures</th>
              <th className="text-center">Montant Total</th>
              <th></th>
            </tr>
          </thead>
          {!loading && (
            <tbody>
              {paginatedCustomers.map((customer, key) => (
                <tr key={customer.id}>
                  <td>{customer.id}</td>
                  <td>
                    <Link to={'/customers/' + customer.id}>
                      {customer.firstName} {customer.lastName}
                    </Link>
                  </td>
                  <td>{customer.email}</td>
                  <td>{customer.company}</td>
                  <td className="text-center">
                    <span className="badge bg-primary">
                      {customer.invoices.length}
                    </span>
                  </td>
                  <td className="text-center">
                    {customer.totalAmount.toLocaleString()} €
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        handleDelete(customer.id)
                      }}
                      disabled={customer.invoices.length > 0 ? true : false}
                      className="btn btn-sm btn-danger"
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
      {filteredCustomers.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={filteredCustomers.length}
          onPageChanged={handlePageChange}
        />
      )}
    </>
  )
}

export default CustomersPage
