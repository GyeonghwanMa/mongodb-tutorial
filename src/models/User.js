const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    name: {
      first: { type: String, required: true },
      last: { type: String, required: true },
    },
    age: { type: Number, index: true },
    email: String,
  },
  { timestamps: true }
);

const User = model("user", UserSchema);
module.exports = { User };
