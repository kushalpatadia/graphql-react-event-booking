const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');

const event = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map((event) => {
      return transormEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

const getEventById = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return transormEvent(event);
  } catch (error) {
    throw error;
  }
};

const transormEvent = (event) => {
  return {
    ...event._doc,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event._doc.creator)
  };
};

const transormBookings = (booking) => {
  return {
    ...booking._doc,
    event: getEventById.bind(this, booking._doc.event),
    user: user.bind(this, booking._doc.user),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  };
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

exports.event = event;
exports.getEventById = getEventById;
exports.user = user;
exports.transormEvent = transormEvent;
exports.transormBookings = transormBookings;
