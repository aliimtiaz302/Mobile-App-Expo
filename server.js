const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Hardcoded Menu Data
const menu = [
  {
    name: "Margherita Pizza",
    price: 450,
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1601924638867-3ec4c4c38c58"
  },
  {
    name: "Zinger Burger",
    price: 380,
    category: "Burger",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349"
  },
  {
    name: "Alfredo Pasta",
    price: 590,
    category: "Pasta",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5"
  },
  {
    name: "Chocolate Lava Cake",
    price: 350,
    category: "Dessert",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c"
  }
];

// GET endpoint
app.get("/menu", (req, res) => {
  res.json(menu);
});

// POST endpoint
app.post("/order", (req, res) => {
  console.log("New Order Received:");
  console.log(req.body);

  res.json({
    message: "Order received successfully!"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});