import express from "express";
import mysql from "mysql";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "Nguyet123@",
    database: "webbanxeoto",
});

db.connect((err) => {
    if (err) {
        console.error("MySQL connection failed: " + err.message);
    } else {
        console.log("Connected to MySQL!");
    }
});


app.get("/customers", (req, res) => {
    db.query("SELECT * FROM customers", (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
});


app.listen(9090, () => {
    console.log("Server is running on port 3306");
});
