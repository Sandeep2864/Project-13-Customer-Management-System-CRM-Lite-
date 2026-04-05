

import { DataType,Op,Model,InferAttributes,InferCreationAttributes,CreationOptional,WhereOptions, DataTypes } from "sequelize";
import sequelize from "../config/db.js";

export type CustomerStatus="Lead"|"Active"|"InActive";

export interface CustomerFilters {
    status?: string;
    search?: string;
}

class Customer extends Model<InferAttributes<Customer>,InferCreationAttributes<Customer>> {
     declare id:CreationOptional<number>;
     declare name:string;
     declare company: CreationOptional<string>;
     declare email:CreationOptional<string>;
     declare phone: CreationOptional<string>;
     declare city:CreationOptional<string>;
     declare status:CreationOptional<CustomerStatus>;
     declare notes: CreationOptional<String>;
     declare readonly created_at: CreationOptional<Date>;
     declare readonly updated_at: CreationOptional<Date>;

     static async findAllFiltered(filters: CustomerFilters):Promise<Customer[]> {
        const where: WhereOptions={};

        if(filters.status && filters.status!=="All") {
            where["status"]=filters.status;
        }

        if(filters.search) {
            where["name"]={[Op.like]:`%${filters.search}%`}
        }

        return Customer.findAll({
            where,
            order: [["created_at","DESC"]],
        })
     }
}

Customer.init({
    id: {
        type:DataTypes.INTEGER.UNSIGNED,
        autoIncrement:true,
        primaryKey:true,
    },
    name: {
        type:DataTypes.STRING(100),
        allowNull:false,
        validate:{
            notEmpty:true,
            len:[1,100],
        }
    },
    company : {
        type: DataTypes.STRING(150),
        allowNull:false,
        defaultValue:"",
    },
    email : {
        type: DataTypes.STRING(150),
        allowNull:true,
        defaultValue:"",
        validate: {
            isEmailOrEmpty(value: string) {
          if (value !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            throw new Error("Invalid email format");
          }
        },
        },
    },
    phone: {
        type: DataTypes.STRING(30),
        allowNull:true,
        defaultValue:"",
    },
    city: {
        type:DataTypes.STRING(100),
        allowNull:true,
        defaultValue:"",
    },
    status: {
        type:DataTypes.ENUM("Lead","Active","InActive"),
        allowNull: false,
        defaultValue:"Lead",
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull:true,
        defaultValue:"",
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
},
{
    sequelize,
    tableName:"customers",
    modelName:"Customer",
}
);

export default Customer;