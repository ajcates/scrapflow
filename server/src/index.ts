import express from 'express';

export const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

// Only start the server if this file is run directly
/* c8 ignore start */
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
/* c8 ignore stop */
