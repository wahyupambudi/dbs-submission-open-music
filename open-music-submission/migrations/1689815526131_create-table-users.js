exports.up = (pgm) => {
  pgm.createTable('users', {
    id: {
      primaryKey: true,
      type: 'VARCHAR(50)',
    },
    username: {
      type: 'VARCHAR(50)',
      unique: true,
    },
    password: {
      type: 'TEXT',
      notNull: true,
    },
    fullname: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};
