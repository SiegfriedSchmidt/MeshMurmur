import React from 'react';
import {Outlet} from "react-router-dom";
import Header from "../components/Header.tsx";
import VersionText from "@/components/VersionText.tsx";

const RootLayout = () => {
  return (
    <div style={{overflowX: 'hidden',}}>
      {/*<Header/>*/}
      {/*<VersionText/>*/}
      <Outlet/>
    </div>
  );
};

export default RootLayout;