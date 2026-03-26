-- Database Schema for GEMIONOTA Platform (MySQL)

-- Profiles table: Stores alumni information
CREATE TABLE profiles (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    graduation_year INT NOT NULL,
    current_company VARCHAR(255),
    job_title VARCHAR(255),
    mining_sector VARCHAR(100), -- e.g., Coal, Gold, Nickel
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    whatsapp_number VARCHAR(20),
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products table: Merchandise catalog
CREATE TABLE products (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL,
    stock_type ENUM('READY', 'PREORDER') DEFAULT 'READY',
    stock_count INT DEFAULT 0,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crowdfunding table: Donation campaigns
CREATE TABLE campaigns (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_amount DECIMAL(15, 2) NOT NULL,
    current_amount DECIMAL(15, 2) DEFAULT 0,
    end_date DATETIME,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Donations table: Tracks contributions
CREATE TABLE donations (
    id VARCHAR(255) PRIMARY KEY,
    campaign_id VARCHAR(255),
    name VARCHAR(255) DEFAULT 'Anonim',
    amount DECIMAL(15, 2) NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
);
