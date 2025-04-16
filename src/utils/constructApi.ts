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
  }: APICallPayload<Request, Response>) => {
    return async (requestData: Request) => {
      try {
        // Validate request data
        requestSchema.parse(requestData)

        // Prepare API call
        let data: Request | null = null
        let params: Request | null = null

        if (requestData) {
          if (['get', 'delete'].includes(method.toLowerCase()) || useParams) {
            params = requestData
          } else {
            data = requestData
          }
        }

        const config: AxiosRequestConfig = {
          method,
          url: path,
          data,
          params,
          ...axiosConfig,
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
