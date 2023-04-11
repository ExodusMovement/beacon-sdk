// @ts-ignore
import fetch from 'node-fetch'

import { keys } from '@exodus/airgap-beacon-utils'
import { MatrixRequest, MatrixRequestParams } from './models/api/MatrixRequest'

interface HttpOptions {
  accessToken?: string
}

const CLIENT_API_R0 = '/_matrix/client/r0'

/**
 * Handling the HTTP connection to the matrix synapse node
 */
export class MatrixHttpClient {

  constructor(private readonly baseUrl: string) {
  }

  /**
   * Get data from the synapse node
   *
   * @param endpoint
   * @param options
   */
  public async get<T>(
    endpoint: string,
    params?: MatrixRequestParams<T>,
    options?: HttpOptions
  ): Promise<T> {
    return this.send('GET', endpoint, options, params)
  }

  /**
   * Post data to the synapse node
   *
   * @param endpoint
   * @param body
   * @param options
   * @param params
   */
  public async post<T>(
    endpoint: string,
    body: MatrixRequest<T>,
    options?: HttpOptions,
    params?: MatrixRequestParams<T>
  ): Promise<T> {
    return this.send('POST', endpoint, options, params, body)
  }

  /**
   * Put data to the synapse node
   *
   * @param endpoint
   * @param body
   * @param options
   * @param params
   */
  public async put<T>(
    endpoint: string,
    body: MatrixRequest<T>,
    options?: HttpOptions,
    params?: MatrixRequestParams<T>
  ): Promise<T> {
    return this.send('PUT', endpoint, options, params, body)
  }

  public async cancelAllRequests(): Promise<void> {
    throw new Error("not implemented by exodus fork yet")
  }

  /**
   * Send a request to the synapse node
   *
   * @param method
   * @param endpoint
   * @param config
   * @param requestParams
   * @param data
   */
  private async send<T>(
    method: string,
    endpoint: string,
    config?: HttpOptions,
    requestParams?: MatrixRequestParams<T>,
    data?: MatrixRequest<T>
  ): Promise<T> {
    const headers = config ? this.getHeaders(config) : {}
    const params = requestParams ? this.getParams(requestParams) : {}

    const query = new URLSearchParams(params)
    const url = `${this.apiUrl(CLIENT_API_R0)}/${endpoint}?${query}`
    const options: any = {
      method,
      url,
      headers,
      body: undefined
    }
    if (data) {
      options.headers['Content-Type'] = 'application/json'
      options.body = JSON.stringify(data)
    }
    const response = await fetch(url, options)
    const json = await response.json()

    return json
  }

  /**
   * Get the headers based on the options object
   *
   * @param options
   */
  private getHeaders(options: HttpOptions): { [key: string]: any } | undefined {
    const headers: Record<string, any> = {}
    const entries: [string, any][] = []

    if (options.accessToken) {
      entries.push(['Authorization', `Bearer ${options.accessToken}`])
    }

    if (entries.length === 0) {
      return undefined
    }

    for (const [key, value] of entries) {
      headers[key] = value
    }

    return headers
  }

  /**
   * Get parameters
   *
   * @param _params
   */
  private getParams(
    _params: MatrixRequestParams<any>
  ): { [key: string]: string} {
    if (!_params) {
      return {}
    }

    const params = Object.assign(_params, {})
    keys(params).forEach((key) => params[key] === undefined && delete params[key])

    // hack to make the return value compatible with URLSearchParams typing
    return Object.fromEntries(Object.entries(params).map(([k,v]) => [k, `${v}`]))
  }

  /**
   * Construct API URL
   */
  private apiUrl(...parts: string[]): string {
    const apiBase = this.baseUrl.endsWith('/')
      ? this.baseUrl.substr(0, this.baseUrl.length - 1)
      : this.baseUrl

    const apiParts = parts.map((path) => (path.startsWith('/') ? path.substr(1) : path))

    return [apiBase, ...apiParts].join('/')
  }
}
