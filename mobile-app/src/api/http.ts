import axios from 'axios'

// 开发时改成你电脑的局域网 IP，例如 http://192.168.1.28:3000
const BASE_URL = 'http://192.168.1.28:3000'

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

export default http
