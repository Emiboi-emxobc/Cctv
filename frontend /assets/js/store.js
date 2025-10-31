// assets/js/store.js
// very small global store — cached in-memory + persisted token in localStorage

export const Store = {
  token: null,
  admin: null,
  students: [],
  setToken(tok) {
    this.token = tok;
    if (tok) localStorage.setItem("nexa_token", tok);
    else localStorage.removeItem("nexa_token");
  },
  loadTokenFromStorage() {
    const t = localStorage.getItem("nexa_token");
    if (t) this.token = t;
    return t;
  },
  setAdmin(admin) {
    this.admin = admin;
  },
  setStudents(studs) {
    this.students = Array.isArray(studs) ? studs : [];
  },
  clearAll() {
    this.token = null; this.admin = null; this.students = [];
    localStorage.removeItem("nexa_token");
  }
};