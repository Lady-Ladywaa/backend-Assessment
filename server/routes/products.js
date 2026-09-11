const express = require("express");

const router = express.Router();

// In-memory data
let products = [
  {
    id: "1",
    name: "Keyboard",
    price: 1200,
    quantity: 1,
  },
  {
    id: "2",
    name: "Mouse",
    price: 500,
    quantity: 2,
  },
  {
    id: "3",
    name: "Monitor 27-inch",
    price: 6500,
    quantity: 1,
  },
];

// GET /products
// GET /products?name=mouse
router.get("/", (req, res) => {
  const { name } = req.query;

  if (name) {
    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(name.trim().toLowerCase())
    );

    return res.status(200).json(filteredProducts);
  }

  res.status(200).json(products);
});

// GET /products/:id
router.get("/:id", (req, res) => {
  const product = products.find(
    (product) => product.id === req.params.id
  );

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.status(200).json(product);
});

// POST /products
router.post("/", (req, res) => {
  const { name, price, quantity = 1 } = req.body;

  const parsedPrice = Number(price);
  const parsedQuantity = Number(quantity);

  if (!name || String(name).trim() === "" || isNaN(parsedPrice) || parsedPrice < 0) {
    return res.status(400).json({
      message: "Valid product name and non-negative price are required",
    });
  }

  const newProduct = {
    id: String(Date.now()),
    name: String(name).trim(),
    price: parsedPrice,
    quantity: isNaN(parsedQuantity) || parsedQuantity < 1 ? 1 : Math.floor(parsedQuantity),
  };

  products.push(newProduct);

  res.status(201).json(newProduct);
});

// PUT /products/:id
router.put("/:id", (req, res) => {
  const product = products.find(
    (product) => product.id === req.params.id
  );

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  const { name, price, quantity } = req.body;
  const parsedPrice = Number(price);
  const parsedQuantity = Number(quantity);

  if (!name || String(name).trim() === "" || isNaN(parsedPrice) || parsedPrice < 0 || isNaN(parsedQuantity) || parsedQuantity < 0) {
    return res.status(400).json({
      message: "Valid product name, non-negative price, and valid quantity are required",
    });
  }

  product.name = String(name).trim();
  product.price = parsedPrice;
  product.quantity = Math.floor(parsedQuantity);

  res.status(200).json(product);
});

// DELETE /products/:id
router.delete("/:id", (req, res) => {
  const productIndex = products.findIndex(
    (product) => product.id === req.params.id
  );

  if (productIndex === -1) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  const deletedProduct = products.splice(productIndex, 1);

  res.status(200).json({
    message: "Product deleted successfully",
    product: deletedProduct[0],
  });
});

module.exports = router;