# Flight Booking System

## Description
This is an Airline managemnet and flight booking system based on microservices architecture. It has 4 microservices:
1. Flight Service
2. Booking Service
3. Authentication Service
4. Notification Service

## Non Functional Requirements
Non functional Requirements
1.  We can expect more flight searching than bookings
2.  The system needs to be reliable in terms of booking
3.  Expect that we will be having 100k total users.
4.  100k bookings might come up in quarter
5.  In one day you might be getting 100 bookings
6.  System should make sure that we don?t change the prices where the
    booking payment is going on.
7.  System should be able to auto scale itself atleast for 3x more traffic.

## Design

![HLD](https://github.com/Rjjha/Flight-Management-Service/assets/96972257/f18d40e3-3dde-4d8b-aced-0c2b177140e6)

## ER Diagram

### For Flights DB
![er](https://github.com/Rjjha/Flight-Management-Service/assets/96972257/40174983-4166-42fe-9da9-acb6fdd3c130)

### For Notification DB
![notificationdb](https://github.com/Rjjha/Flight-Management-Service/assets/96972257/c1881818-54a0-4535-825e-40e69b47c416)


## Functionalities
1. Flight Service : CRUD operations on all flight db models
2. Booking Service : Book or cancel a booking
3. Notification Service : Send email notifications to users on booking, cancellation. Run CRON jobs to check for        upcoming flights and send notifications.
4. Authentication Service : Signin, Signup,Rate Limiting and Reverse proxy for Flight Search and Booking Service 

## Tech Stack
1.  NodeJS
2.  ExpressJS
3.  MySQL
4.  Sequelize
5.  RabbitMQ
6.  NodeMailer
7.  JWT
8.  Docker
