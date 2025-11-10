export const Store = {
  referralCode: null,
  admin: JSON.parse(localStorage.getItem("nexa_admin")) || null,
  setToken(ref) {
    this.referralCode = ref;
    if (ref) localStorage.setItem("ref-code", JSON.stringify(tok));
  },

  loadrefFromStorage() {
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