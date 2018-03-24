module.exports = (schemas, models) => {
  return {
    bills: require("./bills")(models),
    products: require("./products")(schemas, models),
    orders: require("./orders")(schemas, models),
    exceptions: require("./exceptions")
  };
};
