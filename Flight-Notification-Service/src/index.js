const amqplib = require("amqplib");
const express = require("express");
const { EmailService } = require("./services");
const {ServerConfig} = require('./config')
const apiRoutes = require("./routes");
const { CRON } = require("./utils/common");

async function connectQueue() {
  try {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertQueue("Notification Queue");
    channel.consume("Notification Queue", async (data) => {
      console.log(`${Buffer.from(data.content)}`);
      const {
        recepientEmail,
        subject,
        text,
        status,
        arrival,
        departure,
        bookingId,
        seats,
      } = JSON.parse(Buffer.from(data.content));
      await EmailService.sendEmail(
        ServerConfig.GMAIL_EMAIL,
        recepientEmail,
        subject,
        text
      );
      console.log('Email sent');
      await EmailService.createTicket({
        bookingId,
        recipientEmail:recepientEmail,
        departureTime: departure,
        arrivalTime: arrival,
        noOfSeats: seats,
        status,
      });
      console.log("Ticket updated");
      channel.ack(data);
    });
  } catch (error) {}
}
const app = express();
app.use("/api", apiRoutes);

app.listen(ServerConfig.PORT, async () => {
  console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
  await connectQueue();
  await CRON(EmailService);
  console.log("queue is up");
});
