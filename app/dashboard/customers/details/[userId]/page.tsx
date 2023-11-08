'use client'

import React, {useEffect, useState} from "react";
import {api} from "@/app/axios-instance";
import {Skeleton} from "antd";

export default function Page({
    params: {userId},
}: {
    params: {
        userId: string
    };
}) {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/users/${userId}`).then(res => {
            setUser(res.data);
            setLoading(false);
        }).catch(e => console.log(e));
    }, [])

    return (
        <div id="page-content">
            <div className="border-none mb-7 rounded-md	">
                <div className="p-12 flex bg-gradient-to-r from-teal-700 from-24% to-fuchsia-600 to-100%">
                    {loading ? (
                        <>
                            <h2 className="text-black text-2xl dark:text-white">Loading....</h2>
                            <Skeleton paragraph={{ rows: 4 }} active />
                            <Skeleton paragraph={{ rows: 4 }} active />
                        </>
                    ): (
                        <>
                            <div className="p-5" style={{flex: '20%', maxWidth: '20%'}}>
                                <div className="mb-6">
                                    <img src={user?.image} className="rounded-full" alt="User-Profile-Image" />
                                </div>
                                <h3 className="text-white text-xl">Username: {user?.username}</h3>
                                <h3 className="text-white text-xl">Fullname: {user?.fullname}</h3>
                            </div>
                            <div className="p-5" style={{flex: '80%', maxWidth: '80%'}}>
                                <h6 className="pb-1.5 mb-5 text-white text-4xl font-extrabold border border-solid border-y-white">Information</h6>
                                <div className="flex">
                                    <div className="mr-5">
                                        <p className="mb-2.5 font-bold text-white f-w-600">Email</p>
                                        <h6 className="text-white f-w-400">{user?.email}</h6>
                                    </div>
                                    <div className="mr-5">
                                        <p className="mb-2.5 font-bold text-white f-w-600">Phone</p>
                                        <h6 className="text-white f-w-400">{user?.phone}</h6>
                                    </div>
                                    <div className="mr-5">
                                        <p className="mb-2.5 font-bold text-white f-w-600">Department</p>
                                        <h6 className="text-white f-w-400">{user?.department}</h6>
                                    </div>
                                    <div className="mr-5">
                                        <p className="mb-2.5 font-bold text-white f-w-600">Position</p>
                                        <h6 className="text-white f-w-400">{user?.positions}</h6>
                                    </div>
                                    <div className="mr-5">
                                        <p className="mb-2.5 font-bold text-white f-w-600">Created Date</p>
                                        <h6 className="text-white f-w-400">{user?.createDate}</h6>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}