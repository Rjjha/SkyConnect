const axios = require("axios");
const { StatusCodes } = require("http-status-codes");
const { BookingRepository} = require("../repositories");
const { ServerConfig, Queue } = require("../config");
const db = require("../models");
const AppError = require("../utils/errors/app-error");
const { Enums } = require("../utils/common");
const { CANCELLED, BOOKED } = Enums.BOOKING_STATUS;

const bookingRepository = new BookingRepository();

async function createBooking(data) {
  const transaction = await db.sequelize.transaction();
  // transaction.ISOLATION_LEVELS.SERIALIZABLE; // To handle two concurrent booking for only one seat that is left
  try {
    const flight = await axios.get(
      `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`
    );
    const flightData = flight.data.data;
    if (data.noofSeats > flightData.totalSeats) {
      throw new AppError("Not enough seats available", StatusCodes.BAD_REQUEST);
    }
    const totalBillingAmount = data.noofSeats * flightData.price;
    const bookingPayload = { ...data, totalCost: totalBillingAmount };
    const booking = await bookingRepository.createBooking(
      bookingPayload,
      transaction
    );
    await axios.patch(
      `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`,
      {
        seats: data.noofSeats,
        dec: "true",
      }
    );
    await transaction.commit();
    return booking;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function makePayment(data) {
  const transaction = await db.sequelize.transaction();
  try {
    const bookingDetails = await bookingRepository.get(
      data.bookingId,
      transaction
    );
    if (bookingDetails.status == CANCELLED) {
      throw new AppError("The booking has expired", StatusCodes.BAD_REQUEST);
    }
    const bookingTime = new Date(bookingDetails.createdAt);
    const currentTime = new Date();
    if (currentTime - bookingTime > 300000) {
      await cancelBooking(data.bookingId);
      throw new AppError("The booking has expired there", StatusCodes.BAD_REQUEST);
    }
    if (bookingDetails.totalCost != data.totalCost) {
      throw new AppError(
        "The amount of the payment doesnt match",
        StatusCodes.BAD_REQUEST
      );
    }
    if (bookingDetails.userId != data.userId) {
      throw new AppError(
        "The user corresponding to the booking doesnt match",
        StatusCodes.BAD_REQUEST
      );
    }
    // we assume here that payment is successful
    await bookingRepository.update(
      data.bookingId,
      { status: BOOKED },
      transaction
    );

    const userData = await axios.get(
        `${ServerConfig.USER_SERVICE}/api/v1/user/${data.userId}`
      );
      const email = userData.data.data.email;
      const flight = await axios.get(
        `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${bookingDetails.flightId}`
      );
      const flightData = flight.data.data;
    Queue.sendData({
      recepientEmail: email,
      text: "Your flight is booked.",
      subject: `Confirmation : Your flight has been booked for Booking-Id : ${data.bookingId}`,
      status: "BOOKED",
      arrival: flightData.arrivalTime,
      departure: flightData.departureTime,
      bookingId: bookingDetails.id,
      seats: bookingDetails.noofSeats,
    });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function cancelBooking(bookingId) {
  const transaction = await db.sequelize.transaction();
  try {
    const bookingDetails = await bookingRepository.get(bookingId, transaction);
    if (bookingDetails.status == CANCELLED) {
      await transaction.commit();
      return true;
    }
    await axios.patch(
      `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${bookingDetails.flightId}/seats`,
      {
        seats: bookingDetails.noofSeats,
        dec: "false",
      }
    );
    await bookingRepository.update(
      bookingId,
      { status: CANCELLED },
      transaction
    );
    const userData = await axios.get(
      `${ServerConfig.USER_SERVICE}/api/v1/user/${bookingDetails.userId}`
    );
    const email = userData.data.data.email;
    const flight = await axios.get(
      `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${bookingDetails.flightId}`
    );
    const flightData = flight.data.data;
    Queue.sendData({
      recepientEmail: email,
      text: "Your Booking has been cancelled",
      subject: `Cancellation : Your flight has been cancelled for Booking-Id : ${bookingDetails.bookingId}`,
      status: "CANCELLED",
      arrival: flightData.arrivalTime,
      departure: flightData.departureTime,
      bookingId: bookingDetails.id,
      seats: bookingDetails.noofSeats,
    });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function cancelOldBookings() {
  try {
    console.log("Inside service");
    const time = new Date(Date.now() - 1000 * 300); // time 5 mins ago
    const response = await bookingRepository.cancelOldBookings(time);

    return response;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  createBooking,
  cancelOldBookings,
  makePayment,
};
