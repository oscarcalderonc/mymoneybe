
exports.up = async (knex) => {
    await Promise.all([
        knex.schema.raw(`ALTER TABLE transaction ALTER COLUMN amount TYPE numeric(10,2)`),
        knex.schema.raw(`ALTER TABLE account 
            ALTER COLUMN initial_balance TYPE numeric(10,2),
            ALTER COLUMN current_balance TYPE numeric(10,2),
            ALTER COLUMN credit_limit TYPE numeric(10,2),
            ALTER COLUMN loan_amount TYPE numeric(10,2),
            ALTER COLUMN overdraft_limit TYPE numeric(10,2)`),
    ]);
};

exports.down = function(knex) {
  
};
