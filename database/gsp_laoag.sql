-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 14, 2026 at 08:06 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gsp_laoag`
--

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `event_date` date NOT NULL,
  `date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT 'Face to Face',
  `notes` text DEFAULT NULL,
  `status` varchar(32) NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `stock`, `image`, `created_at`) VALUES
(5, 'Girl Scout Uniform - Adult', 'malambot ang cotton', 313.00, 10, 'prod_64dd293315979e5e.jpg', '2026-05-14 18:03:06');

-- --------------------------------------------------------

--
-- Table structure for table `publications`
--

CREATE TABLE `publications` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(512) NOT NULL,
  `file` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `issue_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `publications`
--

INSERT INTO `publications` (`id`, `title`, `description`, `file`, `image`, `issue_date`, `created_at`) VALUES
(2, 'Latest Issue 2026', 'Discover the newest stories, achievements, and council highlights.', 'https://online.fliphtml5.com/mhuzo/snwd/', '/assets/publications/coverpage.jpg', '2026-01-15', '2026-05-14 17:46:06'),
(3, 'January - June 2025', '', 'https://online.fliphtml5.com/mhuzo/January-to-June-2025/', '/assets/publications/cover2.jpg', '2025-06-30', '2026-05-14 17:46:06'),
(4, 'RCM Special Issue', '', 'https://online.fliphtml5.com/mhuzo/RCM-special-issue/', '/assets/publications/cover3.jpg', '2024-03-01', '2026-05-14 17:46:06'),
(5, 'Issue 2022', '', 'https://online.fliphtml5.com/mhuzo/January-June-issue-2022/', '/assets/publications/cover5.jpg', '2022-06-30', '2026-05-14 17:46:06'),
(6, 'Issue 2021', '', 'https://online.fliphtml5.com/mhuzo/January-June-issue-2021/', '/assets/publications/cover4.jpg', '2021-06-30', '2026-05-14 17:46:06'),
(7, 'asdasdad', 'asdasda', 'pub_3dcd92516f50cafe.png', 'pubimg_ea86c5e644ea9f38.png', '2000-05-21', '2026-05-14 17:50:03');

-- --------------------------------------------------------

--
-- Table structure for table `troop_registrations_archive`
--

CREATE TABLE `troop_registrations_archive` (
  `id` int(11) NOT NULL,
  `original_registration_id` int(11) NOT NULL,
  `troop_name` varchar(255) DEFAULT NULL,
  `age_level` varchar(255) DEFAULT NULL,
  `troop_type` varchar(255) DEFAULT NULL,
  `troop_address` text DEFAULT NULL,
  `leader_name` varchar(255) DEFAULT NULL,
  `leader_birthdate` date DEFAULT NULL,
  `leader_beneficiary` varchar(255) DEFAULT NULL,
  `prior_status` varchar(32) NOT NULL DEFAULT 'pending',
  `original_created_at` timestamp NULL DEFAULT NULL,
  `archived_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `troop_registrations_archive`
--

INSERT INTO `troop_registrations_archive` (`id`, `original_registration_id`, `troop_name`, `age_level`, `troop_type`, `troop_address`, `leader_name`, `leader_birthdate`, `leader_beneficiary`, `prior_status`, `original_created_at`, `archived_at`) VALUES
(1, 7, 'The big opnes', 'Star', 'School Based', 'BRGY. BARBARIT, MAGSINGAL, ILOCOS SUR', 'Loyd bagcal', '2000-07-14', 'kfc', 'approved', '2026-05-14 16:28:43', '2026-05-14 16:44:07');

-- --------------------------------------------------------

--
-- Table structure for table `troop_registrations_pending`
--

