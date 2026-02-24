const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/gram")
.then(() => console.log("MongoDB Connected", mongoose.connection.collections));

const ProductSchema = new mongoose.Schema({

  name: String,
  category: String,
  stock: Number,
  minStock: Number,
  sellingPrice: Number,
  costPrice: Number,
  supplier: String,
  expiryDate: String,

});

const Product = mongoose.model("Product", ProductSchema);


// GET PRODUCTS
app.get("/products", async (req, res) => {

  const products = await Product.find();
  res.json(products);

});


// ADD PRODUCT
app.post("/products", async (req, res) => {

  const product = new Product(req.body);
  await product.save();

  res.json(product);

});

const OrderSchema = new mongoose.Schema({

  productName: String,
  quantity: Number,
  distributor: String,
  status: {
    type: String,
    default: "Pending",
  },
  date: {
    type: Date,
    default: Date.now,
  },

});

const Order = mongoose.model("Order", OrderSchema);


// GET ORDERS
app.get("/orders", async (req, res) => {

  const orders = await Order.find().sort({ date: -1 });

  res.json(orders);

});


// ADD ORDER
app.post("/orders", async (req, res) => {

  const order = new Order(req.body);

  await order.save();

  res.json(order);

});
// GROUP ORDER SCHEMA
const GroupOrderSchema = new mongoose.Schema({

  orderName: String,
  distributor: String,
  participants: Number,
  totalAmount: Number,
  discount: Number,
  status: {
    type: String,
    default: "Active",
  },
  deadline: String,

});

const GroupOrder = mongoose.model("GroupOrder", GroupOrderSchema);


// GET GROUP ORDERS
app.get("/grouporders", async (req, res) => {

  const orders = await GroupOrder.find().sort({ _id: -1 });

  res.json(orders);

});


// CREATE GROUP ORDER
app.post("/grouporders", async (req, res) => {

  const order = new GroupOrder(req.body);

  await order.save();

  res.json(order);

});
// USER SCHEMA
const UserSchema = new mongoose.Schema({

  name: {
    type: String,
    unique: true,
  },

  phone: String,

  password: String,

});

const User = mongoose.model("User", UserSchema);
// REGISTER USER
app.post("/register", async (req, res) => {

  try {

    const { name, phone, password } = req.body;

    const existingUser = await User.findOne({ name });

    if (existingUser) {

      return res.json({
        success: false,
        message: "User already exists",
      });

    }

    const user = new User({
      name,
      phone,
      password,
    });
    await user.save();

    res.json({
      success: true,
      message: "User registered",
    });

  } catch (error) {

    res.json({
      success: false,
      message: "Error registering user",
    });

  }

});
// LOGIN USER
app.post("/login", async (req, res) => {

  try {

    let { name, password } = req.body;
    console.log(req.body)
    const user = await User.findOne({name, password});
    console.log(user)
    if (user) {

      res.json({
        success: true,
        user,
      });

    } else {

      res.json({
        success: false,
        message: "Invalid credentials",
      });

    }

  } catch (err) {

    res.json({
      success: false,
      message: "Server error",
    });

  }

});
// GET USER PROFILE
// GET USER PROFILE
// GET USER PROFILE
app.get("/user/:name", async (req, res) => {

  try {

    const user = await User.findOne({
      name: req.params.name,
    });

    if (user) {

      res.json({
        success: true,
        user,
      });

    } else {

      res.json({
        success: false,
      });

    }

  } catch {

    res.json({
      success: false,
    });

  }

});


// ONLY ONE app.listen HERE
app.listen(5000, () => {

  console.log("Server running on port 5000");

});