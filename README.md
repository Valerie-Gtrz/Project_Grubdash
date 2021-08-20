
# Project description: GrubDash
## Set up an API for a food delivery application and build out specific routes so that frontend developers can demo initial design ideas.

## Project Requirements:
- In the src/dishes/dishes.controller.js file, add handlers and middleware functions to create, read, update, and list dishes. Note that dishes cannot be deleted.
- In the src/dishes/dishes.router.js file, add two routes: /dishes and /dishes/:dishId. Attach the handlers (create, read, update, and list) exported from src/dishes/dishes.controller.js.
- In the src/orders/orders.controller.js file, add handlers and middleware functions to create, read, update, delete, and list orders.
- In the src/orders/orders.router.js file, add two routes: /orders and /orders/:orderId. Attach the handlers (create, read, update, delete, and list) exported from src/orders/orders.controller.js.
- Anytime you need to assign a new id to an order or dish, use the nextId function exported from src/utils/nextId.js

## Ensure all of the following:

- All required tests are passing.
- All middleware and handler functions have a single responsibility and are named functions.
- All data passed between middleware and handler functions uses response.locals.
- All chained method calls on a route(...) end with all(methodNotAllowed).
- All update handlers guarantee that the id property of the stored data cannot be overwritten.

## Application home page
![img](https://res.cloudinary.com/strive/image/upload/w_1000,h_1000,c_limit/1fc7f916e2146e659f7934a73b103e25-home.png)

## Technology Used
- JavaScript
- Node.js
- Express

## Skills Used
- Running tests from the command line
- Using common middleware packages
- Receiving requests through routes
- Accessing relevant information through route parameters
- Building an API following RESTful design principles
- Writing custom middleware functions


