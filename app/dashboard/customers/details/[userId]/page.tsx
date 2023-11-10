'use client'

import React, {useEffect, useState} from "react";
import {api} from "@/app/axios-instance";
import {Skeleton} from "antd";
import imageLoading from "@/public/laodingimg.jpg"

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
        <div className="mx-auto my-0">
            <div className="drop-shadow-2xl">
                {loading ? (
                    <>
                        <h2 className="text-2xl text-black dark:text-white">Loading....</h2>
                        <Skeleton paragraph={{ rows: 4 }} active />
                        <Skeleton paragraph={{ rows: 4 }} active />
                    </>
                ): (
                    <>
                        <div className="flex mt-12 justify-center items-center overflow-hidden">
                            {loading ? (
                                <>
                                    <img src={imageLoading} className="shrink-0 min-w-full" style={{maxHeight: "300px", objectFit: "cover"}} />
                                </>
                            ) : (
                                <>
                                    <img src={user?.imageMain} className="shrink-0 min-w-full" style={{maxHeight: "300px", objectFit: "cover"}} />
                                </>
                            )}

                        </div>
                        <div className="p-12 flex leading-6
                                    bg-neutral-200 dark:bg-neutral-700" style={{marginTop: "-100px"}}>
                            <div className="p-5 text-black dark:text-white" style={{flex: '20%', maxWidth: '20%'}}>
                                <div className="mb-6">
                                    <img src={user?.image} className="rounded-full" alt="User-Profile-Image" />
                                </div>
                                <h3 className="text-xl">Username: {user?.username}</h3>
                                <h3 className="text-xl">Fullname: {user?.fullname}</h3>
                            </div>
                            <div className="p-5 text-black dark:text-white mt-12" style={{flex: '80%', maxWidth: '80%'}}>
                                <h6 className="pb-1.5 mb-5 text-4xl font-extrabold border border-solid border-b-black dark:border-b-white">Information</h6>
                                <div className="flex">
                                    <div className="mr-5">
                                        <p className="mb-2.5 font-bold f-w-600">Email</p>
                                        <h6 className="f-w-400">{user?.email}</h6>
                                    </div>
                                    <div className="mr-5">
                                        <p className="mb-2.5 font-bold f-w-600">Phone</p>
                                        <h6 className="f-w-400">{user?.phone}</h6>
                                    </div>
                                    <div className="mr-5">
                                        <p className="mb-2.5 font-bold f-w-600">Department</p>
                                        <h6 className="f-w-400">{user?.department}</h6>
                                    </div>
                                    <div className="mr-5">
                                        <p className="mb-2.5 font-bold f-w-600">Position</p>
                                        <h6 className="f-w-400">{user?.positions}</h6>
                                    </div>
                                    <div className="mr-5">
                                        <p className="mb-2.5 font-bold f-w-600">Created Date</p>
                                        <h6 className="f-w-400">{user?.createDate}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}