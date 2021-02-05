import React from "react";

import { Provider } from "react-redux";
import store from "./store";
import PurchasPage from "./PurchasePage";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
	return (
		<Provider store={store}>
			<PurchasPage />
		</Provider>
	);
}

export default App;
