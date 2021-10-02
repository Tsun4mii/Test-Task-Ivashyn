'use strict'

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User",{
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
        },
        pdf: {
            type: DataTypes.BLOB,
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false
        }
    })
    return User;
}
