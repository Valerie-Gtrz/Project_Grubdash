const path = require("path");
const orders = require(path.resolve("src/data/orders-data"));
const nextId = require("../utils/nextId");

const orderExists = (req, res, next) => {
  const orderId = req.params.orderId;
  const foundOrder = orders.find((order) => order.id === orderId);
  if (foundOrder) {
    res.locals.orderId = orderId;
    res.locals.foundOrder = foundOrder;
    return next();
  }
  next({
    status: 404,
    message: `Order does not exist: ${orderId}`,
  });
};

//======validation middleware=============//
const hasValidData = (req, res, next) => {
  const { data: { deliverTo, mobileNumber, dishes } = {} } = req.body;

  if (!deliverTo || deliverTo === "") {
    next({
      status: 400,
      message: "Order must include a deliverTo",
    });
  }
  if (!mobileNumber || mobileNumber === "") {
    next({
      status: 400,
      message: "Order must include a mobileNumber",
    });
  }
  if (!dishes) {
    next({
      status: 400,
      message: "Order must include a dish",
    });
  }
  if (!Array.isArray(dishes) || dishes.length === 0) {
    next({
      status: 400,
      message: "Order must include at least one dish",
    });
  }
  dishes.forEach((dish, index) => {
    if (
      !dish.quantity ||
      typeof dish.quantity !== "number" ||
      dish.quantity <= 0
    ) {
      next({
        status: 400,
        message: `Dish ${index} must have a quantity that is an integer greater than 0`,
      });
    }
  });

  if (deliverTo && mobileNumber && dishes) {
    return next();
  }
};

const pendingCheck = (req, res, next) => {
  if (res.locals.foundOrder.status === "pending") {
    return next();
  }
  next({
    status: 400,
    message: "An order cannot be deleted unless it is pending.",
  });
};

const hasValidId = (req, res, next) => {
  const { data: { id } = {} } = req.body;
  if (id === undefined || id === null || id.length === 0) {
    return next();
  }
  if (id && id === req.params.orderId) {
    return next();
  }
  next({ status: 400, message: `id does not match ${id}` });
};

const hasValidStatus = (req, res, next) => {
  const { data: { status } = {} } = req.body;
  if (status && status !== "invalid") {
    res.locals.status = status;
    return next();
  }
  next({ status: 400, message: "A 'status' property is required" });
};

//C
//user is making a GET request to /orders we are sending data back
function create(req, res, next) {
  const {
    data: { deliverTo, status, mobileNumber, dishes },
  } = req.body;

  const newOrder = {
    id: nextId(),
    deliverTo,
    status,
    mobileNumber,
    dishes,
  };
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

//R
const read = (req, res) => {
  res.json({ data: res.locals.foundOrder });
};

//U
const update = (req, res, next) => {
  const {
    data: { deliverTo, mobileNumber, status, dishes },
  } = req.body;
  const updatedOrder = {
    ...res.locals.foundOrder,
    deliverTo,
    mobileNumber,
    status,
    dishes: [...dishes],
  };
  res.json({ data: updatedOrder });
};

//D
const destroy = (req, res) => {
  const index = orders.indexOf(res.locals.foundOrder);
  orders.splice(index, 1);
  res.sendStatus(204);
};

//L
const list = (req, res, next) => {
  res.json({ data: orders });
};

module.exports = {
  list,
  read: [orderExists, read],
  create: [hasValidData, create],
  update: [orderExists, hasValidData, hasValidStatus, hasValidId, update],
  delete: [orderExists, pendingCheck, destroy],
};
