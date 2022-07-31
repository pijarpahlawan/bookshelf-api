const Hapi = require('@hapi/hapi');
const routes = require('./routes');

//* membuat server
const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  //* routing
  server.route(routes);

  await server.start();
};

init();
