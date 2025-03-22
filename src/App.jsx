import React, { Fragment } from 'react';
import { Routes, Route} from 'react-router';
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import {publicRoutes} from "@/routes";
import DefaultLayout  from "@/layout"



const App = () =>{
  return (
    <div>
      <Provider store={store}>
        <Routes>
          {publicRoutes.map((route,index) => {
            let Layout = DefaultLayout;
            if(route.layout){
              Layout = route.layout;
            }else if(route.layout === null){
              Layout = Fragment;
            }
            const Page = route.component;
            return <Route key = {index} path={route.path} element={
              <Layout>
                <Page/>
              </Layout>
          } />
          } )}
        </Routes>
      </Provider>
    </div>
  );
}

export default App
