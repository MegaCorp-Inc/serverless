const { sq } = require("../config/db.js");
const { literal, DataTypes } = require("sequelize");

const User = sq.define(
  "user",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: literal("gen_random_uuid()"),
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    account_created: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    account_updated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { timestamps: false },
);

module.exports = User;
