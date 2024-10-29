import express from "express";
import sql from "./utils/db.js";
import cors from "cors";
import EmployeeRoutes from "./Routes/EmployeeRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/employees', EmployeeRoutes);

const port = 3000;

app.listen(port, () => {
   console.log(`Server is running on port ${port}`); 
});