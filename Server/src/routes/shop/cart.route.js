import express from "express";
import { addToCart, fetchCartItems, updateCartItemsQty, deleteCartItems } from "../../controllers/shop/cart.controller.js";

const router = express.Router();

router.post('/add', addToCart);
router.get('/get/:userId', fetchCartItems);
router.put('/update-cart', updateCartItemsQty);
router.delete('/:userId/:productId', deleteCartItems);

export default router;