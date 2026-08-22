-- =========================================================================
-- MYSQL SCHEMA & SEED DATA FOR WEBSITE ELECTRON (NODEJS + EXPRESS)
-- =========================================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `is_admin` TINYINT(1) DEFAULT 0,
  `phone` VARCHAR(50) NULL,
  `address` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `image` VARCHAR(255) NULL,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. SUBCATEGORIES TABLE
CREATE TABLE IF NOT EXISTS `subcategories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `image` VARCHAR(255) NULL,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT NOT NULL,
  `subcategory_id` INT NULL,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `brand` VARCHAR(100) NULL,
  `description` TEXT NULL,
  `price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `sale_price` DECIMAL(10, 2) NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `image` VARCHAR(255) NULL,
  `is_feature` TINYINT(1) DEFAULT 0,
  `is_deal` TINYINT(1) DEFAULT 0,
  `rating` DECIMAL(3, 2) DEFAULT 5.00,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. PRODUCT VARIANTS TABLE
CREATE TABLE IF NOT EXISTS `product_variants` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `sku` VARCHAR(100) NULL,
  `variant_name` VARCHAR(191) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `stock` INT DEFAULT 0,
  `attributes` JSON NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. PRODUCT SPECIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS `product_specifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `spec_key` VARCHAR(191) NOT NULL,
  `spec_value` VARCHAR(255) NOT NULL,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. CART ITEMS TABLE
CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `user_name` VARCHAR(191) NOT NULL,
  `rating` INT NOT NULL DEFAULT 5,
  `comment` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS `customers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `phone` VARCHAR(50) NULL,
  `address` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. SERVICES TABLE
CREATE TABLE IF NOT EXISTS `services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(191) NOT NULL,
  `customer_name` VARCHAR(191) NOT NULL,
  `service_type` VARCHAR(100) NOT NULL,
  `status` ENUM('Pending', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Pending',
  `notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================================
-- SEED DATA (DEFAULT CATEGORIES & PRODUCTS IF EMPTY)
-- =========================================================================

INSERT IGNORE INTO `categories` (`id`, `name`, `slug`, `description`, `image`) VALUES
(1, 'Computers & Peripherals', 'computers-peripherals', 'Laptops, Monitors, Storage & PC Hardware', 'http://127.0.0.1:8000/images/monitor.jpg'),
(2, 'Print Consumables', 'print-consumables', 'Printer Ink, Toner Cartridges & Paper', 'http://127.0.0.1:8000/images/printer.jpg'),
(3, 'CCTV & Security Systems', 'cctv-security-systems', 'Surveillance Cameras, DVRs & NVRs', 'http://127.0.0.1:8000/images/cctv.jpg'),
(4, 'Consumer Electronics', 'consumer-electronics', 'Smart TVs, Speakers & Home Appliances', 'http://127.0.0.1:8000/images/tv.jpg');

INSERT IGNORE INTO `subcategories` (`id`, `category_id`, `name`, `slug`) VALUES
(1, 1, 'Solid State Drives (SSD)', 'ssd-storage'),
(2, 1, 'RAM & Memory', 'ram-memory'),
(3, 1, 'LED Monitors', 'led-monitors'),
(4, 1, 'Motherboards & CPUs', 'motherboards'),
(5, 1, 'Gaming Cabinets', 'gaming-cabinets');

INSERT IGNORE INTO `products` (`id`, `category_id`, `subcategory_id`, `name`, `slug`, `brand`, `description`, `price`, `sale_price`, `stock`, `image`, `is_featured`, `is_deal`, `rating`) VALUES
(1, 1, 1, 'Consistent 256GB SATA III Solid State Drive', 'consistent-256gb-ssd', 'Consistent', 'High speed 2.5-inch 6Gb/s SATA SSD with 3D NAND Technology for instant boot times.', 2499.00, 1899.00, 50, 'http://127.0.0.1:8000/images/ssd.jpg', 1, 1, 4.90),
(2, 1, 3, 'Consistent 21.5" Frameless Full HD IPS LED Monitor', 'consistent-21-5-fhd-monitor', 'Consistent', 'Ultra-slim frameless display with HDMI/VGA ports & built-in dual speakers.', 7999.00, 5499.00, 30, 'http://127.0.0.1:8000/images/monitor.jpg', 1, 1, 4.80),
(3, 1, 5, 'RGB Gaming Computer Cabinet with Tempered Glass', 'rgb-gaming-cabinet', 'Consistent', 'Heavy duty steel ATX chassis with 4x ARGB cooling fans and magnetic dust filter.', 3999.00, 2999.00, 25, 'http://127.0.0.1:8000/images/cabinet.jpg', 1, 0, 4.95),
(4, 1, 4, 'Consistent Intel H610 DDR4 Motherboard', 'consistent-h610-motherboard', 'Consistent', 'Intel LGA 1700 socket motherboard supporting 12th/13th Gen Processors with M.2 slot.', 6499.00, 4899.00, 20, 'http://127.0.0.1:8000/images/motherboard.jpg', 0, 1, 4.85);

-- SEED ADMIN USER (password: admin123)
INSERT IGNORE INTO `users` (`id`, `name`, `email`, `password`, `is_admin`) VALUES
(1, 'Admin User', 'admin@websiteelectron.com', '$2a$10$wE99NlyfRkOdmD31qGf3r.n8WkUkyR7LwJ7xR4w5l6Fz0pYg.3YdO', 1);
