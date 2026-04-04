
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
    declare readonly updated_at:CreationOptional<Date>;
  
    async comparePassword(plainPassword:string):Promise<boolean> {
        return bcrypt.compare(plainPassword,this.password);
    }

    static async findByEmail(email:string):Promise<User|null> {
        return User.findOne({where:{email}})
    }

    static async findAllAdmins():Promise<User[]> {
        return User.findAll({
            where:{role:"admin"},
            order:[["created_at","DESC"]],
        })
    }
}

User.init(
    {
        id:{
            type:DataTypes.INTEGER.UNSIGNED,
            autoIncrement:true,
            primaryKey:true,
        },
        name:{
            type:DataTypes.STRING(100),
            allowNull:false,
            validate: {
                notEmpty:true,
                len:[1,100],
            },
        },
        email:{
            type:DataTypes.STRING(150),
            allowNull:false,
            unique:true,
            validate: {
                isEmail:true,
                notEmpty:true,
            }
        },
        password: {
            type:DataTypes.STRING(255),
            allowNull:false,
        },
        role: {
            type:DataTypes.ENUM("admin","superadmin"),
            allowNull:false,
            defaultValue:"admin",
        },
        is_active:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue:true,
        },

        created_at:DataTypes.DATE,
        updated_at: DataTypes.DATE,
    },
    {
        sequelize,
        tableName:"users",
        modelName:"User"
    }
);

User.beforeCreate(async (user: User) => {
    const salt=await bcrypt.genSalt(10);
    user.password=await bcrypt.hash(user.password,salt);
});

User.beforeUpdate(async (user:User) => {
    if(user.changed("password")) {
       const salt=await bcrypt.genSalt(10);
       user.password=await bcrypt.hash(user.password,salt);
    }
});

export default User;
