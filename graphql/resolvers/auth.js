const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
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
      throw err;
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error('Invalid Credentials!');
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error('Invalid Credentials!');
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_KEY, {
      expiresIn: '1h'
    });
    return {
      userId: user.id,
      token: token,
      tokenExpiration: 1
    };
  }
};
