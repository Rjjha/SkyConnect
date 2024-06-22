const dotenv = require("dotenv");

dotenv.config();

module.exports = {
    PORT : process.env.PORT,
    FLIGHT_SERVICE : process.env.FLIGHT_SERVICE,
    USER_SERVICE : process.env.USER_SERVICE
}