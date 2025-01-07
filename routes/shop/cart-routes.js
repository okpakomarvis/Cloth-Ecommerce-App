const express = require('express');
const {addToCart, fechCartItems, updateCartItemQty, deleteCartItem,
    } = require('../../controllers/shop/cart-controller');

const router = express.Router();

router.post('/add', addToCart);
router.get('/get/:userId', fechCartItems);
router.put('/update-cart', updateCartItemQty);
router.delete('/:userId/:productId', deleteCartItem);

module.exports = router;