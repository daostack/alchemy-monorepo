const FormData = require('form-data')
const fetch = require('isomorphic-fetch')

export class IPFSClient {

  public baseUrl: string

  constructor(ipfsUrl: string) {
    this.baseUrl = ipfsUrl
  }

  get ipfsUrl() {
    return this.baseUrl
  }

  public async cat(hash: string) {
    const params = new FormData()
    params.append('arg', Buffer.from(hash))
    const response = await fetch(`${this.baseUrl}/cat`, {
        body: params,
        method: 'POST'
    })
    if (response.status !== 200) {
        const msg = await response.text()
        throw Error(`An error occurred getting the file ${hash}: ${msg}`)
    }
    const result = await response.json()
    return result

  }
  public async addString(data: string) {
    const params = new FormData()
    const buffer = Buffer.from(data)
    params.append('file', buffer)
    const res = await fetch(`${this.baseUrl}/add`, {
        body: params,
        method: 'POST'
    })
    if (res.status !== 200) {
        const msg = await res.text()
        throw Error(`An error occurred adding these data to ipfs: ${msg}`)
    }
    const json = await res.json()
    return json.Hash
  }

  public async pinHash(hash: string) {
    if (!hash) {
        throw Error(`You must provide an ipfs Hash - you provided ${hash} instead`)
    }
    const params = new FormData()
    params.append('arg', Buffer.from(hash))
    const response = await fetch(`${this.baseUrl}/pin/add`, {
        body: params,
        method: 'POST'
    })
    if (response.status !== 200) {
        const msg = await response.text()
        throw Error(`An error occurred pinning the file ${hash}: ${msg}`)
    }
  }

  public async addAndPinString(data: string) {
    const hash = await this.addString(data)
    await this.pinHash(hash)
    return hash
  }
}
