import { Op, Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";
class Customer extends Model {
    static async findAllFiltered(filters) {
        const where = {};
        if (filters.status && filters.status !== "All") {
            where["status"] = filters.status;
        }
        if (filters.search) {
            where["name"] = { [Op.like]: `%${filters.search}%` };
        }
        return Customer.findAll({
            where,
            order: [["created_at", "DESC"]],
        });
    }
}
Customer.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 100],
        }
    },
    company: {
        type: DataTypes.STRING(150),
        allowNull: false,
        defaultValue: "",
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: true,
        defaultValue: "",
        validate: {
            isEmailOrEmpty(value) {
                if (value !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    throw new Error("Invalid email format");
                }
            },
        },
    },
    phone: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: "",
    },
    city: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: "",
    },
    status: {
        type: DataTypes.ENUM("Lead", "Active", "InActive"),
        allowNull: false,
        defaultValue: "Lead",
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: "",
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
}, {
    sequelize,
    tableName: "customers",
    modelName: "Customer",
});
export default Customer;
