-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 03, 2021 at 05:14 PM
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
-- Table structure for table `a`
--

CREATE TABLE `a` (
  `TimeStamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `Token` varchar(40) NOT NULL,
  `Dest` varchar(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `c1`
--

CREATE TABLE `c1` (
  `TimeStamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Token` varchar(40) NOT NULL,
  `Dest` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `c2`
--

CREATE TABLE `c2` (
  `TimeStamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Token` varchar(40) NOT NULL,
  `Dest` varchar(2) NOT NULL
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

--
-- Dumping data for table `filetransfer`
--

INSERT INTO `filetransfer` (`src`, `dest`, `hash`, `serviceID`) VALUES
('s2', 's3', '5d4a2315727d61ea103570c5e61fe603', ''),
('s2', 's3', '5d4a2315727d61ea103570c5e61fe603', ''),
('s2', 's3', '5d4a2315727d61ea103570c5e61fe603', '08166fe9-4063-422e-8a3a-d2eef70cfc69'),
('s2', 's3', '5d4a2315727d61ea103570c5e61fe603', '1aa48c0a-d885-4a0b-bebb-76bd50db95bd'),
('s2', 's3', '5d4a2315727d61ea103570c5e61fe603', '15e89d15-33e2-4a92-abfa-a3e145076550'),
('s2', 's3', '5d4a2315727d61ea103570c5e61fe603', 'ec368e0c-aa25-4e7b-a56d-afd7ddc708c3'),
('s2', 's3', '5d4a2315727d61ea103570c5e61fe603', '11ca566d-21bd-4423-a724-086fd09a4f71'),
('s2', 's3', '5d4a2315727d61ea103570c5e61fe603', '45855360-8de4-4d7d-b111-c010b44a031f');

-- --------------------------------------------------------

--
-- Table structure for table `s1`
--

CREATE TABLE `s1` (
  `TimeStamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Token` varchar(40) NOT NULL,
  `Dest` varchar(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `s1`
--

INSERT INTO `s1` (`TimeStamp`, `Token`, `Dest`) VALUES
('2021-04-03 14:58:47', '02fcfbf0-9c14-4849-a4c6-812c6bf1bd98', 's2'),
('2021-04-03 14:49:06', '08b3ecf8-e5d5-4d92-8f53-49df0aa749e9', 's2'),
('2021-04-03 14:57:28', '276e3f6f-6177-415a-af9a-0175a46ae038', 's2'),
('2021-04-03 15:02:06', '85adf865-1398-4f0b-9486-4ce3db874290', 's2'),
('2021-04-03 14:19:15', '93146458-ed10-4f30-8278-22b430c6c874', 's2'),
('2021-04-03 14:36:50', 'a41d1b58-0e78-4504-88ce-80c2532afd24', 's2'),
('2021-04-03 14:23:49', 'b2d01050-1e63-45f7-8e91-dafb58c79266', 's2'),
('2021-04-03 14:10:46', 'b9e72a8f-49ef-4ac9-a3da-d3ae62064486', 's2'),
('2021-04-03 14:13:45', 'c685ee4f-625e-4baa-ab30-b3fbed08f046', 's2'),
('2021-04-03 14:43:25', 'e63f8c5b-df22-4d6a-b905-ca363753553a', 's2'),
('2021-04-03 14:51:39', 'ebe74e24-a39d-4a89-8f69-19cdc2eed8af', 's2'),
('2021-04-03 14:32:09', 'ec4c497c-5b6f-413e-ac19-797aefe8754f', 's2');

-- --------------------------------------------------------

--
-- Table structure for table `s2`
--

CREATE TABLE `s2` (
  `TimeStamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Token` varchar(40) NOT NULL,
  `Dest` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `s2`
--

INSERT INTO `s2` (`TimeStamp`, `Token`, `Dest`) VALUES
('2021-04-03 14:57:28', '707d7d00-e745-472a-8423-3112828c215b', 's3'),
('2021-04-03 14:10:46', '737bfece-6bc5-4cd2-a748-6d21b8aeb9be', 's3'),
('2021-04-03 14:19:15', '772b1fcb-c234-407a-a142-dee66194c375', 's3'),
('2021-04-03 14:32:09', '80e29721-179a-491b-83b8-2f6fe55f63c9', 's3'),
('2021-04-03 14:49:06', '84c6f0aa-2ad1-449b-a237-b9e52fe7340e', 's3'),
('2021-04-03 14:51:39', '9376f59e-b929-4924-9a72-d26546ce68cb', 's3'),
('2021-04-03 14:13:45', 'acb3853d-1578-4920-b0fe-923f0fc3a33e', 's3'),
('2021-04-03 15:02:06', 'c3459dd6-60e9-4d2b-9a71-655d3b9c155f', 's3'),
('2021-04-03 14:36:50', 'c3b09cac-f69b-486f-860f-f59f38088123', 's3'),
('2021-04-03 14:58:47', 'c95a4516-a488-4455-b824-f76d3fc485cc', 's3'),
('2021-04-03 14:43:25', 'c987e17c-d697-4b1e-b142-fc303bcc6064', 's3'),
('2021-04-03 14:23:49', 'ff498b6b-1a68-4845-8d4b-79265965c2ce', 's3');

-- --------------------------------------------------------

--
-- Table structure for table `s3`
--

CREATE TABLE `s3` (
  `TimeStamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `Token` varchar(40) NOT NULL,
  `Dest` varchar(2) NOT NULL
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
('2021-04-03 14:19:15', '0296bb88-4318-4462-91c9-dc4b7fcecfc3', 's1'),
('2021-04-03 14:02:41', '0e6b76d6-c1aa-492d-bc7e-7378fa7e2c45', 'a'),
('2021-04-01 08:13:46', '111056a3-b67b-461e-bcea-269c8b7caad9', 's1'),
('2021-04-01 06:05:37', '15e45491-de6a-43ab-b3ad-e07522638f38', 's1'),
('2021-04-03 14:43:20', '19cf6c21-a43d-47eb-8f5f-e930e49f9031', 'a'),
('2021-04-03 14:32:09', '28d54e94-bd5f-4b79-92eb-efccf2bd56bc', 's1'),
('2021-04-03 14:10:46', '319951f1-01fe-40bb-ab42-10d868ab6788', 's1'),
('2021-04-01 07:12:47', '373b6c65-b0c6-4a9c-baaa-192be5dfa2a5', 's1'),
('2021-04-03 12:22:17', '3bdbe902-904e-46cd-be12-0c792b482243', 'a'),
('2021-04-03 12:38:02', '3d5d3d87-6e51-4e40-8a04-98c5fce7284d', 'a'),
('2021-04-03 14:36:49', '3f133148-59d6-43a3-a153-35f8b7d75f5b', 's1'),
('2021-04-03 14:43:25', '4107525c-a906-4e0b-b860-c94bb160c249', 's1'),
('2021-03-26 08:55:07', '415105f4-bb21-4cd2-8bd6-2259aad7a2e3', 's1'),
('2021-04-03 14:58:43', '459bade4-fd1d-4481-a391-6196e069767a', 'a'),
('2021-04-03 14:19:11', '471bbbf2-0eb0-4ca2-acd1-d092f0ab8de9', 'a'),
('2021-04-03 13:32:10', '4990c7b4-44ce-417e-973b-316313ca1beb', 'a'),
('2021-04-03 15:02:02', '4d519a11-ef49-4832-aaea-c291f394d21f', 'a'),
('2021-04-03 13:11:16', '6474f4d0-ef06-42ff-9d0d-1da6b6ecfa7d', 'a'),
('2021-04-03 13:30:06', '64b59fe9-4691-4322-8e8f-9d343fcfeda5', 'a'),
('2021-04-03 12:48:00', '67d6258d-3120-4787-8645-06f7b55aa101', 'a'),
('2021-04-03 13:13:16', '6d1a4686-16a2-452e-9b6e-7fc53a64f30f', 'a'),
('2021-04-03 12:40:58', '6d2d2343-c29c-4da6-9664-dcc9be98a0ac', 'a'),
('2021-04-03 14:32:05', '73e98302-dfd1-492f-aeb5-220feec987b9', 'a'),
('2021-04-03 14:02:46', '7a3c3529-b156-42bd-b02c-7cdbad7162f2', 's1'),
('2021-04-01 05:44:29', '7a860f2d-fcd9-461e-932b-045ce09d6503', 's1'),
('2021-04-03 14:51:39', '8e0bc8f6-3cd4-4bfb-9f6c-6c55e90ecebe', 's1'),
('2021-04-01 08:06:31', '909bde46-b6c6-4d1e-80da-13a1670dfae1', 's1'),
('2021-03-26 14:41:33', '92dd9792-8bae-4bae-a792-20a38d1f670d', 's1'),
('2021-04-03 13:32:23', '9539df1c-efa0-4f0e-b259-0ebded1be416', 's1'),
('2021-03-26 09:02:10', '95bc4360-720d-4d1c-b2ee-d8f54a72c0f6', 's1'),
('2021-04-03 15:02:06', '9bb87402-6dd2-4c7a-bff5-3edf00351c20', 's1'),
('2021-04-03 14:13:45', '9db7b3e0-2bdb-4b67-a6bd-bff5779afb6a', 's1'),
('2021-04-03 13:30:11', 'a3d6a19b-e4db-46a4-a3a3-2edaa38ae2e4', 's1'),
('2021-04-03 14:10:42', 'aa92f2cc-fe0e-46cd-91fa-65ebd8467d80', 'a'),
('2021-03-26 08:54:06', 'ab03172a-a113-4141-9198-f3eae8df8b6e', 's1'),
('2021-04-03 14:49:06', 'afe2739b-5950-4fc0-ba42-124cde8d411d', 's1'),
('2021-04-01 05:42:35', 'b325e19a-2baf-42d0-af14-ddb05fdd8e01', 's1'),
('2021-03-26 08:40:34', 'b328d412-3dbd-4116-b510-c1494a85', 's1'),
('2021-04-03 12:18:46', 'bc36175d-fcd5-48c4-98f6-f118dae651aa', 'a'),
('2021-04-01 07:50:05', 'c2da4585-19b1-4aec-9850-970f12827bd4', 's1'),
('2021-04-01 07:48:53', 'c3a63481-fff6-42bc-8b37-300233ccd645', 's1'),
('2021-04-03 14:49:02', 'c7892c66-99d0-4a17-80ef-abf215f41ac2', 'a'),
('2021-04-03 14:23:45', 'c93ee82d-e307-41f7-b751-fa153113b519', 'a'),
('2021-04-03 14:13:38', 'cdab1e27-52c1-4f87-a1a2-6b75eac15081', 'a'),
('2021-04-03 12:35:34', 'd1ca8e6c-0562-4a7b-acf0-bc461854e3f8', 'a'),
('2021-04-03 14:58:47', 'd1d2c706-e2cf-4aa2-8b00-1fcac5a18f6e', 's1'),
('2021-03-26 14:16:23', 'd1dd85d9-62b1-4787-9352-a9c25f33c5eb', 's1'),
('2021-04-03 14:57:24', 'd28388df-f5b0-4379-90f0-3f1471385989', 'a'),
('2021-04-01 07:16:00', 'd3aee8cf-81f7-47bb-ab2d-af7ec372b2e8', 's1'),
('2021-04-03 12:44:15', 'd94d359d-703a-4d13-9e5d-3cf38ee34a87', 'a'),
('2021-04-03 13:14:54', 'dd06c343-ae36-49de-9c24-6667dc2e73ab', 'a'),
('2021-04-03 13:15:28', 'dfb645a1-158d-4a7d-b903-182fbaea8d05', 'a'),
('2021-04-03 14:36:46', 'e11ee4de-4643-4ab5-990f-02bcfe3ae278', 'a'),
('2021-04-01 07:11:46', 'e23ad62c-cbad-4b77-b0f1-684929ebcc42', 's1'),
('2021-04-03 12:32:54', 'e6f5a280-5d86-4fec-b609-c42aabfbccb1', 'a'),
('2021-04-03 14:57:28', 'e76e0021-fab6-4c89-84f7-1d2037c1ba3b', 's1'),
('2021-04-03 14:51:33', 'eacaf6ef-ae37-46ac-8a16-b833b5b7540c', 'a'),
('2021-03-26 09:00:56', 'ec5a4de5-ab88-42c6-8c91-86278a00b42b', 's1'),
('2021-04-03 12:25:32', 'f25c221d-e03b-40ee-829b-8531e413fbcf', 'a'),
('2021-04-01 05:55:26', 'f3f8f904-81a9-4631-b0fa-e13ce08399ce', 's1'),
('2021-04-01 06:12:15', 'f45c1665-95ca-4672-a248-71d1d4e940c1', 's1'),
('2021-04-03 14:50:58', 'f8b211a4-185f-4256-8668-f7526806d33f', 'a'),
('2021-04-03 14:23:49', 'f968fad4-dab0-4083-a528-7fb491ad6c74', 's1');

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
