const { dateToString } = require('../../helpers/date');
const Event = require('../../models/event');
const User = require('../../models/user');
const { transormEvent } = require('./merged');

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return transormEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },
  createEvent: async (args, req) => {
    console.log('🚀 ~ file: events.js ~ line 17 ~ createEvent: ~ req', req.isAuth);
    try {
      if (!req.isAuth) {
        throw new Error('Unauthorize!!');
      }
      const { userId } = req;

      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: args.eventInput.price,
        date: dateToString(args.eventInput.date),
        creator: userId
      });
      let createdEvent;
      const result = await event.save();

      createdEvent = transormEvent(result);
      const searchUser = await User.findById(userId);
      if (!searchUser) {
        throw new Error('User not found');
      }
      searchUser.createdEvents.push(event);
      await searchUser.save();

      return createdEvent;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};
