import {useState} from "react";
import { Outlet } from "react-router-dom";
import AdminSideBar from "./sidebar";
import AdminHeader from "./header";

function AdminLayout(){

    const [openSideBar, setOpenSidebar] = useState(false);
    return (
        <div className="flex min-h-screen w-full">
            {/** admin side bar */}
            <AdminSideBar  open={openSideBar} setOpen={setOpenSidebar}/>
            <div className="flex flex-1 flex-col">
                {/*** admin header */}
                <AdminHeader  setOpen={setOpenSidebar}/>
                <main className="flex-1 flex-col bg-muted/40 p-4 md:p-6">

                    <Outlet/>
                </main>
            </div>
        </div>
    )
}
export default AdminLayout;