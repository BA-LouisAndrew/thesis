/* eslint-disable @typescript-eslint/ban-types */
// This file is intended to try out things and format codes

type ValidationRule = {}

const prisma = {
  $connect: async () => { },
  validationRule: {
    create: async (s) => s,
    findFirst: async s => s
  }
}

const getValidationRule = async (
  ruleName: string
): Promise<ValidationRule | null> => {
  await prisma.$connect() // Connect to client
  const validationRule = await prisma.validationRule.findFirst({
    where: {
      name: ruleName
    }
  })
  
  return validationRule
}
