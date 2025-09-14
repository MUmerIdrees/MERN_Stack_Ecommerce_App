import express from "express";
import { addToCart, fetchCartItems, updateCartItemsQty, deleteCartItems, mergeGuestCart } from "../../controllers/shop/cart.controller.js";
import { protectRoute } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post('/add', addToCart);
router.post('/merge', protectRoute, mergeGuestCart)
router.get('/get/:userId', fetchCartItems);
router.put('/update-cart', updateCartItemsQty);
router.delete('/:userId/:productId', deleteCartItems);

export default router;