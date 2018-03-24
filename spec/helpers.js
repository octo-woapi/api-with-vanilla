const got = require("got");
const faker = require("faker");
const api = require("..");

const PORT = process.env.PORT || 3000;

async function queryApi(method, resource, options) {
  const customOptions = Object.assign({}, options, { json: true, method });
  let response;
  try {
    response = await got(`http://localhost:${PORT}${resource}`, customOptions);
  } catch (error) {
    response = error.response;
  }
  return response;
}

function startApi() {
  let server;

  before(done => {
    api().then(app => {
      server = app.listen(PORT, done);
    });
  });

  after(() => {
    server.close();
  });
}

async function addProduct(data) {
  const defaultProduct = {
    name: faker.commerce.product(),
    price: faker.finance.amount(),
    weight: faker.random.number()
  };
  const body = Object.assign(defaultProduct, data);
  return await queryApi("POST", "/products", { body });
}

async function deleteAllProduct() {
  return await queryApi("DELETE", "/products");
}

async function addOrder(withProduct = true, customProductList = []) {
  let productList = [];
  if (withProduct) {
    const { headers } = await addProduct();
    productList.push(headers.location.slice("/products/".length));
  } else {
    if (customProductList && customProductList.length) {
      productList = customProductList;
    }
  }
  const defaultOrder = { product_list: productList };
  const body = Object.assign(defaultOrder);
  return await queryApi("POST", "/orders", { body });
}

async function deleteAllOrder() {
  return await queryApi("DELETE", "/orders");
}

async function deleteAllBill() {
  return await queryApi("DELETE", "/bills");
}

async function addBill() {
  const { headers } = await addOrder();
  const url = headers.location + "/status";
  await queryApi("PUT", url, { body: { status: "paid" } });
}

module.exports = {
  queryApi,
  testUtils: {
    startApi,
    addProduct,
    deleteAllProduct,
    addOrder,
    deleteAllOrder,
    deleteAllBill,
    addBill
  }
};
