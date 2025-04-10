import React from "react";
import { Link } from "react-router";
function Breadcrumb() {
    const items=[
        {
          title: 'Home',
        },
        {
          title: <Link href="">Application Center</Link>,
        },
        {
          title: <Link href="">Application List</Link>,
        }
      ];
      
    return (
        <>
            <Breadcrumb items={items} />
        </>
    );
}

export default Breadcrumb;