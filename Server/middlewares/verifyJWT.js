import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    // console.log("no token");
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
    // console.log(err);
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = decoded;
    next();
  });
};

export default verifyJWT