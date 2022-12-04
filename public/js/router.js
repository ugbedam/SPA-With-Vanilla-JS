import routes from './routes.js';

const root = document.getElementById('root');

//check the routes for matches
const match = () => {
  const exactMacth = routes.find(function (route) {
    return route.path === window.location.pathname;
  });
  return exactMacth;
};

//render path content to the dom
const dom = () => {
  const theMatch = match();
  if (!theMatch) {
    root.innerHTML = `<div style="text-align: center">
    <h1>404 Not Found</h1>
    <p>Oh no! It looks like the page you're trying to get to is missing!</p>
  </div>
  `;
  }
  root.innerHTML = theMatch.view();
  document.title = theMatch.title;
};

const router = {
  // match: match(),
  push: (url, state = null) => {
    history.pushState(null, '', url);
    dom();
  }
};

window.addEventListener('popstate', dom);
window.addEventListener('DOMContentLoaded', dom);

export default router;
