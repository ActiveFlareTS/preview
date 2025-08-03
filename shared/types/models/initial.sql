CREATE TABLE migrations(
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                name       TEXT UNIQUE,
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE `credentials` (
        `id` text PRIMARY KEY NOT NULL,
        `user_id` text NOT NULL,
        `publicKey` text NOT NULL,
        `counter` integer NOT NULL,
        `backedUp` integer NOT NULL,
        `transports` text NOT NULL,
        `created_at` text DEFAULT (CURRENT_TIMESTAMP),
        `updated_at` text DEFAULT (CURRENT_TIMESTAMP),
        FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE cascade
);
CREATE UNIQUE INDEX `credentials_id_unique` ON `credentials` (`id`);
CREATE TABLE `users` (
        `id` text PRIMARY KEY NOT NULL,
        `username` text(50) NOT NULL,
        `password` text(200) NOT NULL,
        `verified` text(100) DEFAULT '',
        `role` text DEFAULT 'user',
        `created_at` text DEFAULT (CURRENT_TIMESTAMP),
        `updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);
CREATE UNIQUE INDEX `idx_users_username` ON `users` (`username`);
