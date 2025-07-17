import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "antd/dist/reset.css";
import "./index.css";
import { Provider } from "react-redux";
import store from "./redux/store";
import App from "./App";

const RootApp = () => {
  return (
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RootApp />
);
