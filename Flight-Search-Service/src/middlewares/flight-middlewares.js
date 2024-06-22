const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");
const AppError = require("../utils/errors/app-error");

const validataRequest = (req, res, next) => {
  if (!req.body.flightNumber) {
    ErrorResponse.error = new AppError(
      "flightNumber not found in the oncoming request in the correct form",
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  if (!req.body.airplaneId) {
    ErrorResponse.error = new AppError(
      "airplaneId not found in the oncoming request in the correct form",
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  if (!req.body.departureAirportId) {
    ErrorResponse.error = new AppError(
      "departureAirportId not found in the oncoming request in the correct form",
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  if (!req.body.arrivalAirportId) {
    ErrorResponse.error = new AppError(
      "departureAirportId not found in the oncoming request in the correct form",
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  if (!req.body.arrivalTime) {
    ErrorResponse.error = new AppError(
      "arrivalTime not found in the oncoming request in the correct form",
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  if (!req.body.departureTime) {
    ErrorResponse.error = new AppError(
      "departureTime not found in the oncoming request in the correct form",
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  if (!req.body.price) {
    ErrorResponse.error = new AppError(
      "price not found in the oncoming request in the correct form",
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  if (!req.body.totalSeats) {
    ErrorResponse.error = new AppError(
      "totalSeats not found in the oncoming request in the correct form",
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  if (new Date(req.body.arrivalTime)<=new Date(req.body.departureTime)) {
    ErrorResponse.error = new AppError(
      "cannot arrive before depature",
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  next();
};

function validateUpdateSeatsRequest(req, res, next) {
  if(!req.body.seats) {
      ErrorResponse.message = 'Something went wrong while creating flight';
      ErrorResponse.error = new AppError(['seats not found in the incoming request in the correct form'], StatusCodes.BAD_REQUEST);
      return res
              .status(StatusCodes.BAD_REQUEST)
              .json(ErrorResponse);
  }
  next();
}

module.exports = {
  validataRequest,
  validateUpdateSeatsRequest
};
