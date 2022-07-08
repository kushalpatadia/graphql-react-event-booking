const authResolver = require('./auth');
const eventsResolver = require('./events');
const bookingsResolver = require('./bookings');

module.exports = {
  ...authResolver,
  ...eventsResolver,
  ...bookingsResolver
};
