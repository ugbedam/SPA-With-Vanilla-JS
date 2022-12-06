//create users function
export function createUser() {
  const payload = new FormData(form);
  console.log(payload);

  //headers must be specified if body is not a formData
  fetch('/api/users', {
    method: 'POST',
    body: payload
  })
    .then((res) => {
      if (!res.ok) throw 'Network response was not OK';
      return res.json();
    })
    .catch((err) => console.log(err));
}

//get users function
export function getUsers() {
  fetch('/api/users')
    .then((res) => {
      if (!res.ok) throw 'Unable to get users';
      return res.json();
    })
    .then((users) => {
      users.forEach((user) => {
        const list = document.getElementById('users-list');
        const li = document.createElement('li');
        li.innerText = `${user.first} ${user.last} - ${user.title}`;
        list.appendChild(li);
      });
    })
    .catch((err) => console.log(err));
}
