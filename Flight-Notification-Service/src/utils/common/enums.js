const SEAT_TYPES = {
  BUSINESS: "business",
  ECONOMY: "economy",
  PREMIUM_ECONOMY: "premium-economy",
  FIRST_CLASS: "first-class",
};

const BOOKING_STATUS = {
  PENDING: "pending",
  BOOKED: "booked",
  CANCELLED: "cancelled",
  INITIATED: "initiated",
};

const TICKET_STATUS = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
};

module.exports = {
  SEAT_TYPES,
  BOOKING_STATUS,
  TICKET_STATUS
};
