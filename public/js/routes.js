import Dashboard from '../Dashboard.js';
import AddUser from '../AddUser.js';
import ShowUsers from '../ShowUsers.js';

const routes = [
  {
    path: '/',
    view: Dashboard,
    title: 'Dashboard'
  },

  {
    path: '/add-user',
    view: AddUser,
    title: 'AddUser'
  },

  {
    path: '/show-users',
    view: ShowUsers,
    title: 'ShowUsers'
  }
];

export default routes;
