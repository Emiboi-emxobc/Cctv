export const Referral = {
  getCode() {
    try {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("ref") || JSON.parse(localStorage.getItem("referralCode"));
      return code || "4123389";
    } catch {
      return null;
    }
  },
  save(code) {
    if (code) localStorage.setItem("referralCode", JSON.stringify(code));
  },
  init() {
    const code = this.getCode();
    if (code) this.save(code);
    return code;
  },
  appendToURL(url) {
    const code = this.getCode();
    if (!code) return url;
    const connector = url.includes("?") ? "&" : "?";
    return `${url}${connector}ref=${code}`;
  }
};