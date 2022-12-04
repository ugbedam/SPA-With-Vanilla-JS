import router from './js/router.js';

const Nav = () => {
  const dashboard = document.getElementById('dashboard');
  const users = document.getElementById('users');
  const add = document.getElementById('add-user');
  dashboard.addEventListener('click', () => router.push('/'));
  add.addEventListener('click', () => router.push('/add-user'));
  users.addEventListener('click', () => router.push('/show-users'));
};

export default Nav;
