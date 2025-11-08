// --- Feedback helper ---
export function showFeedback(titleText, msg, btnText = "Ok") {
  // container
  const con = document.createElement("div");
  con.className = "feedback-con";

  // feedback box
  const feedback = document.createElement("div");
  feedback.className = "feedback";

  // title
  const titleEl = document.createElement("h3");
  titleEl.textContent = titleText;
  feedback.appendChild(titleEl);

  // description
  const desc = document.createElement("p");
  desc.innerHTML = msg;
  feedback.appendChild(desc);

  // button
  const button = document.createElement("button");
  button.className = "fb-btn pri-btn";
  button.textContent = btnText;
  button.onclick = () => con.remove(); // remove container on click

  // button container
  const btnCon = document.createElement("div");
  btnCon.className = "fr-end";
  btnCon.appendChild(button);
  feedback.appendChild(btnCon);

  // append feedback to container
  con.appendChild(feedback);

  // append to body
  document.body.appendChild(con);
  document.addEventListener("click",() =>{
    con.remove()
  })
}

