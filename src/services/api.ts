import axios from 'axios'

export const api = axios.create({
  baseURL:'http://localhost:3333'
})

//O axios faz requisições http. Alem de criar uma base url para todas as paginas