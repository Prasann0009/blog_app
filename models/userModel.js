const userSchema = require("../schemas/userSchema");
const bcrypt = require("bcryptjs");
const ObjectId = require("mongodb").ObjectId;

const User = class {
  constructor({ name, email, username, password }) {
    this.name = name;
    this.email = email;
    this.username = username;
    this.password = password;
  }

  registerUser() {
    return new Promise(async (resolve, reject) => {
      //check if username or email is already exist or not

      const userExist = await userSchema.findOne({
        $or: [{ email: this.email }, { username: this.username }],
      });

      if (userExist && userExist.email === this.email) {
        reject("Email already exist");
      }

      //hashed the Password
      const hashedPassword = await bcrypt.hash(
        this.password,
        parseInt(process.env.SALT)
      );

      //store the data in db
      const userObj = new userSchema({
        name: this.name,
        email: this.email,
        username: this.username,
        password: hashedPassword,
      });

      try {
        const userDb = await userObj.save();
        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  static findUserWithKey({ key }) {
    return new Promise(async (resolve, reject) => {
      try {
        const userDb = await userSchema
          .findOne({
            $or: [
              ObjectId.isValid(key) ? { _id: key } : { email: key },
              { username: key },
            ], 
          })
          .select("+password");

        if (!userDb) reject("User not found, please register first");

        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }
};

module.exports = User;
