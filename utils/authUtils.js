const isEmailValidate = ({ key }) => {
  const isEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
      key
    );
  return isEmail;
};

const userDataValidation = ({ email, username, password }) => {
  return new Promise((resolve, reject) => {
    if (!email || !username || !password) reject("Missing user data");

     //We can use return keyword before reject also
    //to prevent any further implementations happen after reject

    if (typeof email !== "string") reject("Email is not a text");
    if (typeof username !== "string") reject("Username is not a text");
    if (typeof password !== "string") reject("Password is not a text");

    if (username.length < 3 || username.length > 50)
      reject("Username length should be 3-50");

    if (!isEmailValidate({ key: email }))
      reject("Format of email is incorrect");

    resolve();
  });
};

module.exports = { userDataValidation, isEmailValidate };
