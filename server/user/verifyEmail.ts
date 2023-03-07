import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const verifyEmail = async (req, res) => {
  var utoken = req.body.utoken as string

  const userToken = await prisma.user_token.findFirst({
    where: {
      token: utoken,
    },
  })
  if (!userToken || userToken.token_type != 'email_verify') {
    res.status(401).send({ message: 'Invalid token' })
    return
  }

  const userValue = await prisma.user.findUnique({
    where: {
      id: userToken.user_id,
    },
  })
  console.log('userValue: ', userValue)

  if (!userValue) {
    res.status(401).send({ message: 'user not found' })
    return
  }

  prisma.user
    .update({
      where: {
        id: userValue.id,
      },
      data: {
        email_verified: true,
      },
    })
    .then((hey) => {
      if (hey) {
        res.send({
          sucess: true,
        })
      } else {
        res.status(500).send({ message: 'Error in the DB' })
      }
    })
    .catch((err) => {
      res.status(400).send({ error: err })
    })
}
