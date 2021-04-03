-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 03, 2021 at 09:17 AM
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
-- Database: `ic2_doctor`
--

-- --------------------------------------------------------

--
-- Table structure for table `c1`
--

CREATE TABLE `c1` (
  `TimeStamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Token` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `c2`
--

CREATE TABLE `c2` (
  `TimeStamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Token` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `filetransfer`
--

CREATE TABLE `filetransfer` (
  `src` varchar(2) NOT NULL,
  `dest` varchar(2) NOT NULL,
  `hash` varchar(200) NOT NULL,
  `serviceID` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `s1`
--

CREATE TABLE `s1` (
  `TimeStamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Token` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `s2`
--

CREATE TABLE `s2` (
  `TimeStamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Token` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `s3`
--

CREATE TABLE `s3` (
  `TimStamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Token` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `w1`
--

CREATE TABLE `w1` (
  `TimeStamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Token` varchar(40) NOT NULL,
  `Dest` varchar(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `w1`
--

INSERT INTO `w1` (`TimeStamp`, `Token`, `Dest`) VALUES
('2021-04-01 08:13:46', '111056a3-b67b-461e-bcea-269c8b7caad9', 's1'),
('2021-04-01 06:05:37', '15e45491-de6a-43ab-b3ad-e07522638f38', 's1'),
('2021-04-01 07:12:47', '373b6c65-b0c6-4a9c-baaa-192be5dfa2a5', 's1'),
('2021-03-26 08:55:07', '415105f4-bb21-4cd2-8bd6-2259aad7a2e3', 's1'),
('2021-04-01 05:44:29', '7a860f2d-fcd9-461e-932b-045ce09d6503', 's1'),
('2021-04-01 08:06:31', '909bde46-b6c6-4d1e-80da-13a1670dfae1', 's1'),
('2021-03-26 14:41:33', '92dd9792-8bae-4bae-a792-20a38d1f670d', 's1'),
('2021-03-26 09:02:10', '95bc4360-720d-4d1c-b2ee-d8f54a72c0f6', 's1'),
('2021-03-26 08:54:06', 'ab03172a-a113-4141-9198-f3eae8df8b6e', 's1'),
('2021-04-01 05:42:35', 'b325e19a-2baf-42d0-af14-ddb05fdd8e01', 's1'),
('2021-03-26 08:40:34', 'b328d412-3dbd-4116-b510-c1494a85', 's1'),
('2021-04-01 07:50:05', 'c2da4585-19b1-4aec-9850-970f12827bd4', 's1'),
('2021-04-01 07:48:53', 'c3a63481-fff6-42bc-8b37-300233ccd645', 's1'),
('2021-03-26 14:16:23', 'd1dd85d9-62b1-4787-9352-a9c25f33c5eb', 's1'),
('2021-04-01 07:16:00', 'd3aee8cf-81f7-47bb-ab2d-af7ec372b2e8', 's1'),
('2021-04-01 07:11:46', 'e23ad62c-cbad-4b77-b0f1-684929ebcc42', 's1'),
('2021-03-26 09:00:56', 'ec5a4de5-ab88-42c6-8c91-86278a00b42b', 's1'),
('2021-04-01 05:55:26', 'f3f8f904-81a9-4631-b0fa-e13ce08399ce', 's1'),
('2021-04-01 06:12:15', 'f45c1665-95ca-4672-a248-71d1d4e940c1', 's1');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `c1`
--
ALTER TABLE `c1`
  ADD UNIQUE KEY `token_unique` (`Token`);

--
-- Indexes for table `c2`
--
ALTER TABLE `c2`
  ADD UNIQUE KEY `token_unique` (`Token`);

--
-- Indexes for table `s1`
--
ALTER TABLE `s1`
  ADD UNIQUE KEY `Token` (`Token`);

--
-- Indexes for table `s2`
--
ALTER TABLE `s2`
  ADD UNIQUE KEY `token_unique` (`Token`);

--
-- Indexes for table `s3`
--
ALTER TABLE `s3`
  ADD UNIQUE KEY `Token_Unique` (`Token`);

--
-- Indexes for table `w1`
--
ALTER TABLE `w1`
  ADD UNIQUE KEY `unique_token` (`Token`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
