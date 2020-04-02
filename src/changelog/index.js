const fs = require('fs').promises;
const pool = require('../db');

// Check if it was already executed based on name
// Execute it if not, or if it failed previously (do it as a transaction)

const processChangelog = async () => {
  try {
    const lastProcessedFile = await pool.query('SELECT file_name FROM changelog '
      + ' WHERE chlg_id = (SELECT MAX(chlg_id) FROM changelog WHERE status = $1)', ['SUCCESS']);
    let files = await fs.readdir('src/changelog/files');
    files = files.sort();
    let isNewOrFailedFile = lastProcessedFile.rowCount === 0;

    for await (const fileName of files) {
      // TODO Check that file name is compliant with certain nomenclature,
      // and if not log an error in changelog table
      console.log(`${isNewOrFailedFile}: Comparing ${lastProcessedFile.rows[0].file_name} with ${fileName}`);
      if (!isNewOrFailedFile && lastProcessedFile.rows[0].file_name === fileName) {
        isNewOrFailedFile = true;
        continue;
      }

      if (!isNewOrFailedFile) {
        continue;
      }
      let errorMessage;
      console.log(`Processing file ${fileName}...`);
      const client = await pool.connect();
      let rollbackDone = false;
      try {
        await client.query('BEGIN');
        const fileContentsSQL = await fs.readFile(`src/changelog/files/${fileName}`, 'utf8');
        await client.query(fileContentsSQL);
        await client.query('INSERT INTO changelog (file_name, status) VALUES ($1, $2)', [fileName, 'SUCCESS']);
        await client.query('COMMIT');
      } catch (txnErr) {
        console.log(`Rollback error for ${fileName} is ${txnErr.message}`);
        errorMessage = txnErr.message;
        await client.query('ROLLBACK');
        await client.query('INSERT INTO changelog (file_name, status, error_message) VALUES ($1, $2, $3)', [fileName, 'FAILURE', errorMessage]);
        rollbackDone = true;
      } finally {
        console.log(`Closing the pool client for ${fileName}...`);
        client.release(true);
        if (rollbackDone) {
          break;
        }
      }
    }
  } catch (err) {
    console.log(`Excepcion prinicpal ${err.message}`);
  }
};

processChangelog();

module.exports = processChangelog;
