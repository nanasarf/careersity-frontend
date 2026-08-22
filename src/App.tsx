import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { store } from "./app/store";
import { router } from "./app/router";
import SessionRestorer from "./features/auth/components/SessionRestorer";

export default function App() {
  return (
    <Provider store={store}>
      <SessionRestorer />
      <RouterProvider router={router} />
    </Provider>
  );
}
