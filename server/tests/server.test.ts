import t from 'tap';
import { app } from '../src/index.js';
import { Server } from 'http';

t.test('Server Hello World', async (t) => {
  // What: Start the server on a random port
  // Why: To verify the server can start and respond to requests without conflicts
  let server: Server;
  const startServer = () => new Promise<Server>((resolve) => {
      const s = app.listen(0, () => resolve(s));
  });

  server = await startServer();
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 0;
  const url = `http://localhost:${port}/`;

  // What: Fetch the root endpoint
  // Why: Verify the basic health check or hello world route works
  const res = await fetch(url);
  t.equal(res.status, 200, 'Status should be 200');

  const text = await res.text();
  t.equal(text, 'Hello World', 'Body should be Hello World');

  // What: Close the server
  // Why: Cleanup resources
  server.close();
});
