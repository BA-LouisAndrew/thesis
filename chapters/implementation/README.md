# Implementation Spike

## Open Questions

- **Async operations** -> What if the external endpoint takes a long time to resolve? Without async operation, the endpoint would be blocked
- One solution is to et this out of scope
- What if request got interrupted? Does the check still run?
- https://github.com/BA-LouisAndrew/poc/tree/blocking-event -> POC to call a method without blocking the _"responsing"_ thread.
- So -----> Might be better to have an `async` operation by default. This way, when a request is interrupted, the scan would still run
  - ALL communication would be handled via a message queue?
  - https://www.youtube.com/watch?v=_r2ooFgBdoc&ab_channel=BenAwad -> Might be useful for the front end!
  - https://dev.to/sirwanafifi/server-sent-events-and-react-5ec9
  - `EventSource` on the front end, event emitter on the backend
    - https://medium.com/geekculture/how-to-a-build-real-time-react-app-with-server-sent-events-9fbb83374f90
    - Backend `response.app.emit("key", param)`, `response.app.on("key", callback)`
    - Frontend `const eventSource = new EventSource(url)`, `eventSource.onmessage = callback`
    - https://www.digitalocean.com/community/tutorials/nodejs-server-sent-events-build-realtime-app
    - `/streaming` endpoint now works.
      - Checkout https://github.com/BA-LouisAndrew/poc/tree/server-sent-events for more info on SSE

## FDS

### implementation notes
- https://github.com/CacheControl/json-rules-engine/tree/master/src -> See codebase to "rebuild" the rules engine from scratch
- https://www.npmjs.com/package/jsonpath -> "$.xyz"-like syntax to access attrs

FDS is going to be a back end service with a database connection, with the primary function of firing multiple HTTP requests to external endpoints and evaluate its responses.
Important points are

- Speed
- Easy to use

### Node ★

- Might be what I use to make the development faster!
- Easy to use
- Engine: https://github.com/cachecontrol/json-rules-engine
- x Doesn't handle concurrency that well? -> Single threaded language
- Framework: NestJS, Express, Fastify
- https://www.geeksforgeeks.org/libuv-in-node-js/
- x Not good for heavy CPU-intensive computational things
- ? How should I handle, if the external service takes a long time to return the response? -> Redis?

### Python

### Ruby

### Golang

- x Have to learn
- Built for speed
- x Community is not mature enough
- Engine: https://github.com/hyperjumptech/grule-rule-engine
- Framework: Gin

### Kotlin

- Based on JAVA
- Engine: https://github.com/InSourceSoftware/in-rules-engine
- x Have to learn
- Framework: Spring

## Notification

- Kafka vs RabbitMQ?
  - Kafka: https://www.youtube.com/watch?v=aj9CDZm0Glc&ab_channel=IBMTechnology ★
  - ~~RMQ: https://www.youtube.com/watch?v=7rkeORD4jSw~~

### Setup

