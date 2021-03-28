import { pool, queryOne } from '../database'

export const deleteChart = async function (req, res) {
  const { chartid } = req.params
  console.log('chartid: ', chartid);

  const username = req.user.username

  if (!username) {
    return res.status(401).send({ message: 'No username' })
  }

  const chartDocument = await queryOne('SELECT * FROM charts WHERE chartid=$1', [chartid])
  console.log('chartDocument: ', chartDocument);

  if (!chartDocument){
    res.status(404).send({ message: "The chart doesn't exist" })
    return
  }

  if (chartDocument.username != username){
    res.status(401).send({ message: 'No permission for deleting this chart' })
    return
  }

  pool
    .query('UPDATE charts SET deleted=true WHERE chartid=$1 AND username=$2 AND is_snapshot=false RETURNING chartid', [chartid, username])

    .then((hey) => {
      if (hey.rows.length == 0) {
        res.status(401).send({ message: 'Weird error...' })
        return
      }
      res.send({
        deleted: true,
      })
    })
    .catch((err) => {
      console.log('err: ', err)
      res.status(400).send({ message: err.message })
    })
}
