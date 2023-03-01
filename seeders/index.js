/**
 * seeder.js
 * @description :: functions that seeds mock data to run the application
 */
const model = require('../model');
const dbService = require('../utils/dbService');
const bcrypt = require('bcrypt');

/* seeds default users */
async function seedUser () {
  try {
    let userToBeInserted = {};
    userToBeInserted = await dbService.findOne(model.user, { 'username': 'hardik' });
    if (!userToBeInserted) {
      userToBeInserted = {
        'password': '123456',
        'isDeleted': false,
        'username': 'hardik',
        'name': 'Hardik Godhani',
        'email': 'hardikgodhani6@gmail.com',
        'isActive': true
      };
      await dbService.createOne(model.user, userToBeInserted);
    } else {
      userToBeInserted = {
        'password': '123456',
        'isDeleted': false,
        'username': 'hardik',
        'name': 'Hardik Godhani',
        'email': 'hardikgodhani6@gmail.com',
        'isActive': true
      };
      userToBeInserted.password = await bcrypt.hash(userToBeInserted.password, 8);
      await dbService.update(model.user, { 'username': 'Berenice37' }, userToBeInserted);
    }
    console.info('User model seeded!!');
  } catch (error) {
    console.log('User seeder failed due to ', error.message);
  }
}

/* calls of functions to seed mock data into multiple collections */
async function seedData () {
  await seedUser();
};
module.exports = seedData;
