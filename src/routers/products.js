module.exports = ({ products, exceptions }) => {
  return {
    async route(request, response) {
      if (request.url.startsWith("/products")) {
        if (request.url.match(/\/products(\/.+)(\?.+)?/)) {
          if (request.method === "GET") {
            const matches = request.url.match(/\/products\/(.+)/);
            const id = matches[1];
            try {
              const product = await products.find(id);
              response.statusCode = 200;
              response.end(JSON.stringify(product.toJSON()));
            } catch (e) {
              response.statusCode = getStatusCode(e);
              response.end(buildErrorResponse(e));
            }
          }
        }

        if (request.method === "GET") {
          try {
            const productList = await products.list(request.query.sort);
            response.statusCode = 200;
            response.end(JSON.stringify(productList));
          } catch (e) {
            response.statusCode = getStatusCode(e);
            response.end(buildErrorResponse(e));
          }
        }

        if (request.method === "POST") {
          try {
            const id = await products.create(request.body);
            response.statusCode = 201;
            response.setHeader("Location", `/products/${id}`);
            response.end();
          } catch (e) {
            response.statusCode = getStatusCode(e);
            response.end(buildErrorResponse(e));
          }
        }

        if (request.method === "DELETE") {
          try {
            products.removeAll();
            response.statusCode = 204;
            response.end();
          } catch (e) {
            response.statusCode = getStatusCode(e);
            response.end(buildErrorResponse(e));
          }
        }
      }
    }
  };

  function getStatusCode(error) {
    if (error instanceof exceptions.MissingResourceError) {
      return 404;
    } else {
      return 400;
    }
  }

  function buildErrorResponse(error) {
    return JSON.stringify({ data: error.data });
  }
};
