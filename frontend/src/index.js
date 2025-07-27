import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css';
import { UserSessionProvider } from "./context/UserSessionContext";
import { NotificationsProvider } from "./context/NotificationContext";

console.log("Starting application");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <UserSessionProvider>
    <NotificationsProvider>
      <App />
    </NotificationsProvider>
  </UserSessionProvider>
);
