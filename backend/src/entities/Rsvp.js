const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Rsvp',
  tableName: 'rsvps',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    event_id: {
      type: 'int',
      nullable: false,
    },
    user_id: {
      type: 'int',
      nullable: false,
    },
    status: {
      type: 'enum',
      enum: ['going', 'maybe', 'declined'],
      default: 'going',
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
  indices: [
    {
      name: 'IDX_UNIQUE_USER_EVENT_RSVP',
      unique: true,
      columns: ['event_id', 'user_id'],
    },
  ],
  relations: {
    event: {
      target: 'Event',
      type: 'many-to-one',
      joinColumn: { name: 'event_id' },
      onDelete: 'CASCADE',
    },
    user: {
      target: 'User',
      type: 'many-to-one',
      joinColumn: { name: 'user_id' },
      onDelete: 'CASCADE',
    },
  },
});
