function addRowLockOnFlights(flightId){
   return `SELECT *from Flights where Flights.id = ${flightId} FOR UPDATE;`
}
module.exports = {
    addRowLockOnFlights
}