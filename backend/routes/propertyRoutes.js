import express from 'express';
const router = express.Router();

// Example dummy data (you can replace with MongoDB later)
const properties = [
    { id: 1, title: "Cozy Apartment", price: 50, city: "Mumbai", image: "https://via.placeholder.com/150" },
    { id: 2, title: "Luxury Villa", price: 200, city: "Pune", image: "https://via.placeholder.com/150" },
    { id: 3, title: "Beach House", price: 150, city: "Goa", image: "https://via.placeholder.com/150" },
];

// GET /api/properties
router.get('/properties', (req, res) => {
    res.json(properties);
});

export default router;