import { Router } from "express";
import {
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
} from "../controller/controller.js";

const patientRoutes = Router();

patientRoutes.route("/").get(getPatients).post(createPatient);
patientRoutes
  .route("/:id")
  .get(getPatient)
  .put(updatePatient)
  .delete(deletePatient);

export default patientRoutes;
