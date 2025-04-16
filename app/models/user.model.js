module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
      username: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      localisation: {
        type: Sequelize.STRING
      },
      tel1: {
        type: Sequelize.STRING
      },
      tel2: {
        type: Sequelize.STRING
      },
    });
  
    return User;
};