# DevLog

> Devlog will **only be updated from `main` branch**. Please don't update it anywhere else.

## 11.05.22
- Add info on main document about swagger
- Decided to use Vue3 + Chakra
  - Easy to use + understand
  - Chakra is a godsend
  - Open for other possibility (tailwind?)
- Add info on retry strats using external

## 10.05.22
- Setup Swagger + JSDoc auto generate

## 08.05.2022
- RabbitMQ -> Create Setup, consumer, producer + setup with express
  - Very possible. Now PubSub is not hard
  - Backbone of the project going forward
- POC -> Create template with TS, middleware, linting for future uses
- Database 
  - Use MongoDB atlas
  - Create POC with Prisma as external ORM (type safety)
  - Use redis for caching. Faster response time
  - Set redis key/value pair, not available -> go to prisma (MongoDB)

## 06.05.2022
- Took a look into how to setup RMQ
  - Cloud hosted AMQP
  - Running local instance with docker
- Took a look into producer/consumer code snippets 
  - Express + AMQP -> Possible. Establish a connection once on server start
  - Consumer, not sure yet. See how it goes
- POC for AMQP coming soon

## 04.05.2022
- Migrated project board from Trello to github and do some grooming 
  - More automation!!
  - Automatic issue link with PR
  - Milestone and integrated iteration period (https://github.com/orgs/BA-LouisAndrew/projects/1/settings/fields/3897303)
- Create use case diagram and non-technical user stories out of it
  - High level, only describe what the system would do and who shall benefit from it
- CI/CD action to release 
  - Easier to track progress between meetings with profs (`/thesis` repo)
  - Copy-paste for other repos
- Add description to SQR criteria: refine. 
- Retry strats
  - Define what to do if external is not accessible
  - Design somewhat the API design for `retryStrategy` property

## 01.05.2022
- Created POC on SSE (Server Sent Events)
  - https://github.com/BA-LouisAndrew/poc/tree/server-sent-events
  - Might be the solution for default validation solution
  - Might solve the "individual check took a long time" issue
- Take a look into MQ (RMQ vs Kafka)
- Create front end for poc server (SSE)

## 30.04.2022
- Rethink async vs sync operation. More info take a look at `implementations/README`
  - Sequence diagram
  - User story
  - Use cases
- Create POC repo and tried out blocking event on node..
- Might use node to save time and just allocate free time on more concerning items
- What would happen if ALL communication is done via the MQ?
- Learn MQ!

## 29.04.2022
- Write crteria based on ISO 
- Tried citing ISO articles from the website
- Refined analysis stage
- Wrote tickets for implementation spike
- **Implementation**
  - Took a look into FDS tech stack
  - Seems that node is the best lang to use. Node is **NOT GOOD** for heavy CPU-intensive processes.
  - Taking into consideration -> What if external service takes a long time to respond?
  - Alternative might be Kotlin or whatever. Golang might not be suitable as the libraries are not mature enough (Osvaldo)
  - Exploring possibility of async operations with the FDS
  - Intensive research on Redis -> Can be used for pubsub pattern 
    -  https://www.youtube.com/watch?v=jgpVdJB2sKQ&ab_channel=WebDevSimplified
    -  https://redis.io/docs/manual/pubsub/#programming-example
- Watched golang tus video

## 27.04.2022
- Continued working on sequence diagram
- Add another use case where the UI would be updated progressively (shows the progress of the validation)
- Elaborate on the sequence diagram (use case I and II) 
- Write some user story that can be generated out of the diagrams
- Created events and milestones on GCAL for this project
  - Milestones are optimistic views -> 14 weeks in total
  - Written the milestone with the prediction, that the official start date would be 23.05
- **NEXT UP** -> https://trello.com/c/aZPexu8W/21-criterias