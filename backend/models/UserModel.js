import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.signUp = async function (email, password) {
  if (!email || !password) throw Error("All fields must be filled");

  if (!validator.isEmail(email)) throw Error("Email is not valid");

  if (!validator.isStrongPassword(password)) throw Error("Password is not strong enough");

  const emailExists = await this.findOne({ email });

  if (emailExists) throw Error("Email already in use");

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = await this.create({ email, password: hash });

  return user;
};

userSchema.statics.login = async function (email, password) {
  if (!email || !password) throw Error("All fields must be filled");

  const userExists = await this.findOne({ email });

  if (!userExists) throw Error("Incorrect Email");

  const isCorrectPassword = await bcrypt.compare(password, userExists.password);

  if (!isCorrectPassword) throw Error("Incorrect password");

  return userExists;
};

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
