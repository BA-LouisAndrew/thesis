# Sequence diagram
Sequence diagrams for specific use cases are created. The specific use cases are represented in a sequence diagram each, to visualize it better and to help in converting the use case into its corresponding user stories.

## UI-Registration-Event
- Customer input personal data on Customer facing UI
- The UI executes an HTTP request to the FDS, containing the user's personal data on the request body

- FDS retrieves a list of checks as well as how the valid response should look like from the database
- FDS loops through the list of checks
- FDS call each endpoint provided and evaluate the response from this external check. The fraud score would be updated according to the result of the check (incremented by the `passScore` if it passed, and incremented by the `failScore` if it failed)

- FDS returns the resulting fraud score (sum of all check results) to the customer facing UI
- If the fraud score is less than `0.3`, the customer facing UI would display a welcome screen. Otherwise, an extra verification step via SMS would be required.

### User Stories
- As a front end developer, I would like to access the FDS using HTTP/REST, so that I can validate a new customer directly from the customer facing UI and display an additional verification step there if necessary
- As a stakeholder (team A member), I would like to persist the information about a security check that I built in a database, so that the FDS can access it every time a validation is executed, and I can update how the response from the security check should look like without having to update the FDS
- As a security team member, I would like verify a new user as soon as possible, so that the company can have more confidence, that the existing user base is most probably not fraudulent

## Notification-PubSub
- A HTTP request to the FDS, containing the customer data on its request body is executed (e.g. from a new customer registration, or customer data change)

- FDS retrieves a list of checks as well as how the valid response should look like from the database
- FDS loops through the list of checks
- FDS call each endpoint provided and evaluate the response from this external check. The fraud score would be updated according to the result of the check (incremented by the `passScore` if it passed, and incremented by the `failScore` if it failed)

- FDS publish the resulting fraud score (sum of all check results) and a list containing the result of the checks to a message queue (*message producer*)
- The message queue notify its subscribers, that a new validation is done and forward the resulting fraud score to each subscriber
- The subscribers of the message queue do certain actions if the fraud score exceeds a certain limit, that's determined by each subscriber independently (*message consumer*)
  
### User Stories
- As a team member, I would like to receive the fraud score of a customer from the FDS without really having to be involved during the validation process, so that I can do more processing of the fraud score of a user
- As a security team, I would like to receive an email notification when the fraud score of a customer exceeds a certain threshold, so that a manual review can be done as soon as possible

## What's more?
There's another idea of displaying progress of the validation on the UI. It's only a nice to have. More details will be written if it is decided that such feature is within the scope of this project.