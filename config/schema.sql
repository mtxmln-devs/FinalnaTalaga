-- ============================================================
--  LMLinga Barangay Health Management System - Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS lmlinga_health;
USE lmlinga_health;

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(150) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  role        ENUM('Administrator','Health Worker','Encoder') DEFAULT 'Encoder',
  status      ENUM('Active','Inactive') DEFAULT 'Active',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- HOUSEHOLDS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS households (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  hh_number     VARCHAR(20) NOT NULL UNIQUE,
  head_name     VARCHAR(150) NOT NULL,
  address       VARCHAR(255) NOT NULL,
  purok         VARCHAR(50),
  housing_type  ENUM('Owned','Rented','Shared') DEFAULT 'Owned',
  is_4ps        TINYINT(1) DEFAULT 0,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- RESIDENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS residents (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  resident_no   VARCHAR(20) NOT NULL UNIQUE,
  household_id  INT,
  last_name     VARCHAR(100) NOT NULL,
  first_name    VARCHAR(100) NOT NULL,
  middle_name   VARCHAR(100),
  birthdate     DATE,
  sex           ENUM('Male','Female') NOT NULL,
  civil_status  ENUM('Single','Married','Widowed','Separated') DEFAULT 'Single',
  purok         VARCHAR(50),
  address       VARCHAR(255),
  occupation    VARCHAR(100),
  religion      VARCHAR(100),
  philhealth_no VARCHAR(50),
  is_4ps        TINYINT(1) DEFAULT 0,
  status        ENUM('Active','Inactive','Deceased') DEFAULT 'Active',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (household_id) REFERENCES households(id) ON DELETE SET NULL
);

-- ============================================================
-- IMMUNIZATION TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS immunization (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  resident_id   INT NOT NULL,
  vaccine       ENUM('BCG','DPT','Polio','Measles','Hepa B','MMR','Rotavirus','PCV') NOT NULL,
  dose          ENUM('1st Dose','2nd Dose','3rd Dose','Booster') NOT NULL,
  date_given    DATE NOT NULL,
  next_schedule DATE,
  given_by      VARCHAR(150),
  remarks       TEXT,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (resident_id) REFERENCES residents(id) ON DELETE CASCADE
);

-- ============================================================
-- OPERATION TIMBANG TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS operation_timbang (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  resident_id   INT NOT NULL,
  weight_kg     DECIMAL(5,2) NOT NULL,
  height_cm     DECIMAL(5,2) NOT NULL,
  bmi           DECIMAL(5,2),
  status        ENUM('Normal','Underweight','Severely Underweight','Overweight','Obese') DEFAULT 'Normal',
  date_measured DATE NOT NULL,
  measured_by   VARCHAR(150),
  remarks       TEXT,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (resident_id) REFERENCES residents(id) ON DELETE CASCADE
);

-- ============================================================
-- VITAMIN A TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS vitamin_a (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  resident_id INT NOT NULL,
  dosage      ENUM('100,000 IU','200,000 IU') NOT NULL,
  round       ENUM('February Round','August Round') NOT NULL,
  date_given  DATE,
  given_by    VARCHAR(150),
  status      ENUM('Given','Pending') DEFAULT 'Pending',
  year        YEAR NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (resident_id) REFERENCES residents(id) ON DELETE CASCADE
);

-- ============================================================
-- DEWORMING TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS deworming (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  resident_id      INT NOT NULL,
  drug             ENUM('Albendazole','Mebendazole') NOT NULL,
  dosage           ENUM('200 mg','400 mg') NOT NULL,
  round            ENUM('1st Round','2nd Round') NOT NULL,
  date_given       DATE NOT NULL,
  given_by         VARCHAR(150),
  adverse_reaction VARCHAR(255) DEFAULT 'None',
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (resident_id) REFERENCES residents(id) ON DELETE CASCADE
);

-- ============================================================
-- RISK ASSESSMENT TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS risk_assessment (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  resident_id     INT NOT NULL,
  category        ENUM('Hypertension','Diabetes','TB','Maternal','Heart Disease','Other') NOT NULL,
  risk_level      ENUM('Low','Moderate','High') NOT NULL,
  risk_factors    TEXT,
  date_assessed   DATE NOT NULL,
  next_followup   DATE,
  recommendations TEXT,
  assessed_by     VARCHAR(150),
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (resident_id) REFERENCES residents(id) ON DELETE CASCADE
);

-- ============================================================
-- FAMILY PLANNING TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS family_planning (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  resident_id INT NOT NULL,
  method      ENUM('Pills','IUD','Condom','Injectable','NFP/LAM','Implant','BTL','Vasectomy') NOT NULL,
  method_type ENUM('Modern','Natural') NOT NULL,
  start_date  DATE NOT NULL,
  next_visit  DATE,
  given_by    VARCHAR(150),
  status      ENUM('Active','Dropout','Completed') DEFAULT 'Active',
  remarks     TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (resident_id) REFERENCES residents(id) ON DELETE CASCADE
);

-- ============================================================
-- DEFAULT ADMIN USER  (password: Admin@1234)
-- ============================================================
INSERT IGNORE INTO users (name, email, password, role, status)
VALUES (
  'System Administrator',
  'admin@lmlinga.gov',
  '$2b$10$GMvLnRO1z/ggUqfSjuOvbe0ZkxXIzQ25Uiys57FUjpO8BJFxYbkpy',
  'Administrator',
  'Active'
);
