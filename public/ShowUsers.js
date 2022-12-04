import { getUsers } from './js/api.js';

const ShowUsers = () => {
  setTimeout(() => {
    const list = document.getElementById('users-list');
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
    getUsers();
  }, 300);

  return `
  <ol id="users-list"></ol>
  `;
};

export default ShowUsers;
