
import { DataType,InferCreationAttributes,InferAttributes,CreationOptional, Model } from "sequelize";
import dotenv from 'dotenv';

async class User:<InferAttributes<User>,InferCreationAttributes<User> extends Model {

}