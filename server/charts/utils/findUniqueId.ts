import { generateRandomId } from '../createChart';
import { pool } from '../../database';


export const findUniqueId = async () => {
  const chartid = generateRandomId() + ':' + generateRandomId();
  return await pool.query(`select exists(select true from charts where chartid=$1)`, [chartid]).then((hey) => {
    if (hey.rows[0].exists) {
      throw new Error('Not unique');
    }
    return chartid;
  });
};
