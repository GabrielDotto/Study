import { stateManager } from "../../state-management/index.js";
import("./bootstrap.js");

// Just proof of Concept! In real scenarios we should use other strategies like. Redux / Custom Events / Browser Storage APIs / Server-Side Communication
window.stateManager = stateManager;
