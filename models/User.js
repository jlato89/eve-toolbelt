module.exports = function(sequelize, Sequelize) {
   const User = sequelize.define('user', {
      id: {
         type: Sequelize.UUID,
         primaryKey: true,
         defaultValue: Sequelize.UUIDV4
      },
      characterID: {
         type: Sequelize.INTEGER,
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
         type: Sequelize.STRING,
         allowNull: false
      },
      tokenType: {
         type: Sequelize.STRING,
         allowNull: false
      },
      accessToken: {
         type: Sequelize.STRING,
         allowNull: false
      },
      refreshToken: {
         type: Sequelize.STRING,
         allowNull: false
      }
   });

   return User
}