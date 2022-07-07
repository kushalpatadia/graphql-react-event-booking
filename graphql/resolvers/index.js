const Event = require('../../models/event');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');

const event = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map((event) => {
      return {
        ...event._doc,
        creator: user.bind(this, event._doc.creator)
      };
    });
  } catch (err) {
    throw err;
  }
};

const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      createdEvents: event.bind(this, user._doc.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return {
          ...event._doc,
          creator: user.bind(this, event._doc.creator)
        };
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
        date: new Date(args.eventInput.date),
        creator: '62c6c633d849c5c628fcede7'
      });
      let createdEvent;
      const result = await event.save();

      createdEvent = { ...result._doc, creator: user.bind(this, result._doc.creator) };
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
  },
  createUser: async (args) => {
    try {
      const email = args.userInput.email;
      const password = args.userInput.password;
      const user = await User.findOne({ email });
      if (user) {
        throw new Error('User already exits');
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        password: hashedPassword
      });
      const result = await newUser.save();
      return { ...result._doc, password: null };
    } catch (err) {
      console.log('ssssssssssssssssssss', err);
      throw err;
    }
  }
};
