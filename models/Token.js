module.exports = function(sequelize, Sequelize) {
   const Token = sequelize.define('token', {
      characterID: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         allowNull: false
      },
      accessToken: {
         type: Sequelize.TEXT,
         allowNull: false
      },
      refreshToken: {
         type: Sequelize.TEXT,
         allowNull: false
      }
   });

   return Token;
};
