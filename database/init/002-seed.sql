-- Seed data for Local Meetup RSVP Tracker
USE `meetlocal_db`;

-- Insert default test users (password is 'password123')
INSERT INTO `users` (`id`, `name`, `email`, `password`) VALUES
(1, 'Alice Johnson', 'alice@example.com', '$2a$10$OejaE40gayP83/Cq80h4f.DinmHv9jvqXlv2wiDzHRwyrJUAOYITW'),
(2, 'Bob Smith', 'bob@example.com', '$2a$10$OejaE40gayP83/Cq80h4f.DinmHv9jvqXlv2wiDzHRwyrJUAOYITW'),
(3, 'Charlie Davis', 'charlie@example.com', '$2a$10$OejaE40gayP83/Cq80h4f.DinmHv9jvqXlv2wiDzHRwyrJUAOYITW')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- Insert initial meetup events
INSERT INTO `events` (`id`, `title`, `description`, `location`, `date_time`, `organizer_id`) VALUES
(1, 'React & Next.js Developers Meetup', 'Join us for an exciting evening discussing Next.js App Router, Server Components, and state management.', 'Tech Hub Downtown, Room 302', NOW() + INTERVAL 3 DAY, 1),
(2, 'Local Open Source & Coffee Hangout', 'A relaxed meetup to work on open-source projects, share ideas, and network with software engineers.', 'Central Perk Cafe, Main St', NOW() + INTERVAL 7 DAY, 2),
(3, 'Cloud Architecture & DevOps Workshop', 'Hands-on workshop covering Docker containers, CI/CD pipelines, and cloud database orchestration.', 'Innovation Labs, Building B', NOW() + INTERVAL 12 DAY, 3)
ON DUPLICATE KEY UPDATE `id`=`id`;

-- Insert sample RSVPs
INSERT INTO `rsvps` (`event_id`, `user_id`, `status`) VALUES
(1, 2, 'going'),
(1, 3, 'maybe'),
(2, 1, 'going')
ON DUPLICATE KEY UPDATE `status`=VALUES(`status`);
