import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

import cors from "cors";
import { connectToDB } from "./src/db/db.js";
import authRoutes from "./src/routes/auth/auth.route.js";
import passportGoogleAuth from "./src/utils/passport.util.js";
import adminDashboardRoutes from "./src/routes/admin/dashboard.route.js";
import adminProductsRoutes from "./src/routes/admin/products.route.js";
import adminOrderRoutes from "./src/routes/admin/order.route.js";
import shopProductsRoutes from "./src/routes/shop/products.route.js";
import shopCartRoutes from "./src/routes/shop/cart.route.js";
import shopAddressRoutes from "./src/routes/shop/address.route.js";
import shopOrderRoutes from "./src/routes/shop/order.route.js";
import shopSearchRoutes from "./src/routes/shop/search.route.js";
import shopReviewRoutes from "./src/routes/shop/review.route.js";
import commonFeatureRoutes from "./src/routes/common/feature.route.js";

connectToDB();

const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

passportGoogleAuth(app, PORT);

app.use("/api/auth", authRoutes);

app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/products", adminProductsRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

app.use("/api/shop/products", shopProductsRoutes);
app.use("/api/shop/cart", shopCartRoutes);
app.use("/api/shop/address", shopAddressRoutes);
app.use("/api/shop/order", shopOrderRoutes);
app.use("/api/shop/search", shopSearchRoutes);
app.use("/api/shop/review", shopReviewRoutes);

app.use("/api/common/feature", commonFeatureRoutes);

app.listen(PORT, () => {
    console.log("Server is listening on PORT " + PORT);
});