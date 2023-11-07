'use client'

import {useEffect, useState} from "react";
import {api} from "@/app/axios-instance";
import '../styles.css'

export default function Page({
    params: {userId},
}: {
    params: {
        userId: string
    };
}) {
    const [user, setUser] = useState();

    useEffect(() => {
        api.get(`/users/${userId}`).then(res => {
            setUser(res.data)
        }).catch(e => console.log(e));
    }, [])

    return (
        <div id="page-content">
            <div className="card user-card-full">
                <div className="userCard">
                    <div className="card-block">
                        <div className="m-b-25">
                            <img src={user?.image} className="img-radius" alt="User-Profile-Image" />
                        </div>
                        <h6 className="f-w-600">{user?.fullname}</h6>
                        <p>Username: {user?.username}</p>
                        <i className=" mdi mdi-square-edit-outline feather icon-edit m-t-10 f-16"></i>
                    </div>
                    <div className="card-block">
                        <h6 className="m-b-20 p-b-5 b-b-default f-w-600">Information</h6>
                        <div className="row">
                            <div className="infoPart">
                                <p className="m-b-10 f-w-600">Email</p>
                                <h6 className="text-muted f-w-400">{user?.email}</h6>
                            </div>
                            <div className="infoPart">
                                <p className="m-b-10 f-w-600">Phone</p>
                                <h6 className="text-muted f-w-400">{user?.phone}</h6>
                            </div>
                            <div className="infoPart">
                                <p className="m-b-10 f-w-600">Department</p>
                                <h6 className="text-muted f-w-400">{user?.department}</h6>
                            </div>
                            <div className="infoPart">
                                <p className="m-b-10 f-w-600">Position</p>
                                <h6 className="text-muted f-w-400">{user?.positions}</h6>
                            </div>
                            <div className="infoPart">
                                <p className="m-b-10 f-w-600">Created Date</p>
                                <h6 className="text-muted f-w-400">{user?.createDate}</h6>
                            </div>
                        </div>
                        <ul className="social-link list-unstyled m-t-40 m-b-10">
                            <li><a href="#!" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="facebook" data-abc="true"><i className="mdi mdi-facebook feather icon-facebook facebook" aria-hidden="true"></i></a></li>
                            <li><a href="#!" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="twitter" data-abc="true"><i className="mdi mdi-twitter feather icon-twitter twitter" aria-hidden="true"></i></a></li>
                            <li><a href="#!" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="instagram" data-abc="true"><i className="mdi mdi-instagram feather icon-instagram instagram" aria-hidden="true"></i></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}