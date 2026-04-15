import {
  DataTypes,
  Op,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  WhereOptions,
} from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

export type CustomerStatus = "Lead" | "Active" | "InActive";

export interface CustomerFilters {
  status?: string;
  search?: string;
}

class Customer extends Model<
  InferAttributes<Customer>,
  InferCreationAttributes<Customer>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare company: CreationOptional<string>;
  declare email: CreationOptional<string>;
  declare phone: CreationOptional<string>;
  declare city: CreationOptional<string>;
  declare status: CreationOptional<CustomerStatus>;
  declare notes: CreationOptional<string>;
  
  // New Fields for Creator Snapshot
  declare created_by: number;
  declare created_by_name: string;
  declare created_by_email: string;
  declare created_by_role: string;

  declare readonly created_at: CreationOptional<Date>;
  declare readonly updated_at: CreationOptional<Date>;

  static async findAllFiltered(filters: CustomerFilters) {
    const where: WhereOptions = {};

    if (filters.status && filters.status !== "All") {
      where["status"] = filters.status;
    }

    if (filters.search) {
      where["name"] = { [Op.like]: `%${filters.search}%` };
    }

    return Customer.findAll({
      where,
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email", "role"],
        },
      ],
      order: [["created_at", "DESC"]],
    });
  }
}

Customer.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING(150),
      defaultValue: "",
    },
    email: {
      type: DataTypes.STRING(150),
      defaultValue: "",
    },
    phone: {
      type: DataTypes.STRING(30),
      defaultValue: "",
    },
    city: {
      type: DataTypes.STRING(100),
      defaultValue: "",
    },
    status: {
      type: DataTypes.ENUM("Lead", "Active", "InActive"),
      defaultValue: "Lead",
    },
    notes: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    // The link ID
    created_by: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    // ✅ Extra fields for creator details
    created_by_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    created_by_email: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    created_by_role: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "customers",
    modelName: "Customer",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Customer;