import React from 'react';
import { createBrowserRouter, RouterProvider} from 'react-router';
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { ToastContainer } from 'react-toastify';
import routes from "@/routes/routes";

const router = createBrowserRouter(routes);


const App = () =>{
  return (
    <div>
      <Provider store={store}>
        <ToastContainer/>
          <RouterProvider router={router} />
      </Provider>
    </div>
  );
}

export default App
