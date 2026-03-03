import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: "AIzaSyATyHx0RyW2JfnGa0qgpukkl1KK9kWgtHY",
  authDomain: "serveless-poc.firebaseapp.com",
  projectId: "serveless-poc",
  storageBucket: "serveless-poc.firebasestorage.app",
  messagingSenderId: "615140420984",
  appId: "1:615140420984:web:6e23f6bb0ab62ce8c8ac8d",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get a list of products from your database
async function getProductsFromFirestore(db) {
  const productsCollection = collection(db, "products");
  const productsSnapshot = await getDocs(productsCollection);
  const productsList = productsSnapshot.docs.map((doc) => doc.data());
  return productsList[0];
}

document.addEventListener("DOMContentLoaded", async () => {
  const products = await getProductsFromFirestore(db);

  const appDiv = document.getElementById("app");
  appDiv.innerHTML += `<h1>Products</h1>`;
  console.log("products", products);
  products.guitars.forEach((guitar) => {
    appDiv.innerHTML += `<h3>${guitar}</h3>`;
  });
});
