const express = require(`express`);
const bodyParser = require(`body-parser`);

const PORT = 5000;

const app = express();

// set up the static folder to server index.html
app.use(express.static(`./server/public`));

// set up the bodyParser so we can use req.body
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`READY TO DO SOME MATH YEAH!`);
});

app.post(`/calculate`, (req, res) => {
  console.log(`POST /calculate`);
  // do some logic, save the result, and then
  // send back the status to say it's created (that's probably the best code to use)
  res.sendStatus(201);
});
