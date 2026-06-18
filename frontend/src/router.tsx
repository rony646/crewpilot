import { createBrowserRouter } from "react-router-dom";

import { GuestOnly } from "@/components/auth/GuestOnly";
import { RequireAuth } from "@/components/auth/RequireAuth";
import App from "./App";
import Landing from "@/pages/Landing";
import { Processing } from "@/pages/Processing";
import { Results } from "@/pages/Results";
import { History } from "@/pages/History";
import { Login } from "./pages/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <RequireAuth>
            <Landing />
          </RequireAuth>
        ),
      },
      {
        path: "processing",
        element: (
          <RequireAuth>
            <Processing />
          </RequireAuth>
        ),
      },
      {
        path: "results/:id",
        element: (
          <RequireAuth>
            <Results />
          </RequireAuth>
        ),
      },
      {
        path: "history",
        element: (
          <RequireAuth>
            <History />
          </RequireAuth>
        ),
      },
      {
        path: "login",
        element: (
          <GuestOnly>
            <Login />
          </GuestOnly>
        ),
      },
    ],
  },
]);
