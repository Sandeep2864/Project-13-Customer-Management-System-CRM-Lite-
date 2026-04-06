// src/models/PasswordResetToken.ts
import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";
import sequelize from "../config/db.js";

class PasswordResetToken extends Model<
  InferAttributes<PasswordResetToken>,
  InferCreationAttributes<PasswordResetToken>
> {
  declare id: CreationOptional<number>;
  declare user_id: number;
  declare token: string;
  declare expires_at: Date;
  declare used: CreationOptional<boolean>;
  declare readonly created_at: CreationOptional<Date>;

  /** Returns true only if token hasn't been used AND hasn't expired */
  isValid(): boolean {
    return !this.used && new Date() < new Date(this.expires_at);
  }
}

PasswordResetToken.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    used: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created_at: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "password_reset_tokens",
    modelName: "PasswordResetToken",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);

export default PasswordResetToken;