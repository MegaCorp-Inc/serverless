const { sq } = require("../config/db.js");
const { literal, DataTypes } = require("sequelize");
const logger = require("../services/logger.js");
const User = require("./userModel.js");

const UserVerification = sq.define(
  "userverification",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: literal("gen_random_uuid()"),
      primaryKey: true,
    },
    username_fk: {
      type: DataTypes.STRING,
      allowNull: false,
      foreignKey: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    email_sent_time: {
      type: DataTypes.DATE,
    },
    success_time: {
      type: DataTypes.DATE,
    },
  },
  { timestamps: false },
);

User.sync().then(() => {
  console.log("User model successfully synced!");
  
  UserVerification.belongsTo(User, {
    foreignKey: "username_fk",
    targetKey: "username",
  });
  
  UserVerification.sync().then(() => {
    logger.info("User userVerification model successfully synced!");
  });
});



module.exports = UserVerification;
