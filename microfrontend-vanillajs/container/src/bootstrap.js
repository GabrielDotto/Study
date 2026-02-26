import { navigate } from "../../routes/index.js";
import { mountHeader } from "../../components/header.js";
export { stateManager } from "../../state-management/index.js";

const headerDiv = document.getElementById("header");

const header = mountHeader();

headerDiv.appendChild(header);

navigate("");
