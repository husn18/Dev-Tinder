const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({ 
                message: 'Unauthorized: No token provided',
                error: 'Token missing'
            });
        }

        const decoded = jwt.verify(token, 'Dev-Tinder@123');
        req.user = decoded; // Attach decoded user info to request
        req.userId = decoded.userId; // Attach userId for easy access
        
        next();
    } catch (err) {
        console.error('Auth Error:', err.message);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Unauthorized: Token expired',
                error: 'Token expired'
            });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: 'Unauthorized: Invalid token',
                error: 'Invalid token'
            });
        }
        res.status(401).json({ 
            message: 'Unauthorized',
            error: err.message
        });
    }
};

module.exports = userAuth;
