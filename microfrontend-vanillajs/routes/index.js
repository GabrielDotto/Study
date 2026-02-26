import { mountHomePage } from "../container/src/home.js";
import { mountTrackingPage } from "tracker/TrackerIndex";
import { mountShipmentsPage } from "shipments/ShipmentsIndex";

export const ROUTES = {
  "": mountHomePage,
  home: mountHomePage,
  tracking: mountTrackingPage,
  shipments: mountShipmentsPage,
};

export const navigate = (destinationRoute) => {
  const functionDestinationRoute = ROUTES[destinationRoute];

  if (!functionDestinationRoute) {
    console.error("destinationRoute not defined as possible route", ROUTES);
  }

  const rootDiv = document.getElementById("container");
  rootDiv.innerHTML = "";
  functionDestinationRoute();
};
