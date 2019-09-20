module.exports = function(sequelize, Sequelize) {
   const User = sequelize.define('user', {
      id: {
         type: Sequelize.UUID,
         primaryKey: true,
         defaultValue: Sequelize.UUIDV4
      },
      pilot: {
         type: Sequelize.STRING,
         allowNull: false
      },
      perms: {
         type: Sequelize.STRING,
         allowNull: false
      }
   });

   return User
}