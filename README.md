# BE-SONIQUE

## Project Overview

Sonique is a personal practice project inspired by Spotify, built as a collaborative effort with friends. The goal is to create a modern and feature-rich music streaming platform, allowing users to discover, play, and manage their favorite tracks seamlessly.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 20 or later)
- [pnpm](https://pnpm.io/) (version 9 or later)
- [PostgreSQL](https://www.postgresql.org/) (for local database setup)

## Development Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/AungKyawPhyo1142/be-sonique
   cd be-sonique
   ```

2. **Set up environment variables**:

   - Copy the `.env.example` file to `.env`.
   - Update only the `DATABASE_URL` in your `.env` file with your local PostgreSQL connection string.

3. **Install pnpm**:
   If you don’t have pnpm installed, use the following command to install it globally:

   ```bash
   npm install -g pnpm
   ```

4. **Run the initialization command**:
   Run the following command to install dependencies, run Prisma commands, and start the development server:
   ```bash
   pnpm dev
   ```

## Contributers

  

- [Sebastian Kein (AungKyaw Phyo)](https://github.com/AungKyawPhyo1142)
- [Nyi Nyi Soe](https://github.com/Nyi-NyiSoe)
- [Kyi Thant Sin](https://github.com/KyiThantSin)
- [Linn Latt Cho](https://github.com/linnlatt132)
