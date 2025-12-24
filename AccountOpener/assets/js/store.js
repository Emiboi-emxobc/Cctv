
//store
export async function getHelp(studentId) {
  if (!studentId) {
    console.warn("getHelp: userId missing");
    return null;
  }

  try {
    const res = await fetch(
      `https://prosper-cub-1.onrender.com/help/user/${encodeURIComponent(studentId)}`
    );

    

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || `HTTP ${res.status}`);
    }
    
    if (!data.success) {
      return [{label:"Nothing",tel:9900}];
    }
localStorage.setItem("help", JSON.stringify(data.data))
    return data.data; // contactMethods only

  } catch (err) {
    console.error("getHelp failed:", err.message);
    return [{label:"Get code via Whatsap",tel:"+23491******45"}];
  }
}


