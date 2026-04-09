const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Apply a rate limiter for the /download endpoint (e.g., 20 requests per 15 min per IP)
const downloadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 requests per window
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many download requests from this IP, please try again later.'
});

// VULNERABILITY: Hardcoded secret key (CWE-798)
const JWT_SECRET = 'zava-super-secret-key-12345';
const ADMIN_PASSWORD = 'admin123';

// In-memory database replacement
const users = [
    { id: 1, username: 'admin', password: 'admin123', email: 'admin@zava.com', role: 'admin', credit_card: '4532-1234-5678-9012' },
    { id: 2, username: 'john', password: 'password', email: 'john@example.com', role: 'user', credit_card: '4532-9876-5432-1098' }
];

const products = [
    { id: 1, name: 'Running Shoes Pro', description: 'Professional running shoes', price: 129.99, stock: 50 },
    { id: 2, name: 'Athletic Shorts', description: 'Breathable sports shorts', price: 39.99, stock: 100 },
    { id: 3, name: 'Training T-Shirt', description: 'Moisture-wicking shirt', price: 29.99, stock: 75 }
];

const orders = [];

// Rate limiter for /export endpoint
const exportLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute window
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many export requests from this IP, please try again later.'
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// VULNERABILITY: No HTTPS enforcement
// VULNERABILITY: Missing security headers
app.use((req, res, next) => {
    // VULNERABILITY: CORS misconfiguration - allows all origins
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

// Home page
app.get('/', (req, res) => {
    res.render('index');
});

// VULNERABILITY: SQL Injection (CWE-89)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // VULNERABILITY: Simulated SQL injection - string concatenation pattern
    // In a real app this would be: SELECT * FROM users WHERE username = '${username}' AND password = '${password}'
    const user = users.find(u => {
        // Simulate SQL injection vulnerability - admin' OR '1'='1 would bypass
        if (username.includes("' OR '1'='1") || username.includes("admin' --")) {
            return u.username === 'admin';
        }
        return u.username === username && u.password === password;
    });
    
    if (user) {
        // VULNERABILITY: Insecure JWT implementation
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
        res.cookie('auth_token', token, { httpOnly: false }); // VULNERABILITY: httpOnly false
        res.json({ success: true, user: user }); // VULNERABILITY: Exposing sensitive data
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// VULNERABILITY: SQL Injection in search (CWE-89)
app.get('/search', (req, res) => {
    const searchTerm = req.query.q;
    
    // VULNERABILITY: Simulated SQL injection in search
    // Real query would be: SELECT * FROM products WHERE name LIKE '%${searchTerm}%'
    let results = products;
    
    // Simulate dangerous string concatenation that would allow SQL injection
    if (searchTerm && !searchTerm.includes("'") && !searchTerm.includes("--")) {
        results = products.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    res.json(results);
});

// VULNERABILITY: Command Injection (CWE-78)
app.post('/export', exportLimiter, (req, res) => {
    const { filename } = req.body;
    
    // Vulnerable to command injection
    exec(`echo "Exporting data to ${filename}"`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send(`Export failed: ${error.message}`);
        }
        res.send(`File exported to ${filename}: ${stdout}`);
    });
});

// VULNERABILITY: Path Traversal (CWE-22)
app.get('/download', downloadLimiter, (req, res) => {
    const filename = req.query.file;
    
    // Vulnerable to path traversal
    const filePath = path.join(__dirname, filename);
    
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('File not found');
        }
    });
});

// VULNERABILITY: Insecure Direct Object Reference (IDOR) (CWE-639)
app.get('/user/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    
    // No authentication or authorization check
    const user = users.find(u => u.id === userId);
    
    if (user) {
        // VULNERABILITY: Exposing sensitive data including credit card
        res.json(user);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// VULNERABILITY: Mass Assignment (CWE-915)
app.post('/register', (req, res) => {
    const userData = req.body;
    
    // VULNERABILITY: Storing password in plaintext (CWE-256)
    const newUser = {
        id: users.length + 1,
        username: userData.username,
        password: userData.password, // VULNERABILITY: Plaintext password
        email: userData.email,
        role: userData.role || 'user', // VULNERABILITY: User can set role to 'admin'
        credit_card: userData.credit_card || ''
    };
    
    users.push(newUser);
    res.json({ success: true, userId: newUser.id });
});

// VULNERABILITY: XML External Entity (XXE) (CWE-611)
app.post('/import-xml', (req, res) => {
    const xml2js = require('xml2js');
    const xmlData = req.body.xml;
    
    // Vulnerable XML parser configuration
    const parser = new xml2js.Parser({
        explicitCharkey: true,
        // VULNERABILITY: XXE enabled
        explicitRoot: false
    });
    
    parser.parseString(xmlData, (err, result) => {
        if (err) {
            return res.status(400).send('Invalid XML');
        }
        res.json(result);
    });
});

// VULNERABILITY: Insecure Deserialization (CWE-502)
app.post('/session', (req, res) => {
    const serialize = require('serialize-javascript');
    const sessionData = req.body.data;
    
    // VULNERABILITY: Deserializing untrusted data
    try {
        const data = eval('(' + sessionData + ')'); // VULNERABILITY: Using eval
        res.json({ success: true, data: data });
    } catch (e) {
        res.status(400).send('Invalid session data');
    }
});

// VULNERABILITY: Weak cryptography (CWE-327)
app.post('/encrypt', (req, res) => {
    const { text } = req.body;
    
    // VULNERABILITY: Using weak MD5 hashing
    const hash = crypto.createHash('md5').update(text).digest('hex');
    
    res.json({ encrypted: hash });
});

// VULNERABILITY: Unrestricted File Upload (CWE-434)
app.post('/upload', (req, res) => {
    const { filename, content } = req.body;
    
    // VULNERABILITY: No file type validation or sanitization
    // Simulated file upload without actually writing to disk
    res.json({ 
        success: true, 
        message: `File ${filename} would be uploaded with content: ${content.substring(0, 50)}...` 
    });
});

// VULNERABILITY: Server-Side Request Forgery (SSRF) (CWE-918)
app.get('/fetch-url', async (req, res) => {
    const axios = require('axios');
    const url = req.query.url;
    
    // No URL validation - vulnerable to SSRF
    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Failed to fetch URL');
    }
});

// VULNERABILITY: Information Disclosure (CWE-200)
app.get('/debug', (req, res) => {
    // Exposing sensitive debugging information
    res.json({
        env: process.env,
        jwt_secret: JWT_SECRET,
        admin_password: ADMIN_PASSWORD,
        database: 'sqlite3',
        version: process.version
    });
});

// VULNERABILITY: Missing rate limiting
app.post('/api/orders', (req, res) => {
    const { userId, productId, quantity } = req.body;
    
    const product = products.find(p => p.id === parseInt(productId));
    
    if (!product) {
        return res.status(400).send('Product not found');
    }
    
    const total = product.price * quantity;
    const newOrder = {
        id: orders.length + 1,
        user_id: userId,
        product_id: productId,
        quantity: quantity,
        total: total
    };
    
    orders.push(newOrder);
    res.json({ success: true, orderId: newOrder.id, total: total });
});

// Error handler that exposes stack traces
app.use((err, req, res, next) => {
    // VULNERABILITY: Exposing stack traces (CWE-209)
    res.status(500).json({
        error: err.message,
        stack: err.stack,
        details: err
    });
});

app.listen(PORT, () => {
    console.log(`Zava Webshop running on http://localhost:${PORT}`);
    console.log('WARNING: This application is INTENTIONALLY VULNERABLE for demonstration purposes only!');
});
