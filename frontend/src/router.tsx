import { createBrowserRouter } from "react-router-dom";

import App from "./App";
import Landing from "@/pages/Landing";
import { Processing } from "@/pages/Processing";
import { Results } from "@/pages/Results";
import { History } from "@/pages/History";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Landing /> },
      { path: "processing", element: <Processing /> },
      { path: "results/:id", element: <Results /> },
      { path: "history", element: <History /> },
    ],
  },
]);
