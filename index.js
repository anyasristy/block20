const API_BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2409-ftb-et-web-pt/events";
let state = {
  parties: [],
  select: null,
};
function render() {
  const app = document.querySelector("#app");
  app.innerHTML = "";
  const title = document.createElement("h1");
  title.textContent = "Party";
  app.appendChild(title);
  const container = document.createElement("div");
  container.classList.add("container");
  app.appendChild(container);
  container.appendChild(parties_soon()); 
  container.appendChild(party_detail());
}
function parties_soon() {
  const div = document.createElement("div");
  div.classList.add("sidebar");
  const heading = document.createElement("h2");
  heading.textContent = "Upcoming Parties";
  div.appendChild(heading);
  if (state.parties.length === 0) {
    const msg = document.createElement("p");
    msg.textContent = "Loading parties...";
    div.appendChild(msg);
    return div;
  }
  state.parties.forEach((party) => {
    const button = document.createElement("button");
    button.textContent = party.name;
    button.classList.add("party-button");
    if (state.select && state.select.id === party.id) {
      button.classList.add("selected");
    }
    button.addEventListener("click", async () => {
      await fetch_details(party.id);
      render();
    });
    div.appendChild(button);
  });
  return div;
}
function party_detail() {
  const div = document.createElement("div");
  div.classList.add("details");
  const heading = document.createElement("h2");
  heading.textContent = "Party Details";
  div.appendChild(heading);
  if (!state.select) {
    const msg = document.createElement("p");
    msg.textContent = "Select to see details.";
    div.appendChild(msg);
    return div;
  }
  const party = state.select;
  const title = document.createElement("h3");
  title.textContent = `${party.name} #${party.id}`;
  div.appendChild(title);
  const date = document.createElement("p");
  date.textContent = party.date;
  div.appendChild(date);
  const location = document.createElement("p");
  location.textContent = party.location;
  location.classList.add("location");
  div.appendChild(location);
  const desc = document.createElement("p");
  desc.textContent = party.description;
  div.appendChild(desc);
  return div;
}
async function fetchParties() {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error("Failed to fetch parties");
    const json = await res.json();
    state.parties = json.data;
  } catch (err) {
    console.error(err);
    alert("Error loading parties");
  }
}
async function fetch_details(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error("Failed to fetch party details");
    const json = await res.json();
    state.select = json.data;
  } catch (err) {
    console.error(err);
    alert("Error loading party details");
  }
}
(async function init() {
  await fetchParties();
  render();
})();

