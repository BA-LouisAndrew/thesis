# Implementation Spike

## Open Questions
- **Async operations** -> What if the external endpoint takes a long time to resolve? Without async operation, the endpoint would be blocked
 - One solution is to et this out of scope
- What if request got interrupted? Does the check still run?
 - https://github.com/BA-LouisAndrew/poc/tree/blocking-event -> POC to call a method without blocking the *"responsing"* thread.
- So -----> Might be better to have an `async` operation by default. This way, when a request is interrupted, the scan would still run
  - ALL communication would be handled via a message queue?

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