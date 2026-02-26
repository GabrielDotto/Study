import { title } from "../components/title.js";
import { stateManager as stateContext } from "../state-management/index.js";
import { button } from "../components/button.js";

export const mountHomePage = async () => {
  const rootDiv = document.getElementById("container");

  const bodyContainer = document.createElement("div");
  const pageTitle = title(
    `Your counter value is ${stateContext.state.counter}`,
  );
  const counterLabel = title(stateContext.getCounter());
  const increaseCounterBtn = button("Increase", () => {
    stateContext.updateCounter(stateContext.getCounter() + 1);
    counterLabel.innerHTML = stateContext.getCounter();
    pageTitle.innerHTML = `Your counter value is ${stateContext.getCounter()}`;
  });

  bodyContainer.appendChild(pageTitle);
  bodyContainer.appendChild(counterLabel);
  bodyContainer.appendChild(increaseCounterBtn);

  bodyContainer.style.cssText = `
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 60vh;
    align-items: center;
`;

  rootDiv.appendChild(bodyContainer);
};
