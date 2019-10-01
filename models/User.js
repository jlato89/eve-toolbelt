module.exports = function(sequelize, Sequelize) {
   const User = sequelize.define('user', {
      characterID: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         allowNull: false
      },
      characterName: {
         type: Sequelize.STRING,
         allowNull: false
      },
      characterOwnerHash: {
         type: Sequelize.STRING,
         allowNull: false
      },

      expiresOn: {
         type: Sequelize.DATE,
         allowNull: false
      },
      scopes: {
         type: Sequelize.TEXT,
         allowNull: false
      },
      tokenType: {
         type: Sequelize.STRING,
         allowNull: false
      }
   });

   return User
}