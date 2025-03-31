import jwt from "jsonwebtoken";

export default (req, res, next) => {
    let token = req.headers["token"];

    jwt.verify(token, "secretKey1234567890", (err, decoded) => {
        if (err) {
            return res.status(401).json({ status: "unauthorized" });
        } else {
            let email = decoded["data"]; 
            req.headers.email = email;
            next();
        }
    });
};