**Production/Staging**
On PROD/INT, it might be better to have a dedicated RabbitMQ instance running on the cloud, rather than having to have a separate machine that would serve it. One solution for cloud-hosted RabbitMQ would be [CloudAMQP](https://www.cloudamqp.com/docs/index.html)

**Producer/Consumer**

- https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html
- Only open a connection once, and use it for ALL functions. [resource](https://stackoverflow.com/a/32379842)

**Resources**

- Setup: https://github.com/postwait/node-amqp
- Persist message: https://www.rabbitmq.com/tutorials/tutorial-two-javascript.html
- PubSub: https://www.rabbitmq.com/tutorials/tutorial-three-javascript.html
- POC: https://github.com/BA-LouisAndrew/poc/tree/ft/I/16--setup-rmq

## Retry Strategy

The system is heavily reliant on external services to run its function. However, it is not guaranteed, that the external service that are being used would be always accessible. Retry-Strategy is a strategy to ensure that the external services are available, before running the validation process.
Possible solution might be:

- First status check (e.g. HTTP call to `/health` endpoint)
- First do request with little HTTP body
- First do request with dummy data

Without a retry strategy, if an external service is unavailable, the check would be treated as a failed check, even though the personal data is actually trustworthy. To prevent a false-negative check result to happen, it would be useful to inform the user when an external service is inaccessible and skip the particular security check.

### Solution A (self-built)

- Have a status check
  - Inspired by https://github.com/zsimo/node-redis-retry-strategy
  - Valid retry strategy:
    ```json
    {
      "retryStrategy": {
        "checkEndpoint": "/health",
        "expectedStatus": 200, // Evaluated exclusively by its status code
        "numberOfAttempts": 3, // 1-3
        "delayOfAttempts": 1000, // Default: 200
        "timeout": 1000 // No response in 1s -> next attempt
      }
    }
    ```
  - No retry strategy:
    ```json
    {
      "retryStrategy": null
    }
    ```
- When status check fails:
  - If `retryStrategy` is provided: skip check, attach info in response
    ```json
    {
      "skipped": [{ "name": "adsajkld", "reason": "status check failed" }]
    }
    ```
  - If `retryStrategy` is nullish: check is fails. `fraudScore += failScore`
- Explanation
  - Request with little data / dummy data -> User has to define the endpoint and possibly the data to be passed. Add more complexity?
  - Health check might be as simple as firing a request to a stable endpoint and asserting the result
- The health endpoint can as well be the same endpoint used for validation, but it will be called without any request body, and therefore the expected status code (e.g. `400`) can be passed into the `expectedStatus` attribute

### Solution B (external)

- Another solution is to also have a `retryStrategy` attribute on rule object
- But rather than building the logic on your own, just use an HTTP client library (axios/got) that has a retry built-in mechanism, or a plugin for it
  - No need to rebuild the logic
  - Same object convention (use exactly what will be passed to the API)
- Example for `got`. Maybe I can link on how to configure this? https://github.com/sindresorhus/got/blob/2ac07e1b60f59e2219bd6c2809a9e40f56b146b6/documentation/7-retry.md
  ```json
  {
    "limit": 2,
    "methods": ["GET", "POST"],
    "statusCodes": [
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      408, 500, 502, 524
    ],
    "errorCodes": ["ETIMEDOUT", "ECONNRESET"],
  }
  ```
- Links
  - https://www.npmjs.com/package/axios-retry
  - https://github.com/sindresorhus/got/blob/2ac07e1b60f59e2219bd6c2809a9e40f56b146b6/documentation/7-retry.md ★

## Database

Which database to use? -> MongoDB. Document-based database that has a JSON-like document structure to save certain data is preferred here. Using relational database might mean that the validation rule might have to be separated across several tables, which would increase the complexity of the project without bringing that much value in itself. The data structure used to define the validation rule is also more complex and unstructured, which is not suitable for a relational database.

> Statement above is not needed

**New Statement** <br />
With the setup of FDS + Prisma, it doesn't really matter which database we use, as long as it is supported with the Prisma library. Prisma is useful to create a layer of abstraction (ORM) and enable easy access on application layer to the backend. The type of backend is interchangeable, and a schema file for Prisma each for document based and relation-based database will be provided to enable the flexibility.

As the FDS is created using JavaScript and relies heavily on JSON-like object, using MongoDB for the demonstration application will be preferred for its simplicity and ease of use.

### MongoDB

- Document based DB
- Cloud solution: Mongo Atlas. No need of having a dedicated server to host a database
- Connection to external ORM library -> Prisma: Perfect ORM connection between a database and TypeScript
  - POC!!-> https://github.com/BA-LouisAndrew/poc/tree/ft/I/18--database
- Prisma -> Type safety while querying database.

### Redis

Easy to use. Tutorial: https://www.youtube.com/watch?v=oaJq1mQ3dFI&ab_channel=TraversyMedia

- Save temporary value
- Save progress and stuff
- POC: https://github.com/BA-LouisAndrew/poc/tree/ft/I/17--redis. Done with redis on localhost
  - Use case: just to make it complicated
  - Use caching for rules DB! Save a stringified rule

## Swagger

Swagger plays an important role on this project. With swagger, an API specification or contract can be created before the implementation begins. By determining how the API should look like beforehand, the development can be done more efficiently. POC: https://github.com/BA-LouisAndrew/poc/tree/ft/I/20--swagger

## UI

Web framework that will be used to build the user interface is Vue3. Vue3 is chosen here specifically for its ease of use, and its growing community library support, that would be very beneficial in developing complex UI components, such as forms.

A component library would also be used for the UI project to speed up the development and to create more time to focus on the integration of the UI with the FDS. The component library Chakra UI is chosen here, as it is easy to use and is quite popular on the front end developer community. Chakra UI is originally a component library for another web-framework, ReactJS. The VueJS adaptation of Chakra UI will be used for this project.
