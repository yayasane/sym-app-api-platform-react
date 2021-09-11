import axios from 'axios'

function findAll() {
  return axios
    .get('https://localhost:8000/api/invoices')
    .then((response) => response.data['hydra:member'])
}

function find(id) {
  return axios
    .get('https://localhost:8000/api/invoices/' + id)
    .then((response) => response.data)
}
function create(invoice) {
  return axios.post('https://localhost:8000/api/invoices', {
    ...invoice,
    customer: `/api/customers/${invoice.customer}`,
  })
}

function update(id, invoice) {
  return axios.put('https://localhost:8000/api/invoices/' + id, {
    ...invoice,
    customer: `/api/customers/${invoice.customer}`,
  })
}

function deleteInvoice(id) {
  return axios.delete('https://localhost:8000/api/invoices/' + id)
}

export default {
  findAll,
  find,
  create,
  update,
  delete: deleteInvoice,
}
