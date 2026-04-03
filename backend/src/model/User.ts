
import { DataType,InferCreationAttributes,InferAttributes,CreationOptional, Model, DataTypes } from "sequelize";
import bcrypt from "bcryptjs";
import sequelize from "../config/db.js";

class User extends Model<InferAttributes<User>,InferCreationAttributes<User>> {

    declare id:CreationOptional<number>;
    declare name:string;
    declare email:string;
    declare password:string;
    declare role:"admin"|"superadmin";
    declare is_active:CreationOptional<boolean>;
    declare readonly created_at:CreationOptional<Date>;
    declare readonly updaed_at:CreationOptional<Date>;
}

User.init(
    {
        id:{
            type:DataTypes.INTEGER.UNSIGNED,
            autoIncrement:true,
            primaryKey:true,
        },
        name:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true,
        },
        password: {
            type:DataTypes.STRING,
            allowNull:false,
        },
    },
    {
        sequelize,
        tableName:"users",
    }
);

export default User;
