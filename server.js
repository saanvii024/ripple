import express from 'express';
// Import our newly encapsulated Ripple function
import { analyzeBlastRadius } from './ripple.js';

const app = express();
const PORT = 3000;

// Middleware to tell Express how to parse incoming JSON data
app.use(express.json());

// Basic health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Ripple API is running perfectly' });
});

// THE WEBHOOK RECEIVER
// We use POST because GitHub will be SENDING us data
app.post('/webhook', (req, res) => {
    console.log("[RIPPLE] Webhook received!");
    
    // Extract the modified file from the incoming JSON payload
    const modifiedFile = req.body.modifiedFile;

    // Safety Check: Did they actually send us a file?
    if (!modifiedFile) {
        return res.status(400).json({ error: "Missing 'modifiedFile' in payload" });
    }

    try {
        // Run the engine dynamically based on the incoming data
        const report = analyzeBlastRadius('./src/index.js', modifiedFile);
        
        console.log(`[RIPPLE] Analysis complete. Found ${report.totalAffected} broken files.`);
        
        // Send the JSON report back to the client/GitHub
        res.status(200).json({
            message: "Blast Radius Calculated",
            data: report
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error during AST Parsing" });
    }
});

app.listen(PORT, () => {
    console.log(`[RIPPLE] Webhook Receiver listening on http://localhost:${PORT}`);
});