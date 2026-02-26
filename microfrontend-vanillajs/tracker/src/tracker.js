import { title } from "../../components/title.js";
import { input } from "../../components/input.js";
import { button } from "../../components/button.js";

export const mountTrackingPage = () => {
  const rootDiv = document.getElementById("container");

  const bodyContainer = document.createElement("div");
  const pageTitle = title("Tracking");

  const foundShipment = document.createElement("div");

  const shipmentItemSearch = input("Search for your shipment");

  const searchBtn = button("Search", () => {
    if (!shipmentItemSearch.value) {
      return;
    }

    const filteredShipment = window.stateManager
      .getState()
      .shipments.filter((ship) => ship.id === shipmentItemSearch.value)[0];

    if (!filteredShipment) {
      foundShipment.innerHTML = `Shipment with ID ${shipmentItemSearch.value} was not found`;
      return;
    }

    foundShipment.innerHTML = JSON.stringify(filteredShipment);
  });

  bodyContainer.appendChild(pageTitle);
  bodyContainer.appendChild(shipmentItemSearch);
  bodyContainer.appendChild(searchBtn);
  bodyContainer.appendChild(foundShipment);
  bodyContainer.style.cssText = `
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 60vh;
    align-items: center;
`;

  rootDiv.appendChild(bodyContainer);
};
