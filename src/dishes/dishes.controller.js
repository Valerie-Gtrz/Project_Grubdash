const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

function dishExists(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);

  if (!foundDish) {
    return next({
      status: 404,
      message: `Dish does not exist: ${dishId}`,
    });
  }
  res.locals.foundDish = foundDish; //res.locals is and object and its values only persist through the lifetime of a request
  return next();
}

const checkDish = (req, res, next) => {
  const {data: { name, description, price, image_url }} = req.body;
  if (!name || name == "")
    return next({ status: 400, message: "Dish must include a name" });
  if (!description || description == "")
    return next({ status: 400, message: "Dish must include a description" });
  if (!price)
    return next({ status: 400, message: "Dish must include a price" });
  if (typeof price !== "number" || price <= 0)
    return next({
      status: 400,
      message: "Dish must have a price that is an integer greater than 0",
    });
  if (!image_url || image_url == "")
    return next({ status: 400, message: "Dish must include an image_url" });
  else {
    res.locals.newDish = {
      id: nextId(),
      name: name,
      description: description,
      price: price,
      image_url: image_url,
    };
    next();
  }
};

const create = (req, res, next) => {
  dishes.push(res.locals.newDish);
  res.status(201).json({ data: res.locals.newDish });
};

const read = (req, res, next) => {
  res.json({ data: res.locals.foundDish });
};



const update = (req, res, next) => {
  const originalFoundDish = res.locals.foundDish;
  const {data: { id, name, price, description, image_url }} = req.body;
  if (id && id !== req.params.dishId)
    return next({
      status: 400,
      message: `Dish id ${id} does not match dish id ${req.params.dishId}`,
    });

  res.locals.foundDish = {
    id: originalFoundDish.id,
    name: name,
    description: description,
    price: price,
    image_url: image_url,
  };
  res.json({ data: res.locals.foundDish });
};

const list = (req, res, next) => {
  res.json({ data: dishes });
};

module.exports = {
  dishExists,
  list,
  create: [checkDish, create],
  read: [dishExists, read],
  update: [dishExists, checkDish, update],
};