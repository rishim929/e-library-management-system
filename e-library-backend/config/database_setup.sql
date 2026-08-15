-- E-Library Management System Database Schema & Initial Data Setup
-- Compatible with MySQL 5.7+ / MySQL 8.0+ / MariaDB / XAMPP

CREATE DATABASE IF NOT EXISTS `elibrary_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `elibrary_db`;

-- --------------------------------------------------------
-- Table structure for `users`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'subscriber') DEFAULT 'subscriber',
  `membership_type` ENUM('basic', 'premium') DEFAULT 'basic',
  `reset_otp` VARCHAR(10) DEFAULT NULL,
  `reset_otp_expires` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for `categories`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_name` VARCHAR(255) NOT NULL,
  `membership_level` ENUM('basic', 'premium') DEFAULT 'basic',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for `books`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `books` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `author` VARCHAR(255) NOT NULL,
  `category_id` INT DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `cover_image` VARCHAR(255) DEFAULT NULL,
  `pdf_file` VARCHAR(255) DEFAULT NULL,
  `membership_level` ENUM('basic', 'premium') DEFAULT 'basic',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for `subscriptions`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `subscriptions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `plan_name` VARCHAR(255) DEFAULT 'Premium Plan',
  `membership_type` ENUM('basic', 'premium') DEFAULT 'premium',
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `status` ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for `payments`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `payments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `payment_method` VARCHAR(100) DEFAULT 'Khalti',
  `transaction_id` VARCHAR(255) DEFAULT NULL,
  `pidx` VARCHAR(255) DEFAULT NULL,
  `status` VARCHAR(50) DEFAULT 'Completed',
  `payment_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for `reading_history`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `reading_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `book_id` INT NOT NULL,
  `last_read_page` INT DEFAULT 1,
  `total_pages` INT DEFAULT 1,
  `read_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for `notifications`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `type` VARCHAR(50) DEFAULT 'general',
  `is_read` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Seed Initial Sample Data
-- --------------------------------------------------------

-- Admin User (Password: admin123)
INSERT INTO `users` (`name`, `email`, `password`, `role`, `membership_type`)
SELECT 'Admin User', 'admin@elibrary.com', '$2a$10$wT0lYlI9.e18c5R/k30Dme7N3hC./.N88h8nI8lO6O9z5r2m6m6gW', 'admin', 'premium'
WHERE NOT EXISTS (SELECT 1 FROM `users` WHERE `email` = 'admin@elibrary.com');

-- Sample Categories
INSERT INTO `categories` (`category_name`, `membership_level`) VALUES
('Computer Science & IT', 'basic'),
('Fiction & Novels', 'basic'),
('Science & Technology', 'premium'),
('Business & Economics', 'premium');

-- Sample Notifications
INSERT INTO `notifications` (`title`, `message`, `type`) VALUES
('Welcome to E-Library App', 'Explore thousands of books, track reading progress, and manage subscriptions on mobile.', 'system');
