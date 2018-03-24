module.exports = ({ orders }, { MissingResourceError }) => {
  return {
    async route(request, response) {
      if (request.url.startsWith("/orders")) {
        if (request.url.match(/^\/orders\/.+\/status$/)) {
          const matches = request.url.match(/^\/orders\/(.+)\/status$/);
          const id = matches[1];
          try {
            await orders.updateStatus(id, request.body.status);
            response.statusCode = 200;
            response.end();
          } catch (e) {
            response.statusCode = getStatusCode(e);
            response.end(buildErrorResponse(e));
          }
        }

        if (request.url.match(/^\/orders\/.+$/)) {
          if (request.method === "GET") {
            const matches = request.url.match(/\/orders\/(.+)/);
            const id = matches[1];
            try {
              const order = await orders.find(id, response);
              response.statusCode = 200;
              response.end(JSON.stringify(order.toJSON()));
            } catch (e) {
              response.statusCode = getStatusCode(e);
              response.end(buildErrorResponse(e));
            }
          }
        }

        if (request.method === "GET") {
          try {
            const orderList = await orders.list(request.query.sort);
            response.statusCode = 200;
            response.end(JSON.stringify(orderList));
          } catch (e) {
            response.statusCode = getStatusCode(e);
            response.end(buildErrorResponse(e));
          }
        }

        if (request.method === "POST") {
          try {
            const id = await orders.create(request.body, response);
            response.setHeader("Location", `/orders/${id}`);
            response.statusCode = 201;
            response.end();
          } catch (e) {
            response.statusCode = getStatusCode(e);
            response.end(buildErrorResponse(e));
          }
        }

        if (request.method === "DELETE") {
          try {
            await orders.removeAll();
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
    if (error instanceof MissingResourceError) {
      return 404;
    } else {
      return 400;
    }
  }

  function buildErrorResponse(error) {
    return JSON.stringify({ data: error.data });
  }
};
