"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  class Transaction extends Model {}
  Transaction.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      account_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { sequelize, modelName: "Transaction" }
  );
  Transaction.associate = (models) => {
    Transaction.belongsTo(models.Account, { foreignKey: "account_id" });
  };
  return Transaction;
};
