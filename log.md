# DevLog

## 07.06.22
- 80% is done. Moving on to the writing part

## 06.06.22
- Project is quite in a good shape now. Will work on the service that listens to the MQ tomorrow
- 80% is here. After working on service that listens -> Going to start the writing part real soon
- E2E test might not be ready for now, but let's see where it goes!
- Lob API -> Only 300 requests per month! Shutting the rule down for now
- Do I need to build a service ONLY for the external checks, or is it enough with the current setup for the demo (external checks live within FDS)
- Other refinements + enhancement tickets will be done on later stages. Add tickets to the board!

## 29.05.22
- Been taking quite some days off to first take a step back before really focusing on writing the thesis
- Going to talk with Raoul tomorrow about the current status and ask for time to focus solely on the thesis
- More or less the app is kinda ok now, still quite some things needs to be done, but overall not bad

## 25.05.22
- Just received the confirmation from uni
- Might not be going to update this log for dev stage

## 19 + 20.05.22
- Done with FDS rules CRUD
  - Swagger spec, validation, MVC pattern
  - Unit test
  - Integration test with `supertest`
- CI/CD update with prisma `npx prisma generate`
- Whitelist mongo

## 17.05.22
- Starting to work on project setup on backend + front end
  - Backend
    - Deployment on Heroku -> Better visibility on what's going on
    - MongoDB Atlas for easier connection ("*Cloud Native*")
    - Heroku-addon redis
  - Frontend
    - Netlify -> Github actions
## 16.05.22
- Add request parameter + body
  - Update figma file
- Got confirmation from Prof. Schmidt that it's okay to start now. Creating "real" repos!

## 15.05.22
- Create mockups in figma for all files!
  - Quite a big progress here ngl. Figma link: https://www.figma.com/file/5Egt43HhE16AZfy0TqZwWa/Bachelorarbeit---Mockups?node-id=504%3A4793
- Going to use naive-ui rather than chakra for the front end component library (Chakra is made for Vue 2.x)

## 14.05.22
- Tried out TSOA MVC + blocking process. It's very fine
- Used Redis as primary data source (see implementation/readme for more info)
- Groomed UI mockup tickets
- Download resource on
  - Stateless web service
  - Why exception handling might not be the best idea

## 13.05.22
- Checked out tsoa: https://tsoa-community.github.io/docs/getting-started.html
  - Better swagger generation
  - MVC pattern
  - First class TypeScript support
- Created model for customer and validation rule.
- Create POC on tsoa: https://github.com/BA-LouisAndrew/poc/tree/ft/II/58--tsoa

## 12.05.22
- Create system diagram
- Create SW architecture diagram
- Create architecture + tech stack diagram
- Took a look into scientific papers abt MVC
- Took a look into JSON-rules engine
  - Not going to use it
  - Build something more suitable
  - Evaluating conditions, but not per se a rules engine
- Create model for validation rule. Heavily inspired by `json-rules-engine`

## 11.05.22
- Add info on main document about swagger
- Decided to use Vue3 + Chakra
  - Easy to use + understand
  - Chakra is a godsend
  - Open for other possibility (tailwind?)
- Add info on retry strats using external
- Add statement on SQL vs Mongo
  - Flexibility: Not restraining to one DB type. Everything is ok, using Prisma
  - Provide 2 config files
- Moved phase #phase
  - I Implementation - Spike: From 1-15 -> 1-11
  - II Concept - Spike: From 16-22 -> 12-21
    - API design, mock up etc might need more work!
  - III Implementation: From 2 weeks -> 3 weeks
    - Might need more time. Refine  if needed
  - Buffer: From 2 weeks -> 5 days.
    - Not sure

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
