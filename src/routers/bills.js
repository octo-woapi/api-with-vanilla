module.exports = ({ bills }) => {
  return {
    async route(request, response) {
      if (request.url.startsWith("/bills")) {
        if (request.method === "GET") {
          const billList = await bills.list();
          response.statusCode = 200;
          response.end(JSON.stringify(billList));
        }

        if (request.method === "DELETE") {
          await bills.removeAll();
          response.statusCode = 204;
          response.end();
        }
      }
    }
  };
};
