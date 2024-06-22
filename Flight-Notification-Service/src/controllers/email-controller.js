const { EmailService } = require("../services");
const { StatusCodes } = require("http-status-codes");
const { SuccessResponse, ErrorResponse } = require("../utils/common");

async function create(req, res) {
  try {
    const response = await EmailService.createTicket({
      subject: req.body.subject,
      content: req.body.content,
      recepientEmail: req.body.recepientEmail,
    });
    return res.status(201).json(response);
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function sendEmail(req, res) {
  try {
    const response = await EmailService.sendEmail({
      recepientEmail: req.body.recepientEmail,
      subject: req.body.subject,
      content: req.body.content,
    });
    SuccessResponse.data = response;
    res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(StatusCodes.SERVICE_UNAVAILABLE).json(ErrorResponse);
  }
}
module.exports = {
  create,
  sendEmail
};
