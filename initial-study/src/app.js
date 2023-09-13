const express = require("express");
const app = express();
const port = 3000;

let bodyParser = require('body-parser');
app.use(bodyParser.json({ extended: false }));

let products = [
  {
    id: 1,
    name: "Ivanhoe",
    author: "Sir Walter Scott",
  },
  {
    id: 2,
    name: "Colour Magic",
    author: "Terry Pratchett",
  },
  {
    id: 3,
    name: "The Bluest eye",
    author: "Toni Morrison",
  },
];

app.get("/", (req, res) => res.send("Hello API!"));

function isAuthorized(req, res, next) {
    const auth = req.headers.authorization;
    if (auth === 'secretpassword') {
      next();
    } else {
      res.status(401);
      res.send('Not permitted');
    }
}

app.get("/users", isAuthorized, (req, res) => {
  res.json([
    {
      id: 1,
      name: "User Userson",
    },
  ]);
});

app.route('/products')
 .get((req, res) => {
  const page = +req.query.page;
  const pageSize = +req.query.pageSize;

  if (page && pageSize) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    res.json(products.slice(start, end));
  } else {
    res.json(products);
  }
 })
 .post((req, res) => {
   const newProduct = { ...req.body, id: products.length + 1 }
   products = [...products, newProduct]
   res.json(newProduct);
 })
.put((req, res) => {
   let updatedProduct;
   products = products.map(p => {
     if (p.id === req.body.id) {
       updatedProduct = { ...p, ...req.body };
       return updatedProduct;
     }
     return p;
   })
   if (updatedProduct) {
    res.json(updatedProduct);
   } else {
    res.sendStatus(404);
   }
 })
 .delete((req, res) => {
   const deletedProduct = products.find(p => p.id === +req.body.id);
   if (deletedProduct) {
    products = products.filter(p => p.id !== +req.body.id);
    res.json(deletedProduct);
   } else {
    res.sendStatus(404);
   }
 })

async function appRun(){
  app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
}

appRun();
