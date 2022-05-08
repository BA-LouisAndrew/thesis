# Implementation Spike

## Open Questions
- **Async operations** -> What if the external endpoint takes a long time to resolve? Without async operation, the endpoint would be blocked
 - One solution is to et this out of scope
- What if request got interrupted? Does the check still run?
 - https://github.com/BA-LouisAndrew/poc/tree/blocking-event -> POC to call a method without blocking the *"responsing"* thread.
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

### Redis
- Save temporary value
- Save progress and stuff
- Pub Sub?
- But why use Redis when you already have MQ?

## Notification
- Kafka vs RabbitMQ?
  - Kafka: https://www.youtube.com/watch?v=aj9CDZm0Glc&ab_channel=IBMTechnology ★
  - ~~RMQ: https://www.youtube.com/watch?v=7rkeORD4jSw~~

### Setup
**To run RMQ locally**

```
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.9-management
```

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

### Solution:
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