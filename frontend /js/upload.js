import {toggleLoader} from '/loader.js';

// upload.js (frontend)
export async function uploadImage({ file, type = "avatar", token }) {
  toggleLoader(true) ;
  if (!file) {
    alert("Choose an image first");
    return null;
  }
  const formData = new FormData();
  formData.append("image", file);
  formData.append("type", type);

  try {
    const res = await fetch("https://your-domain-or-ip:5000/admin/upload-cloud", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await res.json();
    console.log("upload response", data);
    if (data.success) {
      // update avatar/banner element(s)
      if (type === "avatar") {
        const el = document.querySelector(".profile-avatar");
        if (el) el.src = data.imageUrl;
      } else {
        const el = document.querySelector(".profile-banner");
        if (el) el.src = data.imageUrl;
      }
      return data.imageUrl;
    } else {
      alert("Upload failed: " + (data.error || data.message));
      return null;
    }
  } catch (err) {
    console.error("Upload error:", err);
    alert("Upload error. Check console.");
    return null;
  } finally {
    toggleLoader(false) 
  }
}
