import * as express from "express";
import { generatedPDSExcel } from "../controller/PDsController";

const router = express.Router();

router.get("/download-excel/:employee_id", generatedPDSExcel);

export default router;