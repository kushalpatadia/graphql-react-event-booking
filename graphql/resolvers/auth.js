const User = require('../../models/user');
const bcrypt = require('bcryptjs');

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
  }
};
