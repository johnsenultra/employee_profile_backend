import express from "express";
import buffer from "buffer";
import sql from "./utils/db.js";
import cors from "cors";
import EmployeeRoutes from "./Routes/EmployeeRoutes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
   origin: ['http://localhost:3000', 'http://localhost:5173'],
   methods: ['GET', 'POST', 'PUT', 'DELETE'],
   allowedHeaders: ['Content-Type',]
}));

// API endpoint
app.use('/api/employees', EmployeeRoutes);

const port = 3000;

app.listen(port, () => {
   console.log(`Server is running on port ${port}`); 
});