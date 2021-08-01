const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  highScore: { type: Number, default: 0 }
});

userSchema.pre('save', async next =>
{
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isValidPassword = async password => await bcrypt.compare(password, this.password);

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;
