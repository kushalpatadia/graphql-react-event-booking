const { dateToString } = require('../../helpers/date');
const Event = require('../../models/event');
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
  createEvent: async (args) => {
    try {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: args.eventInput.price,
        date: dateToString(args.eventInput.date),
        creator: '62c6c633d849c5c628fcede7'
      });
      let createdEvent;
      const result = await event.save();

      createdEvent = transormEvent(result);
      const searchUser = await User.findById('62c6c633d849c5c628fcede7');
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
