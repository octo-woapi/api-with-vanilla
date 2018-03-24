const queryString = require("query-string");
const url = require("url");

module.exports = services => {
  const productsRouter = require("./products")(services);
  const ordersRouter = require("./orders")(services);
  const billsRouter = require("./bills")(services);

  return async (request, response) => {
    const { search } = url.parse(request.url);
    request.query = queryString.parse(search);
    request.body = await getBody(request);
    response.setHeader("Content-Type", "application/json");

    productsRouter.route(request, response);
    ordersRouter.route(request, response);
    billsRouter.route(request, response);
  };
};

function getBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request
      .on("data", chunk => {
        body += chunk;
      })
      .on("end", () => {
        resolve(JSON.parse(body || "{}"));
      })
      .on("error", reject);
  });
}
