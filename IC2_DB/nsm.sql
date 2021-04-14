-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 13, 2021 at 03:55 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nsm`
--

-- --------------------------------------------------------

--
-- Table structure for table `client_archive`
--

CREATE TABLE `client_archive` (
  `PhysicalID` varchar(32) NOT NULL,
  `BusyTime` time DEFAULT NULL,
  `LiveTime` time DEFAULT NULL,
  `ClientID` varchar(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `client_details`
--

CREATE TABLE `client_details` (
  `PhysicalID` varchar(32) NOT NULL,
  `IP` varchar(32) NOT NULL,
  `Username` varchar(32) NOT NULL,
  `Password` varchar(32) NOT NULL,
  `ClientID` varchar(32) NOT NULL,
  `Gateway` varchar(32) NOT NULL,
  `Maintainer` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `client_details`
--

INSERT INTO `client_details` (`PhysicalID`, `IP`, `Username`, `Password`, `ClientID`, `Gateway`, `Maintainer`) VALUES
('7c:67:a2:c9:6e:68', 'localhost', 'client', '1234', 'e133d897-05a0-4030-8b50-0ad36485', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `client_ip_table`
--

CREATE TABLE `client_ip_table` (
  `PhysicalID` varchar(40) NOT NULL,
  `IP` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `client_ip_table`
--

INSERT INTO `client_ip_table` (`PhysicalID`, `IP`) VALUES
('7c:67:a2:c9:6e:68', 'localhost'),
('7c:67:a2:c9:6e:68', 'localhost'),
('7c:67:a2:c9:6e:68', 'localhost'),
('7c:67:a2:c9:6e:68', 'localhost'),
('7c:67:a2:c9:6e:68', 'localhost'),
('7c:67:a2:c9:6e:68', 'localhost'),
('7c:67:a2:c9:6e:68', 'localhost'),
('7c:67:a2:c9:6e:68', 'localhost');

-- --------------------------------------------------------

--
-- Table structure for table `client_status`
--

CREATE TABLE `client_status` (
  `PhysicalID` varchar(32) NOT NULL,
  `Username` varchar(32) NOT NULL,
  `LiveSince` timestamp NULL DEFAULT NULL,
  `Live` int(1) DEFAULT NULL,
  `BusySince` timestamp NULL DEFAULT NULL,
  `Busy` int(1) DEFAULT NULL,
  `Memory_Usage` double DEFAULT NULL,
  `Total_Memory` double DEFAULT NULL,
  `CPU_Usage` double DEFAULT NULL,
  `TotalCPU` double DEFAULT NULL,
  `Network_Usage` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `client_status`
--

INSERT INTO `client_status` (`PhysicalID`, `Username`, `LiveSince`, `Live`, `BusySince`, `Busy`, `Memory_Usage`, `Total_Memory`, `CPU_Usage`, `TotalCPU`, `Network_Usage`) VALUES
('7c:67:a2:c9:6e:68', 'client', '2021-04-13 11:13:53', 1, NULL, 0, 1, 1, 1, 1, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `client_archive`
--
ALTER TABLE `client_archive`
  ADD UNIQUE KEY `PhysicalID` (`PhysicalID`);

--
-- Indexes for table `client_status`
--
ALTER TABLE `client_status`
  ADD UNIQUE KEY `PhysicalID_Check` (`PhysicalID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
