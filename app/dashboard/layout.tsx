import SideNav from "@/app/dashboard/sidenav";
import {manrope} from "@/app/fonts";

export default function Layout({children} : {children: React.ReactNode}) {
    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64 dark:bg-gray-600">
                <SideNav />
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12 dark:bg-gray-700">{children}</div>
        </div>
    );
}