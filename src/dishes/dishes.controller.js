const { response } = require("express");

const path = require("path");
// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

const list = (req, res, next) => {
  return res.json({ data: dishes }); //all responses come an an pbject with a "data" key so we need to return an object witha data key and the data itself its dishes
};

// function hasRequiredFields(req, res, next) {
//   const  data = req.body.data || {}  //we set it to a default object so that we do not try to destructure items fromm and indefined obj id data is not found and it wont crash our entire app
  
//   const requiredFields = ["name", "description", "price", "image_url"];
//   for (const field of requiredFields) {
//     if (!data[field]) {
//       return next({
//         status: 400,
//         message: `Dish must include a ${field}`,
//       }); //send to error handler so we need to return something. return stops the function from running. when you say next we know you are either going to go to the next fxn that will either return next or send a response
//     }
//     next();
//   }

  
  const create = (req, res, next) => {
      const {data: {name, description, price, image_url} = {}} = req.body; //we set it to a default object so that we do not try to destructure items fromm and indefined obj id data is not found and it wont crash our entire app
      const requiredFields = ["name","description", "price", "image_url"]
          for (const field of requiredFields){
              if (!data[field]) {
                  return next({
                      status: 400,
                      message: `Dish must include a ${field}`
                  }); //send to error handler so we need to return something. return stops the function from running. when you say next we know you are either going to go to the next fxn that will either return next or send a response
              }
          }

  if (price < Number(0)) {
    return next({
      status: 400,
      message: "Dish must have a price that is an integer greater than 0"
    });
  }

  //make new dish
  const newDish = {
    id: nextId(), //in instructions
    name,
    description,
    price,
    image_url,
  };
  dishes.push(newDish); //push new dish to the dishes-data array
  return res.status(201).json({ data: newDish }); //you can return this or not but there is no harm in doing so
}

// TODO: Implement the /dishes handlers needed to make the tests pass
module.exports = {
  create,
  list,
};
