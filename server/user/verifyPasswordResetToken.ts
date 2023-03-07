import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const verifyPasswordResetToken = async (req, res) => {
  var utoken = req.body.utoken

  const userToken = await prisma.user_token.findFirst({
    where: { token: utoken },
  })

  console.log('userToken: ', userToken)

  if (!userToken || userToken.token_type != "password_reset") {
    res.status(401).send({ message: 'invalid token' })
    return
  }

  const userValue = await prisma.user.findUnique({
    where: { id: userToken.user_id },
  })

  console.log('userValue: ', userValue)

  if (!userValue) {
    res.status(401).send({ message: 'email not found' })
    return
  }

  res.send({
    email: userValue.email,
  })
}
