const path = require("path");
// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

//Validation middleware /*working*/
//===================================================
function hasRequiredFields(req, res, next) {
  const data = req.body.data || {}; //we set it to a default object so that we do not try to destructure items fromm and indefined obj id data is not found and it wont crash our entire app
  const requiredFields = ["name", "description", "price", "image_url"];
  for (const field of requiredFields) {
    if (!data[field]) {
      return next({
        status: 400,
        message: `Dish must include a ${field}`,
      }); //send to error handler so we need to return something. return stops the function from running. when you say next we know you are either going to go to the next fxn that will either return next or send a response
    }
  }
  next();
}

//C /*working*/
const create = (req, res, next) => {
  /* set data body default to empty object so program doesn't try to destructure fields from an undefined object and crash our app*/
  //destructuring the fields required to create a new dish and check if each exists
  const { data: { name, description, price, image_url } = {} } = req.body;
  //if price field is not greater than zero return 400
  if (price <= 0) {
    return next({
      status: 400,
      message: "Dish must have a price that is an integer greater than 0",
    });
  }
  //else make new dish and add the dish to the dishes array
  const newDish = {
    id: nextId(), //in instructions, already provided
    name,
    description,
    price,
    image_url,
  };
  dishes.push(newDish); //push new dish to the dishes-data array
  return res.status(201).json({ data: newDish }); //you can return a response or not but there is no harm in doing so
};

//R /*working*/
const read = (req, res, next) => {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);

  if (!foundDish) {
    return next({
      status: 404,
      message: "Dish not found",
    });
  }
  res.json({ data: foundDish });
};

//U
// const update =(req, res, next)=>{
//   res.status(400).json({data: updatedDish})
// }

//D
/*methodNotAllowed - wired to router*/

//L
//lists all the dishes on front page /*working*/
const list = (req, res, next) => {
  return res.json({ data: dishes }); //all responses come an an pbject with a "data" key so we need to return an object witha data key and the data itself its dishes
};

// TODO: Implement the /dishes handlers needed to make the tests pass
module.exports = {
  create: [hasRequiredFields, create],
  list,
  read,
};
