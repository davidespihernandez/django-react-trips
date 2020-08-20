# Frontend docs

The travel plans website is a React single page application that uses the Django backend REST API to allow users to manage trips.

The initial requirements are:

* R1. 
> User must be able to create an account and log in. (If a mobile application, this means that more users can use the app from the same phone).
* R2. 
> When logged in, a user can add trips, and edit and delete their trips.
* R3. 
> Implement at least three roles with different permission levels: a regular user would only be able to CRUD on their owned records, a user manager would be able to CRUD users, and an admin would be able to CRUD all records and users.
* R4. 
> When a trip is entered, it has a Destination, StartDate, EndDate, and Comment.
* R5. 
> When displayed, each entry also has a day count to trip start (only for future trips).
* R6. 
> User can filter trips.
* R7. 
> Print travel plan for next month.
* R8. 
> REST API. Make it possible to perform all user actions via the API, including authentication (If a mobile application and you don’t know how to create your own backend you can use Firebase.com or similar services to create the API).
* R9. 
> If it’s a web application, it must be a single-page application. All actions need to be done client-side using AJAX, refreshing the page is not acceptable. (If a mobile application, disregard this).

This documentation contains screenshots and videos showing how each all the previous requirements is implemented.

* [R1](https://git.toptal.com/screening/david-espi/blob/master/frontend/docs/R1/R1.md) : `create account and login`
* [R2](https://git.toptal.com/screening/david-espi/blob/master/frontend/docs/R2/R2.md) : `user trips management`
* [R3](https://git.toptal.com/screening/david-espi/blob/master/frontend/docs/R3/R3.md) : `roles`
* [R4](https://git.toptal.com/screening/david-espi/blob/master/frontend/docs/R4/R4.md) : `trip creation fields`
* [R5](https://git.toptal.com/screening/david-espi/blob/master/frontend/docs/R5/R5.md) : `count to trip start for future trips`
* [R6](https://git.toptal.com/screening/david-espi/blob/master/frontend/docs/R6/R6.md) : `user can filter trips`
* [R7](https://git.toptal.com/screening/david-espi/blob/master/frontend/docs/R7/R7.md) : `print travel plan for next month`
* [R8](https://git.toptal.com/screening/david-espi/blob/master/frontend/docs/R8/R8.md) : `REST API`
* [R9](https://git.toptal.com/screening/david-espi/blob/master/frontend/docs/R9/R9.md) : `single page application`

## End to end tests
 In the folder `docs/selenium_tests` you can find an example of an end-to-end test (the login page).
 You can use the selenium chrome extension to record web interaction and perform tests, once the initial test data has been created in the backend.
 Anyway, in my opinion, it's better to create end-to-end in the Django backend, using the Selenium library to start a browser and perform user interaction.
 Using selenium in the backend allows to isolate each test in a database transaction, create specific test data for the test, and perform any kind of assertion on the generated HTML code.
  

