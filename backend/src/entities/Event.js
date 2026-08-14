const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Event',
  tableName: 'events',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    title: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    description: {
      type: 'text',
      nullable: false,
    },
    location: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    date_time: {
      type: 'datetime',
      nullable: false,
    },
    organizer_id: {
      type: 'int',
      nullable: false,
    },
    created_at: {
      type: 'timestamp',
      createDate: true,
    },
    updated_at: {
      type: 'timestamp',
      updateDate: true,
    },
  },
  relations: {
    organizer: {
      target: 'User',
      type: 'many-to-one',
      joinColumn: { name: 'organizer_id' },
      onDelete: 'CASCADE',
    },
    rsvps: {
      target: 'Rsvp',
      type: 'one-to-many',
      inverseSide: 'event',
    },
  },
});
