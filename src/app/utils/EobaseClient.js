import axios from 'axios' // 別接続用

class EobaseClient {
  baseUrl = ''
  loginToken = ''
  constructor(loginToken = null) {
    this.baseUrl = process.env.eoBaseUrl
    this.loginToken = loginToken
  }

  async get(url) {
    let res
    if (this.loginToken) {
      res = await axios.get(this.baseUrl + url, { headers: { 'X-EONEXT-LOGIN-TOKEN': this.loginToken } })
    } else {
      res = await axios.get(this.baseUrl + url)
    }
    return res
  }

  async post(url, data) {
    const res = await axios.post(this.baseUrl + url, data)
    return res
  }
}

export default EobaseClient
