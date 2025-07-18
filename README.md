# README for Boilerplate Serverless Application

![AWS Lambda](https://img.icons8.com/color/48/000000/aws-lambda.png) ![CloudFormation](https://img.icons8.com/color/48/000000/aws-cloudformation.png) ![TypeScript](https://img.icons8.com/color/48/000000/typescript.png) ![Prisma](https://img.icons8.com/color/48/000000/prisma.png) ![MySQL](https://img.icons8.com/color/48/000000/mysql.png) 

---

## Project Overview

**Boilerplate Serverless** is a serverless application template that utilizes AWS Lambda, CloudFormation, TypeScript, and Prisma (MySQL) to provide a robust backend solution. This project serves as a foundational setup for developers looking to build scalable serverless applications on AWS.

---

## Tech Stack

- **AWS Lambda**: Serverless compute service that runs your code in response to events.
- **AWS CloudFormation**: Infrastructure as code service that allows you to define and provision AWS infrastructure.
- **TypeScript**: A superset of JavaScript that compiles to plain JavaScript, providing static typing.
- **Prisma**: A modern database toolkit that simplifies database access.
- **MySQL**: A popular relational database management system.

---

## Features

- **Serverless Architecture**: Built on AWS Lambda, allowing for automatic scaling and reduced operational overhead.
- **Infrastructure as Code**: Use of AWS CloudFormation for easy deployment and management of resources.
- **TypeScript Support**: Strongly typed codebase for better maintainability and developer experience.
- **Database Integration**: Easy integration with MySQL using Prisma for data management.

---

## Getting Started

### Prerequisites

To get started with this project, ensure you have the following installed:

- **AWS CLI**: Command Line Interface for managing AWS services.
- **SAM CLI**: Serverless Application Model Command Line Interface for building and testing serverless applications.
- **Node.js**: JavaScript runtime for executing server-side code.
- **Docker**: Container platform for running applications in isolated environments.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/christianmurillo10/boilerplate-serverless.git
   cd boilerplate-serverless

2. Install dependencies:

   ```bash
   npm install

### Building and Deploying

1. To build and deploy the application for the first time, run:
   ```bash
   sam build
   sam deploy --guided

### Local Development

## Running Locally

To run the application locally, use the following commands:

1. Build the application:

   ```bash
   make dev

2. Start the API locally:

   ```bash
   make start-api

3. Test the API

   ```bash
   curl http://localhost:3000
