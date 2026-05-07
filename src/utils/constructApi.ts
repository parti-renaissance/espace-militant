import { ErrorThrower } from '@/services/common/errors/types'
import { parseError } from '@/services/common/errors/utils'
import { AxiosInstance, AxiosRequestConfig, Method } from 'axios'
import { z } from 'zod'
import { ErrorMonitor } from './ErrorMonitor'

interface APICallPayload<Request, Response> {
  method: Method
  path: string
  useParams?: boolean
  requestSchema: z.ZodType<Request>
  responseSchema: z.ZodType<Response>
  errorThrowers?: ErrorThrower[]
  axiosConfig?: AxiosRequestConfig
  type?: 'private' | 'public'
  /** OAuth2 et APIs “classiques” : corps en application/x-www-form-urlencoded au lieu de JSON */
  formUrlEncoded?: boolean
}

export interface Instances {
  authInstance: AxiosInstance
  publicInstance: AxiosInstance
}

export const createApi =
  ({ authInstance, publicInstance }: Instances) =>
  <Request, Response>({
    type = 'private',
    method,
    path,
    requestSchema,
    responseSchema,
    useParams,
    errorThrowers,
    axiosConfig,
    formUrlEncoded,
  }: APICallPayload<Request, Response>) => {
    return async (requestData: Request) => {
      try {
        // Validate request data
        requestSchema.parse(requestData)

        // Prepare API call
        let data: Request | URLSearchParams | null = null
        let params: Request | null = null

        if (requestData) {
          if (['get', 'delete'].includes(method.toLowerCase()) || useParams) {
            params = requestData
          } else {
            data = requestData
            if (formUrlEncoded && data !== null && typeof data === 'object' && !(data instanceof URLSearchParams)) {
              const record = data as Record<string, string>
              data = new URLSearchParams(record)
            }
          }
        }

        const config: AxiosRequestConfig = {
          method,
          url: path,
          data,
          params,
          ...axiosConfig,
        }

        if (formUrlEncoded) {
          config.headers = {
            ...(typeof config.headers === 'object' && config.headers !== null && !Array.isArray(config.headers)
              ? { ...config.headers }
              : {}),
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }

        // Make API call base on the type of request
        const response = type === 'private' ? await authInstance(config) : await publicInstance(config)

        // Parse and validate response data
        const result = responseSchema.safeParse(response.data)

        if (!result.success) {
          ErrorMonitor.log(`🚨 Safe-Parsing Failed : `, {
            api: { path, method, data, params },
            zod: result.error.message,
          })
          return response.data as Response
        }
        return result.data
      } catch (error) {
        return parseError(error, errorThrowers)
      }
    }
  }
