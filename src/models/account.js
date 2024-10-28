"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  class Account extends Model {}
  Account.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      balance: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0,
      },
    },
    { sequelize, modelName: "Account" }
  );
  return Account;
};
