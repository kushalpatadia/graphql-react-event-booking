const Event = require('../../models/event');
const Booking = require('../../models/booking');
const { transormBookings, transormEvent } = require('./merged');

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return transormBookings(booking);
      });
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args) => {
    try {
      const eventId = args.eventId;
      const fetchEvent = await Event.findOne({ _id: eventId });
      const booking = new Booking({
        user: '62c6c633d849c5c628fcede7',
        event: fetchEvent
      });

      const result = await booking.save();
      return transormBookings(result);
    } catch (err) {
      throw err;
    }
  },
  cancleBooking: async (args) => {
    try {
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
