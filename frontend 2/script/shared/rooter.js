export class Router {
  constructor(routes, containerId) {
    this.routes = routes; // { home: renderHome, about: renderAbout, ... }
    this.container = document.getElementById(containerId);
    this.currentRoute = null;

    // Listen for back/forward navigation
    window.addEventListener("popstate", (e) => {
      const route = e.state?.route || "home";
      this.navigate(route, false);
    });
  }

  navigate(route, push = true) {
    if (!this.routes[route]) {
      console.warn(`Route not found: ${route}`);
      return;
    }

    // Clear the container
    this.container.innerHTML = "";

    // Render the new page
    this.routes[route](this.container);

    // Update history
    if (push) {
      history.pushState({ route }, "", `#${route}`);
    }

    // Track active route
    this.currentRoute = route;
  }

  start(defaultRoute = "home") {
    const route = location.hash.replace("#", "") || defaultRoute;
    this.navigate(route, false);
  }
}

function renderHome(container) {
  container.innerHTML = `
    <section class="page active">
      <h1>🏠 Home</h1>
      <p>Welcome to Nexa Router — light, fast, clean.</p>
    </section>
  `;
}

function renderAbout(container) {
  container.innerHTML = `
    <section class="page active">
      <h1>👤 About</h1>
      <p>This page was loaded dynamically via JS routing!</p>
    </section>
  `;
}