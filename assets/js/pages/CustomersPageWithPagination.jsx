import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Pagination from '../components/Pagination'
const CustomersPageWithPagination = (props) => {
  const [customers, setCustomers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(true)
  const itemPerPage = 10

  const handleDelete = (id) => {
    const originalCustomers = [...customers]
    setCustomers((customers) =>
      customers.filter((customer) => customer.id !== id),
    )
    axios
      .delete('https://localhost:8000/api/customers/' + id)
      .then((response) => console.log(response))
      .catch((error) => {
        console.log(error.response)
        setCustomers(originalCustomers)
      })
    console.log(id)
    // axios.delete()
  }

  useEffect(() => {
    axios
      .get(
        `https://localhost:8000/api/customers?pagination=true&cana=${itemsPerPage}&page=${currentPage}`,
      )
      .then((response) => {
        setCustomers(response.data['hydra:member'])
        setTotalItems(response.data['hydra:totalItems'])
        setLoading(false)
      })
      .catch((error) => console.log(error.response))
  }, [currentPage])

  const handlePageChange = (page) => {
    //on vide la liste des customers en attendant les customers renvoyés par le serveur
    // setCustomers([])
    //
    //Change l'état current qui permet de déclencher le useEffect vu que le currentPage est la dépendance de celui ci
    setCurrentPage(page)
    //
    setLoading(true)
  }

  // console.log(pages)

  const itemsPerPage = 10

  //   const paginatedCustomers = Pagination.getData(
  //     customers,
  //     currentPage,
  //     itemsPerPage,
  //   )

  return (
    <>
      <h1>Liste des clients (pagination)</h1>
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
        <tbody>
          {loading && (
            <tr>
              <td>Chargement ...</td>
            </tr>
          )}
          {!loading &&
            customers.map((customer, key) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>
                  <a href="#">
                    {customer.firstName} {customer.lastName}
                  </a>
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
      </table>
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        length={totalItems}
        onPageChanged={handlePageChange}
      />
    </>
  )
}

export default CustomersPageWithPagination
