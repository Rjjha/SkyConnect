#  Database Desgin Problem
   ### What issues may arise while booking in current setup?
   1. Same Seat selection by two users at the same time for the same Flight
   2. One seat and two or more users trying to book it at the same time : Concurrency
   3. During payment there may be a chance of failure of payment gateway
   4. If payment is successful but client crashes before booking is confirmed


## Transactions in Database
> For example, if we are transferring money from one account to another, we need to first debit money from one account and then credit it to another account. If any of these two operations fails, the whole transaction fails. In such cases, we need to ensure that either both the operations succeed or fail together. This is where transactions come into picture.

In real life scenario, we might need to execute a series of queries in order to accomplish a single task. 
We might do a club of CRUD operations. These series operations can exectue a single unit of work and hence these series of operations are called Database transactions.

Now during the transaction execution our DB might go through in a lot of changes and can be in an inconsistent state.
In such situation ACID properties of DB comes into picture.

#### States of a Trasaction
 1. Begin : The transaction begins.
 2. Commit : All the changes are applied successfully.
 3. Rollback : Something happened in between and whatever changes were successfully will be reverted.

## ``` ACID stands for Atomicity, Consistency, Isolation, Durability.  ```

### Atomicity
A trasaction is a bundle of statement that intends to achieve one final state. When we are attempting a trasaction, we either want to complete all the statement or none of them. We never want an intermediate state. This is called Atomicity.


### Consistency
Data stored in the DB is always valid in a consitent state. All the constraints are satisfied. For example, if we have a constraint that a particular column cannot be null, then the DB will always ensure that the column is not null.

### Isoaltion [IMP]
It's an ability of multiple transaction to execute without interfering with one another.

Q. Can isolation make the DB slower?
Ans. Yes, because it has to ensure that the transaction are not interfering with each other. But we don't need isolation everytime and hence we can set the isolation level. So we can also have parallel execution of transaction.

### Durability
If something changed in the DB and any unexpected event occurs then our changes should persist. For example, if we have a power failure or system failure then our changes should not be lost.

## Execution Anomalies
1. Read-Write Conflict
2. Wrire-Read Conflict
3. Write-Write Conflict


## How Databases ensure Atomicity?
1. Logging : DBMS logs all actions that it's doing so that later it can undo it.
2. Shadow Paging : DBMS makes copies of actions/pages. This copy is initially considered as a temporary copy. If the transaction is successful then it starts pointing to the new temporary copy.

# Atomicity in MySQL
After each commit or rollback, database remains in a consistent state.
In order to handle rollback there are two types of logs: UNDO and REDO logs.

##### Undo logs : 
This log contains records about how to undo the last change done by a transaction. If any other transaction need the original data as a part of consistent read operation the unmodified data is retrieved from the undo log.

##### Redo logs :
By definition, redo logs is a disk based data structure used for crash recovery to correct data written by incomplete transactions. The changes which could make it upto the data filles before the crash or any other reasons are reapplied automatically during restart of the server after a crash.

Refer  : https://en.wikipedia.org/wiki/Isolation_(database_systems)

### ISOLATION LEVELS

#### 1. Read Uncommitted
There is almost no isolation. One transaction may see not-yet-committed changes made by other transactions. So dirty reads, non-repeatable reads and phantom reads are possible.

#### 2. Read Committed
Here dirty reads is avoided, because any uncommited changes are not visible to any other trasactions until we commit.
In this level, each select statement will have it's own snapshot of data which can be problematic if we execute the same select statement again, because some other transaction might commit an update and we will see new data in the second select. 

#### 3. Repeatable Read
A snapshot of select is taken first time it runs during a transaction and same snapshot is used throughout the transaction,when same select is executed.
A txn running at this level does not take into account any changes to data made by other transactions.
But this bring us to phantom reads problem, i.e. a new row can exist in between txn which was not before.

#### 4. Serializable
It completely isolates the effect of one txn from others. It is a repeatable read with more isolations to avoid phantom reads.


# Durability in MySQL
The DB should be durable enough to hold all the latest updates even if system fails or restarts. 
If a txn updates a chunk of data in DB and commits. The DB will hold the new data. If txn commits but system fails before data could be return then data should be return back when system restarts.

> MySQL storage engine : InnoDB

# Consistency in MySQL
Consistency in InnoDB involves protecting data from crashes and main data integrity and consitency.
Two important features of InnoDB are:
1. Double write buffer
2. Crash Recovery

### Page  : 
It's a unit that specify how much data can be transferred between disk and memory. A page can contain one or more rows. If one row doesn't fit in the page InnoDB sets up additional pointers style data structures so that whole info of one row can go in a page.

### Flush :
When we write something to the database, it is not written instantly for performance reasons in MySQL. It instead stores that either in memory or in a temporary disk storage space. InnoDB storage structure that are periodically flushed include redo logs, undo logs and buffer pool.
Flushing can happen because a memory area became full and system needs to free some space because if there is a commit involes then txn has to be finalized.

## Double write buffer
It is a storage area where InnoDB writes pages flushed from buffer pool before writing the pages to their position in data files. If a system crashes in middle of a page write, InnoDB can find a good copy from double write buffer.


