import axios from 'axios' // 別接続用

class EobaseClient {
  baseUrl = ''
  constructor() {
    this.baseUrl = process.env.eoBaseUrl
  }

  async post(url, data) {
    const res = await axios.post(this.baseUrl + url, data)
    return res
  }
}

export default EobaseClient
