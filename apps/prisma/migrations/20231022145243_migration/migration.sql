-- CreateTable
CREATE TABLE `business_entities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `deleted_at` DATETIME(0) NULL,
    `name` VARCHAR(100) NOT NULL,
    `api_key` VARCHAR(255) NOT NULL,
    `domain` VARCHAR(255) NULL,
    `logo_path` VARCHAR(255) NULL,
    `preferred_timezone` VARCHAR(100) NULL,
    `currency` VARCHAR(100) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customers` (
    `id` CHAR(36) NOT NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `deleted_at` DATETIME(0) NULL,
    `verified_at` DATETIME(0) NULL,
    `last_login_at` DATETIME(0) NULL,
    `customer_no` VARCHAR(100) NULL,
    `firstname` VARCHAR(100) NOT NULL,
    `middlename` VARCHAR(100) NULL,
    `lastname` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `contact_no` VARCHAR(100) NOT NULL,
    `primary_address` VARCHAR(255) NOT NULL,
    `secondary_address` VARCHAR(255) NULL,
    `image_path` VARCHAR(255) NULL,
    `gender_type` VARCHAR(100) NULL,
    `status` VARCHAR(100) NOT NULL DEFAULT 'PENDING',
    `business_entity_id` INTEGER NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `is_logged` BOOLEAN NOT NULL DEFAULT false,

    INDEX `business_entity_id`(`business_entity_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rbac_modules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `deleted_at` DATETIME(0) NULL,
    `name` VARCHAR(100) NOT NULL,
    `icon` VARCHAR(100) NULL,
    `path` VARCHAR(100) NULL,
    `order_display` INTEGER NULL,
    `permissions` JSON NOT NULL,
    `parent_id` INTEGER NULL,
    `is_section` BOOLEAN NOT NULL DEFAULT false,
    `is_parent` BOOLEAN NOT NULL DEFAULT false,

    INDEX `parent_id`(`parent_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rbac_role_based_access` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `deleted_at` DATETIME(0) NULL,
    `permissions` JSON NOT NULL,
    `created_user_id` CHAR(36) NOT NULL,
    `updated_user_id` CHAR(36) NULL,
    `deleted_user_id` CHAR(36) NULL,
    `rbac_module_id` INTEGER NOT NULL,
    `role_id` INTEGER NULL,
    `user_id` CHAR(36) NULL,
    `is_role_based_access` BOOLEAN NOT NULL DEFAULT true,

    INDEX `created_user_id`(`created_user_id`),
    INDEX `deleted_user_id`(`deleted_user_id`),
    INDEX `rbac_module_id`(`rbac_module_id`),
    INDEX `role_id`(`role_id`),
    INDEX `updated_user_id`(`updated_user_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `deleted_at` DATETIME(0) NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `business_entity_id` INTEGER NULL,

    INDEX `business_entity_id`(`business_entity_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` CHAR(36) NOT NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `deleted_at` DATETIME(0) NULL,
    `last_login_at` DATETIME(0) NULL,
    `name` VARCHAR(100) NOT NULL,
    `username` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `image_path` VARCHAR(255) NULL,
    `business_entity_id` INTEGER NULL,
    `role_id` INTEGER NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `is_role_based_access` BOOLEAN NOT NULL DEFAULT true,
    `is_logged` BOOLEAN NOT NULL DEFAULT false,

    INDEX `business_entity_id`(`business_entity_id`),
    INDEX `role_id`(`role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_trails` (
    `id` CHAR(36) NOT NULL,
    `created_at` DATETIME(0) NOT NULL,
    `table_name` VARCHAR(100) NOT NULL,
    `action` VARCHAR(100) NOT NULL,
    `record_id` VARCHAR(255) NOT NULL,
    `old_values` JSON NOT NULL,
    `new_values` JSON NOT NULL,
    `user_agent` VARCHAR(255) NULL,
    `host` VARCHAR(100) NULL,
    `ip_address` VARCHAR(100) NULL,
    `created_user_id` CHAR(36) NOT NULL,
    `business_entity_id` INTEGER NULL,

    INDEX `created_user_id`(`created_user_id`),
    INDEX `business_entity_id`(`business_entity_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `customers` ADD CONSTRAINT `customers_ibfk_1` FOREIGN KEY (`business_entity_id`) REFERENCES `business_entities`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rbac_modules` ADD CONSTRAINT `rbac_modules_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `rbac_modules`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rbac_role_based_access` ADD CONSTRAINT `rbac_role_based_access_ibfk_1` FOREIGN KEY (`created_user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rbac_role_based_access` ADD CONSTRAINT `rbac_role_based_access_ibfk_2` FOREIGN KEY (`updated_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rbac_role_based_access` ADD CONSTRAINT `rbac_role_based_access_ibfk_3` FOREIGN KEY (`deleted_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rbac_role_based_access` ADD CONSTRAINT `rbac_role_based_access_ibfk_4` FOREIGN KEY (`rbac_module_id`) REFERENCES `rbac_modules`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rbac_role_based_access` ADD CONSTRAINT `rbac_role_based_access_ibfk_5` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rbac_role_based_access` ADD CONSTRAINT `rbac_role_based_access_ibfk_6` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `roles` ADD CONSTRAINT `roles_ibfk_1` FOREIGN KEY (`business_entity_id`) REFERENCES `business_entities`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`business_entity_id`) REFERENCES `business_entities`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_trails` ADD CONSTRAINT `audit_trails_ibfk_1` FOREIGN KEY (`created_user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_trails` ADD CONSTRAINT `audit_trails_ibfk_2` FOREIGN KEY (`business_entity_id`) REFERENCES `business_entities`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