#  Race Condition
## Locking Mechanism

1. Shared Locks :
It allow multiple txn to read data at the same time but restrict any of them from writing.

2. Exclusive Locks :
This prevents txn from reading or writing data at the same point of time.

3. Intention Locks :
This is use to specify a txn is planning to read or write a certain section of data.

4. Row level Locks :
This allows txn to lock only a specific row.


MySQL : MVCC (Multi Version Concurrency Control) type database
It allow multiple txn to read or write same data without much conflict.

Every txn in MySQL sort of capture the data it is about to modify at start of txn and write the change to an entirely different version of data. This is called MVCC.

# BOOKING FLIGHTs MECHANISM

## Problems:

## 1. Same Seat Selection

## 2. There are two concurrent bookings for one seat
- The Booking Mechanism depends on payments. 
- When u are playing with someone's payments u have to be very careful.
- The same seat has been selected by two users, but neither has started the booking process.
- As soon as both users started the booking process.
- The request which reaches the server first with milli/micro/nano seconds difference gets blocked for 10 mins and block key is sent back. [Dependent on network speed]
- Other requests get block fail response.
- Successful request has 10 mins to book the ticket using the block key.
- We need to complete payment, booking confirmation and user notifications like email and sms with in 10 mins.
- After 10 minutes ticket is released to all if the ticket is not confirmed.

## 3. During the processing of the payment request/response, the payment fails, etc.
- The client tries to make a payment, and the payment went through but while returning the response something went wrong.
- In this type of cases, people do double payment transactions for the same booking.
- Although the transaction is already done u just have not yet received the notification.
- U end up loosing ur money twice.
- By mistake, the users have initiated 2 payment requests for the same booking. 
- 2 payment requests from the same user for the same booking ID should not go parallelly at the same point of time. But one after another they can definitely go.

**To solve this issue there is a concept known as IDEMPOTENCY.**

# IDEMPOTENCY

**IDEMPOTENCY** -> It is a property of certain operations in maths and computer science where they can be applied multiple times without changing the result beyond the first application.
eg.
U made a payment request and the payment has been made, but by mistake, u initiated another(second) payment request. Now the first request has already made the payment so only the first request will be applied and the second request will not be applied and will not show any effect. In case the first request was not successful and failed, then we will definitely try to apply for the second request.

### IDEMPOTENT APIs

When an HTTP method is idempotent in a REST API, this means that if you send multiple identical requests, only the initial request would cause a change. Therefore, the results returned to the user will not depend on how many times the method has been called.

When you make a payment online, you expect it to process without double charging your card. If it does double charge you, this creates a negative customer experience that may push you away from the business forever — costing the company your lifetime value as a customer. 

If you are on the other end of this transaction, building the API to process payments, you can use the API idempotency to prevent issues like this from happening in the first place.

**To make an API idempotent, you have to send an IDEMPOTENCY KEY.** Idempotency keys are unique tokens that you submit as a request header, that guarantee that only one resource will be created regardless of how many times a request is sent to us. If the request fails, then it's perfectly safe to retry as long as you use the same idempotency key.  

**Working of IDEMPOTENCY APIs :**

- Client generates a unique idempotency key: The client includes a unique identifier, often in the form of a [UUID](https://www.npmjs.com/package/uuid) (Universally Unique Identifier), in the request header or body before sending the API request. This key should be generated by the client and should remain consistent for subsequent retries of the same operation.

- Server processes the request: When the server receives the API request, it checks if the idempotency key has been used before. If the key is new, the server processes the request normally. If the key has been used previously, the server recognizes it as a duplicate request and ignores the redundant processing.

- Server stores the idempotency key: Upon processing the request successfully, the server associates the idempotency key with the operation's result or outcome. It may store this association temporarily or persistently, depending on the specific implementation.

- Response handling by the client: The server responds to the client's API request, providing the outcome of the operation. The client can inspect the response to determine whether the request succeeded or failed. If the client receives an error response or does not receive any response within a specified timeout, it can choose to retry the request using the same idempotency key.

- Retries and idempotent behavior: If the client retries the same request with the same idempotency key, the server recognizes it as a duplicate request based on the key and again ignores redundant processing. The server responds with the same outcome as the original request, ensuring that repeating the operation does not cause any unintended side effects.

We can store the IDEMPOTENCY KEYs in the 

- DB 

    - Drawback: Retrieving from DB takes a time

- CACHE DB
    - Redis is an open-source data structure store that is primarily used as a database, message broker, or cache.


- Memory Object

    - Simple implementation
    - Drawback: If the server goes down the object will also go down
    
Learn more about IDEMPOTENT APIs at the following link
- [LINK](https://blog.hubspot.com/website/idempotent-api)



</br>
</br>

# Booking Systems - Race Conditions

**In Booking Systems,  there can be multiple cases of  Race Conditions.**

To handle these kinds of race conditions we can implement 2 different kinds of mechanisms. 

- Pessimistic Concurrency Control

- Optimistic Concurrency Control 

In our Booking Flights System we are going to use:

- Optimistic Concurrency Control [Manual Checks]

- Pessimistic Concurrency Control [Serializable Isolation Level]
