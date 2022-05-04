# Use Case Diagram
A use case diagram is created to better visualize the flow and possible use cases of the application on a high level, without giving too much attention on how it will be implemented.
![Use Case Diagram](https://github.com/BA-LouisAndrew/thesis/blob/main/diagrams/use-case.png?raw=true)

### User Stories
- As a stakeholder, I want to verify users, so that the company can have more confidence that the existing user base is trustworthy ★ <- `Emphasis of FDS`
- As an employee, I want to be notified when a user seems suspicious, so that I can do necessary actions accordingly **?** <- `Emphasis on the message queue and notification system`

# Sequence diagram -> TODO: Move to conception
Sequence diagrams for specific use cases are created. The specific use cases are represented in a sequence diagram each, to visualize it better and to help in converting the use case into its corresponding user stories.

*Sequence diagram created and attached might be too technical and not suitable for a requirement analysis. To better analyze the non-technical requirements, a use case diagram might be preferred for this chapter.*

## UI-Registration-Event

![UI-Registration-Event](https://github.com/BA-LouisAndrew/thesis/blob/main/diagrams/Sequence__UI-registration-event.jpeg?raw=true)

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

![Notification Pub Sub](https://github.com/BA-LouisAndrew/thesis/blob/main/diagrams/Sequence__notification-pubsub.jpeg?raw=true)

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

# Criteria
![Software Quality Requirements](https://github.com/BA-LouisAndrew/thesis/blob/main/resources/quality_attrs.png?raw=true)

Certain criteria that need to be achieved, to determine whether the project is successful. Keyword `Software Quality Requirement`. 
What's going to be implemented is actually a table that list criteria (in mind: table of the sub-/characteristics listed on the **ISO/IEC 25010:2011**) and have a point to present whether the criterion is relevant or not.

**Relevance point**: 1 - Not relevant, 2 - Somewhat relevant, 3 - Relevant, 4 - Very relevant

![Relevance table](https://github.com/BA-LouisAndrew/thesis/blob/main/resources/relevance_table.jpeg?raw=true)

## SQR based on ISO/EIC 25010:2011
This is very important, to establish a **scientific** base and how to evaluate the project.
**Functional Suitability**
- Completeness -> System covers all the specified tasks listed on the requirement analysis -> **4** 
- Correctness -> System provides correct results of the tasks listed on the requirement analysis -> **4**
- Appropriateness -> System accomplishes to fulfill the tasks listed on the requirement analysis -> **3**

**Reliability**
- Maturity -> System is stable during every day use -> **3**
- Availability -> System is operational and accessible (ideally via a web browser and no installation is needed) -> **4**
- Fault tolerance -> System still operates well enough, despite software fault -> **3**
- Recoverability -> System can recover data in the event of an interruption / failure -> **4** 

**Performance Efficiency**
- Time behavior -> Response and processing time of the system is reasonable -> **3**
- Resource Utilization -> Amount and types of resources used by the system is kept as minimum as possible -> **1**
- Capacity -> Maximum limits of a system parameter is within a reasonable range for everyday use -> **1**
  
**Usability**
- Appropriateness Recognizability -> It can be easily recognized, that the system is suitable for the current user need -> **1**
- Learnability -> It's easy to learn how to use the system -> **3**
- Operability -> The system is easy to operate -> **4**
- User Error Protection -> System can protect or prevent users against making errors -> **2**
- User Interface Aesthetics -> User interface is aesthetically pleasing -> **4**
- Accessibility -> System can be used with the widest range of characteristics and capabilities -> **1**
  - Might add this #resource: https://developer.mozilla.org/en-US/docs/Web/Accessibility

**Security**
- Confidentiality -> System is able to ensure that data is only accessible to those who have authorized access -> **2**
  - Take note -> this is important for the *production* system, but this thesis project won't dive deep into auth
- Integrity -> System is able to prevent unauthorized access and modification to computer programs -> **2**
- Non-repudiation -> Actions or events can be proven to have taken place -> **4**
- Accountability -> Actions of an unauthorized user can be traced back -> **1**
- Authenticity -> How well the identity of a subject / resource can be proved -> **1**
  
**Compatibility**
- Co-existence -> System can perform its required functions efficiently while sharing a common environment and resources with other systems, without negatively impacting any other product -> **2**
- Interoperability -> Two or more systems, products, or components are able to exchange information and use it -> **4**

**Maintainability**
- Modularity -> Component of system can be changed with minimal impact on the other component -> **3**
  - TDD, define interface before writing its implementation
- Reusability -> Asset can be used in more than one system -> **1**
- Analyzability -> Activities within the system can be easily analyzed (e.g.: in form of logging) -> **2**
- Modifiability -> System can be modified without introducing defects or degrading existing product quality -> **4**
- Testability -> Test criteria for a system is effective and preferably can be run automatically -> **4**
 
**Portability**
- Adaptability -> System can be adapted for different or evolving HW, SW or other usage env -> **1**
- Installability -> System can be un- and/or installed successfully -> **3**
- Replaceability -> System as a product can replace another comparable product -> **1**

## #Resources
- https://asq.org/quality-resources/software-quality
- https://www.iso.org/standard/35733.html
- https://link.springer.com/chapter/10.1007/978-3-319-97925-0_42
- https://www.researchgate.net/figure/Quality-attributes-according-to-the-ISO-IEC-250102011-standard-Source-7_tbl1_336133518
- https://www.perforce.com/blog/qac/what-is-iso-25010#fun