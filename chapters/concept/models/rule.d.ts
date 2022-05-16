/**
 * Types are heavily inspired by
 * https://github.com/CacheControl/json-rules-engine/blob/master/docs/rules.md#constructorobject-optionsstring-json
 */

type GenericObject = { [key: string]: any }

/**
 * TODO: Decide which operations should be supported.
 */
export type OperatorName = string;

/**
 * Condition of a rule, to determine whether the validation passes.
 */
export type Condition = {
  /**
   * Path to the attribute that should be evaluated. Path is evaluated using a json-path syntax.
   * Please take a look into: https://github.com/dchester/jsonpath#jsonpath-syntax for the detailed
   * information.
   * @example '$.statusCode' | '$.validAddress'
   */
  path: string;
  /**
   * Name of the operator that should be used$.validAddress to evaluate the condition.
   * @example 'equals' | 'contains'
   */
  operator: OperatorName;
  /**
   * Value, with which the condition should be evaluated.
   * @example true | 200 | 'success'
   */
  value: any;
};

/**
 * Boolean condition ('any' | 'all') that wraps an array of conditions.
 *  'any': The validation passes if at least one of the condition is true.
 *  'all': The validation passes ONLY if ALL of the conditions are true.
 */
export type BooleanCondition = Record<"any" | "all", Condition>;

/**
 * Retry strategy if the endpoint is not accessible. Will be passed into `got`'s
 * `retry` option.
 * TODO: Refine
 *
 * More info:
 * https://github.com/sindresorhus/got/blob/2ac07e1b60f59e2219bd6c2809a9e40f56b146b6/documentation/7-retry.md
 */
export type RetryStrategy = {
  limit: number;
  methods: string[]; // TODO: validate possible HTTP methods
  statusCodes: string[]; // TODO: validate possible HTTP status codes
  errorCodes: string[]; // TODO: validate possible HTTP error codes
};

/**
 * Model for the validation rule that would be stored in the database and evaluated during runtime.
 */
export type ValidationRule = {
  /**
   * Determine whether the specific validation rule should be skipped.
   */
  skip: boolean;
  /**
   * Condition/-s, with which the rule should be evaluated to determine
   * whether the validation passes
   */
  condition: BooleanCondition | Condition;
  /**
   * Unique identifier of the rule.
   */
  name: string;
  /**
   * Priority of the validation rule. Determines the priority of the rule evaluation.
   * Rules with higher priority will be run first.
   * @default 0
   */
  priority: number;
  /**
   * URL of the external check endpoint.
   * @example 'http://localhost:3000/address-validation'
   */
  endpoint: string;
  /**
   * HTTP method to be used to call the external check endpoint.
   */
  method: string; // TODO: validate possible HTTP method
  /**
   * Amount of score that should be incremented to the resulting fraud score if
   * the validation failed.
   */
  failScore: number;
  /**
   * Retry strategy if the endpoint is not accessible.
   */
  retryStrategy?: RetryStrategy;
  /**
   * Used to determine the parameter on the endpoint URL. (e.g. endpointUrl: 'http://localhost/validate/{user}/{city}')
   * Only available when the endpoint URL contains a URL parameter.
   * @example { user: "$.firstName", city: "$.city" }
   */
  requestUrlParameter?: GenericObject
  /**
   * Request body to be passed to the external endpoint. Only available on `POST` and `PUT` HTTP methods.
   * @example { user: "$.firstName", city: "$.city" } 
   */
  requestBody?: GenericObject
};
