import express = require('express');

var app: express.Express = express();

app.get('/', (req: express.Request, res: express.Response) => {
  res.json({ message: 'lalalala' });
});

app.listen(3000);