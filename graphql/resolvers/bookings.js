const Event = require('../../models/event');
const Booking = require('../../models/booking');
const { transormBookings, transormEvent } = require('./merged');

module.exports = {
  bookings: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthorize!!');
      }
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return transormBookings(booking);
      });
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthorize!!');
      }
      const eventId = args.eventId;
      const { userId } = req;
      const fetchEvent = await Event.findOne({ _id: eventId });
      const booking = new Booking({
        user: userId,
        event: fetchEvent
      });

      const result = await booking.save();
      return transormBookings(result);
    } catch (err) {
      throw err;
    }
  },
  cancleBooking: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthorize!!');
      }
      const bookingId = args.bookingId;
      const booking = await Booking.findById(bookingId).populate('event');
      const event = transormEvent(booking.event);
      await Booking.deleteOne({ _id: bookingId });
      return event;
    } catch (error) {
      throw error;
    }
  }
};
