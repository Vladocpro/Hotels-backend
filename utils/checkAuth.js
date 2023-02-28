import jwt from "jsonwebtoken";


export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.userId = decoded._id;
            next();
        } catch(e) {
            return res.status(403).json({
                message: 'No access'
            })
        }
    } else {
        return res.status(403).json({
            message: 'No access'
        })
    }
}