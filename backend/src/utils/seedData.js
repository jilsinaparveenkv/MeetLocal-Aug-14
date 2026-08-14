const { AppDataSource } = require('../config/db');
const { hashPassword } = require('./hashPassword');

/**
 * Seed default users, events, and RSVPs if the database is empty
 */
const seedData = async () => {
  try {
    const userRepository = AppDataSource.getRepository('User');
    const eventRepository = AppDataSource.getRepository('Event');
    const rsvpRepository = AppDataSource.getRepository('Rsvp');

    const userCount = await userRepository.count();

    if (userCount === 0) {
      console.log('🌱 Database is empty. Seeding initial users, events, and RSVPs...');

      const defaultPassword = await hashPassword('password123');

      // 1. Create Default Seed Users
      const users = userRepository.create([
        {
          name: 'Alice Johnson',
          email: 'alice@example.com',
          password: defaultPassword,
        },
        {
          name: 'Bob Smith',
          email: 'bob@example.com',
          password: defaultPassword,
        },
        {
          name: 'Charlie Davis',
          email: 'charlie@example.com',
          password: defaultPassword,
        },
      ]);

      const savedUsers = await userRepository.save(users);
      console.log(`✅ Seeded ${savedUsers.length} users successfully.`);

      const alice = savedUsers[0];
      const bob = savedUsers[1];
      const charlie = savedUsers[2];

      // 2. Create Sample Meetup Events
      const events = eventRepository.create([
        {
          title: 'React & Next.js Developers Meetup',
          description: 'Join us for an exciting evening discussing Next.js App Router, Server Components, and real-time state management.',
          location: 'Tech Hub Downtown, Room 302',
          date_time: new Date(Date.now() + 86400000 * 3), // 3 days from now
          organizer_id: alice.id,
        },
        {
          title: 'Local Open Source & Coffee Hangout',
          description: 'A relaxed meetup to work on open-source projects, share ideas, and network with local software engineers over coffee.',
          location: 'Central Perk Cafe, Main St',
          date_time: new Date(Date.now() + 86400000 * 7), // 7 days from now
          organizer_id: bob.id,
        },
        {
          title: 'Cloud Architecture & DevOps Workshop',
          description: 'Hands-on workshop covering Docker containers, CI/CD pipelines, and cloud database orchestration.',
          location: 'Innovation Labs, Building B',
          date_time: new Date(Date.now() + 86400000 * 12), // 12 days from now
          organizer_id: charlie.id,
        },
      ]);

      const savedEvents = await eventRepository.save(events);
      console.log(`✅ Seeded ${savedEvents.length} events successfully.`);

      // 3. Create Sample RSVPs
      const rsvps = rsvpRepository.create([
        {
          event_id: savedEvents[0].id,
          user_id: bob.id,
          status: 'going',
        },
        {
          event_id: savedEvents[0].id,
          user_id: charlie.id,
          status: 'maybe',
        },
        {
          event_id: savedEvents[1].id,
          user_id: alice.id,
          status: 'going',
        },
      ]);

      await rsvpRepository.save(rsvps);
      console.log('✅ Seeded initial RSVPs successfully.');
    } else {
      console.log('ℹ️ Database already contains data. Skipping seed step.');
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
  }
};

module.exports = { seedData };
