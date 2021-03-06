import axios from 'axios'
import { CUSTOMERS_API } from '../config'
import Cache from './cache'

async function findAll() {
  const cachedCustomers = await Cache.get('customers')
  console.log('Get the cached data ')
  console.log(cachedCustomers)
  if (cachedCustomers !== null) return cachedCustomers
  console.log('Get the api data ')

  return axios.get(CUSTOMERS_API).then((response) => {
    const customers = response.data['hydra:member']
    Cache.set('customers', customers)
    return customers
  })
}

async function find(id) {
  const cachedCustomer = await Cache.get('customers.' + id)
  if (cachedCustomer) return cachedCustomer
  return axios.get(CUSTOMERS_API + '/' + id).then((response) => {
    const customer = response.data

    Cache.set('customers.' + id, customer)
    return customer
  })
}

function create(customer) {
  return axios.post(CUSTOMERS_API, customer).then(async (response) => {
    const cachedCustomers = await Cache.get('customers')
    if (cachedCustomers) {
      Cache.set('customers', [...cachedCustomers, response.data])
    }
    return response
  })
}

function update(id, customer) {
  return axios
    .put(CUSTOMERS_API + '/' + id, customer)
    .then(async (response) => {
      const cachedCustomers = await Cache.get('customers')
      const cachedCustomer = await Cache.get('customers.' + id)
      if (cachedCustomer) {
        Cache.set('customers.' + id, response.data)
      }
      if (cachedCustomers) {
        const index = cachedCustomers.findIndex((c) => c.id === +id)
        cachedCustomers[index] = response.data
      }
      return response
    })
}

async function deleteCustomers(id) {
  return axios.delete(CUSTOMERS_API + '/' + id).then(async (response) => {
    const cachedCustomers = await Cache.get('customers')
    if (cachedCustomers) {
      Cache.set(
        'customers',
        cachedCustomers.filter((c) => c.id !== id),
      )
      return response
    }
  })
}

export default {
  findAll,
  find,
  update,
  create,
  delete: deleteCustomers,
}
