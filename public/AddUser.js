import { createUser } from './js/api.js';

const AddUser = () => {
  setTimeout(() => {
    const form = document.getElementById('form');
    //Event handler function
    function submitUser(event) {
      event.preventDefault();
      createUser();
      form.reset();
    }

    form.addEventListener('submit', submitUser);
  }, 300);

  return `
    <main class="main">
    <section class="form">
      <div>
        <h2>Registration</h2>
        <form id="form" autocomplete="off" enctype="multipart/form-data">
          <p>
            <label for="first"> First name:</label><br />
            <input type="text" name="first" id="first" required />
          </p>
          <p>
            <label for="last"> Last name: </label><br />
            <input type="text" name="last" id="last" required />
          </p>
          <p>
            <label for="title">Job Title: </label><br />
            <input type="text" name="title" id="title" required />
          </p>
          <p>
            <label for="website"> Website: </label><br />
            <input type="text" name="website" id="website" required />
          </p>
  
          <h3>Attach Documents</h3>
          <p>
            <label for="file">Attach File:</label><br />
            <input
              type="file"
              id="file"
              name="file"
              accept=".jpg, .png, .pdf"
              multiple
              required
            />
          </p>
          <p>
            <input
              class="submit"
              type="submit"
              id="submit"
              value="Submit"
              required
            />
          </p>
        </form>
      </div>
    </section>
  </main>
  
    `;
};

export default AddUser;
