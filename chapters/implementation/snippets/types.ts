type OperatorType = string

export interface ValidationRule {
  retryStrategy?: RetryStrategy | null
  requestUrlParameter?: GenericObject
  requestHeader?: GenericObject
  skip: boolean
  requestBody?: GenericObject
  condition: Condition | BooleanCondition
  method: "GET" | "PUT" | "POST" // TODO: validate possible HTTP method
  failScore: number
  endpoint: string
  priority: number
  name: string
}

export type GenericObject = { [key: string]: any }

export type ConditionType = "string" | "number" | "array" | "boolean"

export type Condition = {
  path: string
  operator: OperatorType
  type: ConditionType
  value: any
  failMessage: string
}

export type BooleanCondition = {
  all?: Condition[]
  any?: Condition[]
}

export type RetryStrategy = {
  limit: number
  statusCodes: number[] // TODO: validate possible HTTP status codes
}

export interface Validation<T> {
  validationId: string
  fraudScore: number
  totalChecks: number
  runnedChecks: number
  skippedChecks: string[]
  additionalInfo: ValidationAdditionalInfo<T>
  events: ValidationEvent[]
}

export type ValidationEventStatus = "NOT_STARTED" | "FAILED" | "PASSED" | "RUNNING"

export type ValidationEvent = {
  name: string
  status: ValidationEventStatus
  dateStarted: string | null
  dateEnded: string | null
  messages?: string[]
}

export type ValidationAdditionalInfo<T> = {
  startDate: string
  endDate?: string
  customerInformation?: T
}
