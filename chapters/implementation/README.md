# Implementation Spike

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