import database from "../config/mysql.config.js";
import Response from "../domain/response.js";
import logger from "../util/logger.js";
import QUERY from "../query/patient.query.js";

const HttpStatus = {
  OK: { code: 200, status: "OK" },
  CREATED: { code: 201, status: "CREATED" },
  NO_CONTENT: { code: 204, status: "NO_CONTENT" },
  BAD_REQUEST: { code: 400, status: "BAD_REQUEST" },
  NOT_FOUND: { code: 404, status: "NOT_FOUND" },
  INTERNAL_SERVER_ERROR: { code: 500, status: "INTERNAL_SERVER_ERROR" },
};

const patientValues = (body) => [
  body.first_name,
  body.last_name,
  body.email,
  body.address,
  body.diagnosis,
  body.phone,
  body.image_url,
];

const sendError = (res, error) => {
  logger.error(error.message);
  res
    .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
    .send(
      new Response(
        HttpStatus.INTERNAL_SERVER_ERROR.code,
        HttpStatus.INTERNAL_SERVER_ERROR.status,
        "Error occurred",
      ),
    );
};

export const getPatients = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching patients`);
  database.query(QUERY.SELECT_PATIENTS, (error, results) => {
    if (error) {
      sendError(res, error);
      return;
    }
    if (!results[0]) {
      res
        .status(HttpStatus.OK.code)
        .send(
          new Response(
            HttpStatus.OK.code,
            HttpStatus.OK.status,
            "No patients found",
          ),
        );
    } else {
      res
        .status(HttpStatus.OK.code)
        .send(
          new Response(
            HttpStatus.OK.code,
            HttpStatus.OK.status,
            "Patients retrieved",
            { patients: results },
          ),
        );
    }
  });
};

export const getPatient = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching patient`);
  database.query(QUERY.SELECT_PATIENT, [req.params.id], (error, results) => {
    if (error) {
      sendError(res, error);
      return;
    }
    if (!results[0]) {
      res
        .status(HttpStatus.NOT_FOUND.code)
        .send(
          new Response(
            HttpStatus.NOT_FOUND.code,
            HttpStatus.NOT_FOUND.status,
            `Patient by id ${req.params.id} was not found`,
          ),
        );
    } else {
      res
        .status(HttpStatus.OK.code)
        .send(
          new Response(
            HttpStatus.OK.code,
            HttpStatus.OK.status,
            "Patient retrieved",
            results[0],
          ),
        );
    }
  });
};

export const createPatient = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, creating patient`);
  database.query(
    QUERY.CREATE_PATIENT,
    patientValues(req.body),
    (error, results) => {
      if (error) {
        sendError(res, error);
        return;
      }
      const patient = {
        id: results.insertId,
        ...req.body,
        created_at: new Date(),
      };
      res
        .status(HttpStatus.CREATED.code)
        .send(
          new Response(
            HttpStatus.CREATED.code,
            HttpStatus.CREATED.status,
            "Patient created",
            { patient },
          ),
        );
    },
  );
};

export const updatePatient = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching patient`);
  database.query(QUERY.SELECT_PATIENT, [req.params.id], (error, results) => {
    if (error) {
      sendError(res, error);
      return;
    }
    if (!results[0]) {
      res
        .status(HttpStatus.NOT_FOUND.code)
        .send(
          new Response(
            HttpStatus.NOT_FOUND.code,
            HttpStatus.NOT_FOUND.status,
            `Patient by id ${req.params.id} was not found`,
          ),
        );
      return;
    }
    logger.info(`${req.method} ${req.originalUrl}, updating patient`);
    database.query(
      QUERY.UPDATE_PATIENT,
      [...patientValues(req.body), req.params.id],
      (updateError) => {
        if (updateError) {
          sendError(res, updateError);
          return;
        }
        res
          .status(HttpStatus.OK.code)
          .send(
            new Response(
              HttpStatus.OK.code,
              HttpStatus.OK.status,
              "Patient updated",
              { id: req.params.id, ...req.body },
            ),
          );
      },
    );
  });
};

export const deletePatient = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting patient`);
  database.query(QUERY.DELETE_PATIENT, [req.params.id], (error, results) => {
    if (error) {
      sendError(res, error);
      return;
    }
    if (results.affectedRows > 0) {
      res
        .status(HttpStatus.OK.code)
        .send(
          new Response(
            HttpStatus.OK.code,
            HttpStatus.OK.status,
            "Patient deleted",
          ),
        );
    } else {
      res
        .status(HttpStatus.NOT_FOUND.code)
        .send(
          new Response(
            HttpStatus.NOT_FOUND.code,
            HttpStatus.NOT_FOUND.status,
            `Patient by id ${req.params.id} was not found`,
          ),
        );
    }
  });
};

export default HttpStatus;
