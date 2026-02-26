import { navigate } from "./routes/index";
import { mountHeader } from "./components/header.js";
export { stateManager as stateContext } from "./state-management/index.js";

const headerDiv = document.getElementById("header");

const header = mountHeader();

headerDiv.appendChild(header);

await navigate("");
