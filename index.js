import express from "express";
import cors from "cors";
import EmployeeRoutes from "./Routes/EmployeeRoutes.js";
import FamilyRoutes from "./Routes/FamilyRoutes.js"

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
app.use('/api/family', FamilyRoutes);

const port = 3000;

app.listen(port, () => {
   console.log(`Server is running on port ${port}`); 
});