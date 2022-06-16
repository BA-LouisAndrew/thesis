/* eslint-disable @typescript-eslint/ban-types */
// This file is intended to try out things and format codes

type ValidationRule = {}

const prisma = {
  $connect: async () => {},
  validationRule: {
    create: async (s) => s,
    findFirst: async (s) => s,
  },
}

const getValidationRule = async (
  ruleName: string,
): Promise<ValidationRule | null> => {
  await prisma.$connect() // Connect to client
  const validationRule =
    await prisma.validationRule.findFirst({
      where: {
        name: ruleName,
      },
    })

  return validationRule
}

export class ValidationEngine<T> {
  private async evaluateRule(
    rule: ValidationRule,
    data: T,
  ): Promise<EvaluationResult> {
    const { endpoint, retryStrategy, condition, name } =
      rule

    const validationEvent = this.validation.events.find(
      (event) => event.name === name,
    )
    if (validationEvent) {
      validationEvent.dateStarted = new Date().toISOString()
      validationEvent.status = "RUNNING"
      await this.pushToDatastore()
    }

    const { error, data: responseData } =
      await Agent.fireRequest(rule, {
        customer: data,
        secrets: this.secrets,
      })

    if (error) {
      return {
        messages: [
          `${endpoint} is not accessible.${
            retryStrategy
              ? ` Retries done: ${retryStrategy.limit}`
              : ""
          }`,
          error.message,
        ],
        pass: false,
      }
    }

    const evaluator =
      EvaluatorFactory.getEvaluator(condition)
    return evaluator.evaluate({
      response: responseData,
      customer: data,
      secrets: this.secrets,
    })
  }
}
