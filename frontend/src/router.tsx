import { createBrowserRouter } from "react-router-dom";

import App from "./App";

/**
 * Single-route stub for now. Add routes as pages are built:
 *   { path: "/history", element: <History /> }
 *   { path: "*",        element: <Navigate to="/" replace /> }
 */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
]);