CREATE TABLE `troop_registrations_pending` (
  `id` int(11) NOT NULL,
  `troop_name` varchar(255) DEFAULT NULL,
  `age_level` varchar(255) DEFAULT NULL,
  `troop_type` varchar(255) DEFAULT NULL,
  `troop_address` text DEFAULT NULL,
  `leader_name` varchar(255) DEFAULT NULL,
  `leader_birthdate` date DEFAULT NULL,
  `leader_beneficiary` varchar(255) DEFAULT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `troop_registrations_pending`
--

INSERT INTO `troop_registrations_pending` (`id`, `troop_name`, `age_level`, `troop_type`, `troop_address`, `leader_name`, `leader_birthdate`, `leader_beneficiary`, `status`, `created_at`) VALUES
(8, 'The big opnes', 'Star', 'School Based', 'BRGY. BARBARIT, MAGSINGAL, ILOCOS SUR', 'Loyd bagcal', '2000-07-14', 'kfc', 'pending', '2026-05-14 18:00:27');

-- --------------------------------------------------------

--
-- Table structure for table `troop_registration_members`
--

CREATE TABLE `troop_registration_members` (
  `id` int(11) NOT NULL,
  `registration_id` int(11) NOT NULL,
  `last_name` varchar(128) NOT NULL,
  `first_name` varchar(128) NOT NULL,
  `middle_initial` varchar(16) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `grade` varchar(64) DEFAULT NULL,
  `member_status` enum('new','re-reg') NOT NULL DEFAULT 'new',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `troop_registration_members`
--

INSERT INTO `troop_registration_members` (`id`, `registration_id`, `last_name`, `first_name`, `middle_initial`, `birthdate`, `grade`, `member_status`, `created_at`) VALUES
(3, 8, 'Cuaresma', 'Louis Jarneau', 'G', '2009-07-15', 'Grade 6', 'new', '2026-05-14 18:00:27');

-- --------------------------------------------------------

--
-- Table structure for table `troop_registration_member_archive`
--

CREATE TABLE `troop_registration_member_archive` (
  `id` int(11) NOT NULL,
  `archive_id` int(11) NOT NULL,
  `last_name` varchar(128) NOT NULL,
  `first_name` varchar(128) NOT NULL,
  `middle_initial` varchar(16) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `grade` varchar(64) DEFAULT NULL,
  `member_status` enum('new','re-reg') NOT NULL DEFAULT 'new',
  `original_member_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `troop_registration_member_archive`
--

INSERT INTO `troop_registration_member_archive` (`id`, `archive_id`, `last_name`, `first_name`, `middle_initial`, `birthdate`, `grade`, `member_status`, `original_member_id`) VALUES
(1, 1, 'Cuaresma', 'Louis Jarneau', 'G', '2009-07-15', 'Grade 6', 'new', 2);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` text DEFAULT NULL,
  `role` enum('admin','member') DEFAULT 'member',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullname`, `email`, `password`, `role`, `created_at`) VALUES
(4, 'Admin', 'demo.admin@gsp-laoag.test', '$2y$10$MHkJhSMGZThn6PVVf6/a6ORB0D8LpeHacF1.akAgwTv5pxwCIcmOS', 'admin', '2026-05-14 17:54:53');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `publications`
--
ALTER TABLE `publications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `troop_registrations_archive`
--
ALTER TABLE `troop_registrations_archive`
  ADD PRIMARY KEY (`id`),
  ADD KEY `original_registration_id` (`original_registration_id`);

--
-- Indexes for table `troop_registrations_pending`
--
ALTER TABLE `troop_registrations_pending`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `troop_registration_members`
--
ALTER TABLE `troop_registration_members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `registration_id` (`registration_id`);

--
-- Indexes for table `troop_registration_member_archive`
--
ALTER TABLE `troop_registration_member_archive`
  ADD PRIMARY KEY (`id`),
  ADD KEY `archive_id` (`archive_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `publications`
--
ALTER TABLE `publications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `troop_registrations_archive`
--
ALTER TABLE `troop_registrations_archive`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `troop_registrations_pending`
--
ALTER TABLE `troop_registrations_pending`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `troop_registration_members`
--
ALTER TABLE `troop_registration_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `troop_registration_member_archive`
--
ALTER TABLE `troop_registration_member_archive`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_order_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `troop_registration_members`
--
ALTER TABLE `troop_registration_members`
  ADD CONSTRAINT `fk_trm_pending` FOREIGN KEY (`registration_id`) REFERENCES `troop_registrations_pending` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `troop_registration_member_archive`
--
ALTER TABLE `troop_registration_member_archive`
  ADD CONSTRAINT `fk_trma_archive` FOREIGN KEY (`archive_id`) REFERENCES `troop_registrations_archive` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
