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
const validateFunction = (value) =>
  typeof value === "number" &&
  !isNaN(parseFloat(`${value}`))

const operator = OperatorFactory.getOperator(
  validationRule.type,
  validationRule.operator,
)

await channel.assertExchange(
  Notification.EXCHANGE,
  "fanout",
  {
    durable: false,
  },
)

EventBus.emit(
  `${EventBus.EVENTS.VALIDATION_EVENT_UPDATE}--${validationId}`,
  this.validationResult,
)

const subscribeToValidationProgress = (
  validationId: string,
  responseObject: Response,
) => {
  const updateEvent = `${EventBus.EVENTS.VALIDATION_EVENT_UPDATE}--${validationId}`
  const closeEvent = `${EventBus.EVENTS.VALIDATION_DONE}--${validationId}`

  EventBus.once(closeEvent, () => {
    closeConnection()
  })

  EventBus.on(
    updateEvent,
    (validationResult: Validation) => {
      writeToStream(validationResult)
    },
  )

  const writeToStream = (data: any) =>
    responseObject.write(
      `data: ${JSON.stringify(data)}\n\n`,
    )
}

describe("Key-Value input", () => {
  const renderComponent = (options: RenderOptions = {
  }) =>
    render(KeyValueInput, options)

  it("renders a new key-value input fiels when the `Add` button is clicked", async () => {
    const { getByRole, queryAllByTestId } =
      renderComponent()

    expect(queryAllByTestId("key-value-field").length).toBe(
      0,
    )
    await fireEvent.click(
      getByRole("button", {
        name: "Add",
      }),
    )

    expect(queryAllByTestId("key-value-field").length).toBe(
      1,
    )
    await fireEvent.click(
      getByRole("button", {
        name: "Add",
      }),
    )

    expect(queryAllByTestId("key-value-field").length).toBe(
      2,
    )
  })
})

it("GET /rules/:ruleName should return a single rule", async () => {
  mockContext.prisma.validationRule.findFirst.mockResolvedValueOnce(
    prismaValidationRule,
  )

  const response = await agent.get(
    "/api/v1/rules/" + prismaValidationRule.name,
  )
  expect(response.statusCode).toEqual(200)
  expect(response.body).toEqual({
    id: "", ...sampleRule 
  })
})

class I {
  public async validateCustomer(
    @Body() requestBody: Customer,
  ): Promise<ValidationSchedule | WentWrong> {
    const { error, data } =
      await ValidationService.scheduleRulesetValidation(
        requestBody,
      )
    if (error) {
      this.setStatus(400)
      return {
        message: error.message,
        details: error.details || "",
      }
    }

    return data
  }
}