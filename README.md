# Recycognize

## Table of Contents
1. [Introduction / Description](#introduction--description)
2. [Problem Statement / Motivation](#problem-statement--motivation)
3. [Features](#features)
4. [Architecture / Tech Stack](#architecture--tech-stack)
5. [Installation / Getting Started](#installation--getting-started)
6. [Usage](#usage)
7. [Credits / Acknowledgements](#credits--acknowledgements)

## Introduction / Description
Recycognize, an AI-powered Smart Reverse Vending Machine (RVM) ecosystem focused on beverage packaging—plastic, aluminum, glass, and Tetra Pak.

How our solution works:
1. RVMs provide rewards to consumers for depositing recyclable beverage packaging. The rewards are funded directly by beverage Fast Consumer Moving Goods (FMCG) companies and redeemed through a mobile app.
2. Each deposited item is scanned using computer vision to detect material, brand, and contamination.
3. RVM creates verified ESG datasets that beverage FMCG companies can use for sustainability reporting and Extended Producer Responsibility (EPR) compliance.

In short:
Consumer deposits packaging → RVM generates ESG data → beverage FMCG funds rewards to consumers → Packaging is recycled.
This creates a win–win loop system for consumers, beverage FMCG companies, and the environment.

## Problem Statement / Motivation
In Malaysia, 6.96% of recyclables were not recycled in 2022—equivalent to nearly 1 million tonnes of recyclables ended up in landfills and an estimated RM291 million in lost value.

Why this happens:
1. Low motivation for Malaysians to perform separation-at-source
2. Limited access to recycling bins at households and premises
3. High contamination of recyclables

## Features
1. Consumer Mobile App (React Native/Expo)
- Consumers scan RVM QR codes for authentication
- Earn points, redeem rewards
- Track recycling history

2. RVM Scanner (AI Interface)
- Powered by Roboflow API for brand, material, and contamination detection
- Real-time item acceptance / rejection
- Instant reward distribution
- Parallel data streaming to DynamoDB

3. Beverage FMCG ESG Dashboard (Next.js + Tailwind CSS)
- ESG reporting data
- Analytics & visualizations (Recharts)
- CSV export capability

## Architecture / Tech Stack
- **Frontend:** React Native + Expo (Consumer App), Next.js + Tailwind CSS (ESG Dashboard)
- **Backend:** AWS Lambda (Python), Amazon API Gateway, Amazon Cognito
- **AI/ML:** Roboflow for image recognition
- **Database:** AWS DynamoDB
- **Cloud Services:** AWS
- **Charts and analytics:** Recharts
- **Image storing:** Cloudinary
- **Other:** Node.js, Python

## Installation / Getting Started
### Prerequisites
- Node.js (v14+ recommended)
- Python (v3.8+ recommended)
- AWS account (for Lambda and DynamoDB)
- (Optional) Docker for containerized deployment

### Steps
1. Clone the repository:
   ```powershell
   git clone https://github.com/rachelfong0320/Recycognize.git
   ```
2. Install dependencies for the Consumer App:
   ```powershell
   cd "Consumer App"
   npm install
   ```
3. Install dependencies for ESG Dashboard:
   ```powershell
   cd "../ESG Dashboard/AWS-Hackathon-main"
   npm install
   ```
4. Set up AWS Lambda functions:
   - Configure your AWS credentials.
   - Deploy Python scripts in `AWS-lambda/` to AWS Lambda.
5. (Optional) Set up environment variables as needed for API keys and AWS credentials.

## Usage
- **Consumer App:**
  - Start the app:
    ```powershell
    npm start
    ```
  - Use Expo Go or a compatible emulator to run the mobile app.
- **ESG Dashboard:**
  - Start the dashboard:
    ```powershell
    npm run dev
    ```
  - Access the dashboard via `http://localhost:3000` in your browser.
- **AWS Lambda Functions:**
  - Deploy and manage via AWS Console or CLI.

## Credits / Acknowledgements
Team members:
- Rachel Fong
- Rachel Teoh 
- Chai Li Chee
- Kang Yi Yao
