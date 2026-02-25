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

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

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
// app.get("/products", async (req, res) => {
//   const products = await Product.find();
//   res.json(products);
// });

app.get("/products/:userId", async (req, res) => {

  try {

    const products = await Product.find({
      userId: req.params.userId,
    });

    res.json(products);

  } catch {

    res.json([]);

  }

});


// ADD PRODUCT
app.post("/products", async (req, res) => {

  try {

    const product = new Product({
      userId: req.body.userId,
      name: req.body.name,
      category: req.body.category,
      stock: req.body.stock,
      minStock: req.body.minStock,
      sellingPrice: req.body.sellingPrice,
      costPrice: req.body.costPrice,
      supplier: req.body.supplier,
      expiryDate: req.body.expiryDate,
    });

    await product.save();

    res.json(product);

  } catch {

    res.json({ success: false });

  }

});

// UPDATE PRODUCT
app.put("/products/:id", async (req, res) => {

  try {

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        category: req.body.category,
        stock: req.body.stock,
        minStock: req.body.minStock,
        sellingPrice: req.body.sellingPrice,
        costPrice: req.body.costPrice,
        supplier: req.body.supplier,
        expiryDate: req.body.expiryDate,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      product: updatedProduct
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Update failed"
    });

  }

});

const OrderSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

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
app.get("/orders/:userId", async (req, res) => {

  try {

    const orders = await Order.find({
      userId: req.params.userId
    }).sort({ date: -1 });

    res.json(orders);

  } catch {

    res.json([]);

  }

});


// ADD ORDER
app.post("/orders", async (req, res) => {

  try {

    const order = new Order({

      userId: req.body.userId,

      productName: req.body.productName,

      quantity: req.body.quantity,

      distributor: req.body.distributor,

    });

    await order.save();

    res.json({
      success: true,
      order: order
    });

  } catch (error) {

    console.log("Order save error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save order"
    });

  }

});
// GROUP ORDER SCHEMA
const GroupOrderSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

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

  createdAt: {
    type: Date,
    default: Date.now,
  },

});

const GroupOrder = mongoose.model("GroupOrder", GroupOrderSchema);


// GET GROUP ORDERS
app.get("/grouporders/:userId", async (req, res) => {

  try {

    const orders = await GroupOrder.find({
      userId: req.params.userId
    }).sort({ createdAt: -1 });

    res.json(orders);

  } catch {

    res.json([]);

  }

});


// CREATE GROUP ORDER
app.post("/grouporders", async (req, res) => {

  try {

    const order = new GroupOrder({

      userId: req.body.userId,

      orderName: req.body.orderName,

      distributor: req.body.distributor,

      participants: req.body.participants,

      totalAmount: req.body.totalAmount,

      discount: req.body.discount,

      deadline: req.body.deadline,

    });

    await order.save();

    res.json({
      success: true,
      order
    });

  } catch {

    res.json({
      success: false
    });

  }

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
// app.get("/best-selling/:userId", async (req, res) => {

//   try {

//     const result = await Order.aggregate([

//       {
//         $match: {
//           userId: new mongoose.Types.ObjectId(req.params.userId),
//           status: { $ne: "Cancelled" }
//         }
//       },

//       {
//         $group: {
//           _id: "$productName",
//           totalSold: { $sum: "$quantity" }
//         }
//       },

//       {
//         $sort: { totalSold: -1 }
//       },

//       {
//         $limit: 5
//       }

//     ]);

//     res.json(result);

//   } catch (error) {

//     console.log(error);

//     res.json([]);

//   }

// });

const SaleSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  productName: String,

  quantity: Number,

  sellingPrice: Number,

  totalAmount: Number,

  date: {
    type: Date,
    default: Date.now,
  },

});

const Sale = mongoose.model("Sale", SaleSchema);

app.post("/sell", async (req, res) => {

  try {

    const {
      userId,
      productId,
      quantity
    } = req.body;

    const product = await Product.findById(productId);

    if (!product) {

      return res.json({
        success: false,
        message: "Product not found"
      });

    }

    if (product.stock < quantity) {

      return res.json({
        success: false,
        message: "Not enough stock"
      });

    }

    // reduce stock
    product.stock -= quantity;

    await product.save();

    // save sale
    const sale = new Sale({

      userId,
      productId,
      productName: product.name,
      quantity,
      sellingPrice: product.sellingPrice,
      totalAmount: quantity * product.sellingPrice,

    });

    await sale.save();

    res.json({
      success: true,
      sale
    });

  } catch (error) {

    res.json({
      success: false
    });

  }

});

app.get("/sales/:userId", async (req, res) => {

  try {

    const sales = await Sale.find({
      userId: req.params.userId
    }).sort({ date: -1 });

    res.json(sales);

  } catch {

    res.json([]);

  }

});


// ONLY ONE app.listen HERE
app.listen(5000, () => {

  console.log("Server running on port 5000");

});