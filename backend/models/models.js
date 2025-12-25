import { Sequelize, DataTypes } from "sequelize";

export const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite"
});

// User model
export const User = sequelize.define("User", {
    username: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING
});

// Note model
export const Note = sequelize.define("Note", {
    userId: { type: DataTypes.INTEGER, allowNull: false }, // FK to User
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    class: DataTypes.STRING,
    labels: { type: DataTypes.JSON, defaultValue: [] },
    keywords: { type: DataTypes.JSON, defaultValue: [] },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    attachmentPath: DataTypes.STRING
});

// Define association
User.hasMany(Note, { foreignKey: "userId" });
Note.belongsTo(User, { foreignKey: "userId" });
