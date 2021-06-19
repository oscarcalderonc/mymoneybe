
exports.up = async (knex) => {
    await Promise.all([
        knex.schema.raw(`ALTER TABLE workspace ADD COLUMN is_default boolean default false`),
        knex.schema.raw(`UPDATE workspace SET is_default = true WHERE name = 'Home'`),
    ]);
};

exports.down = function(knex) {
  
};
