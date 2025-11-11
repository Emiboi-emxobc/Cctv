export const Store = {
  referralCode: null,
  
  admin: JSON.parse(localStorage.getItem("nexa_admin")) || null,
  setRef(ref) {
    this.referralCode = ref;
    if (ref) localStorage.setItem("referralCode", JSON.stringify(ref));
  },
  
  

  setAdmin(admin) {
    this.admin = admin;
    if (admin) localStorage.setItem("nexa_admin", JSON.stringify(admin));
    else localStorage.removeItem("nexa_admin");
  },

  
};