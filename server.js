import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'UP', 
        message: 'Ripple API is running.' 
    });
});

app.listen(PORT, () => {
    console.log(`[RIPPLE] Server listening on http://localhost:${PORT}`);
});