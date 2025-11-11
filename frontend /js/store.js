

export const Store = {
  token: null,
  admin: JSON.parse(localStorage.getItem("nexa_admin")) || null,
  students: [],

  setToken(tok) {
    this.token = tok;
    if (tok) localStorage.setItem("nexa_token", JSON.stringify(tok));
    
    
  
  },

  loadFromStorage() {
    const t = JSON.parse(localStorage.getItem("refCode"));
    if (t) this.referralCode = t;
    
    return t;
    
  },

  setAdmin(admin) {
    this.admin = admin;
    if (admin) localStorage.setItem("nexa_admin", JSON.stringify(admin));
    else localStorage.removeItem("nexa_admin");
    
  },

  getAdmin() {
    return this.admin;
  },

  setStudents(studs) {
    this.students = Array.isArray(studs) ? studs : [];
  },

  clearAll() {
    this.token = null;
    this.admin = null;
    this.students = [];
    localStorage.removeItem("nexa_token");
    localStorage.removeItem("nexa_admin"); // ✅ don't forget this
  }
};







