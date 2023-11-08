'use client'

import React, {useState, useEffect} from 'react';
import {api} from "@/app/axios-instance";
import {Skeleton} from "antd";

export default function Page({
    params: {productId},
}: {
    params: {
        productId: string
    };
}) {
    const [product, setProduct] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/product/${productId}`).then(res => {
            setProduct(res.data);
            setLoading(false);
        }).catch(e => console.log(e));
    }, [])

    return (
        <div className="max-w-7xl mx-auto my-0">
            <div className="mb-8 drop-shadow-2xl">
                <div className="p-12 mt-12 leading-6
                                bg-gradient-to-r from-teal-700 from-24% to-fuchsia-600 to-100%">
                    {loading ? (
                        <>
                            <h2 className="text-black text-2xl dark:text-white">Loading....</h2>
                            <Skeleton paragraph={{ rows: 4 }} active />
                            <Skeleton paragraph={{ rows: 4 }} active />
                        </>
                    ) : (
                        <div className="container-fliud">
                            <div className="flex row">
                                <div className="preview col-md-6">
                                    <div className="mr-5">
                                        <div className="w-full active drop-shadow-2xl" id="pic-1"><img src={product?.image} /></div>
                                    </div>
                                </div>
                                <div className="details col-md-6 text-white">
                                    <small className="products__sale
                                                  text-white
                                                  py-1.5 px-2.5 top-0 right-0
                                                  rounded-ee-xl
                                                  bg-gradient-to-r from-fuchsia-500 from-0% via-indigo-700 via-100% to-fuchsia-600 to-100%">{product?.discount}% DISCOUNT</small>
                                    <h3 className="mt-0 text-2xl">{product?.productName}</h3>
                                    <div className="mb-4">
                                        <span className="text-teal-300">{product?.ratingPoint}</span><span> reviews</span>
                                    </div>
                                    <p className="mb-4">{product?.description}</p>
                                    <h4 className="mb-4 uppercase">current price: <span className="text-emerald-300">{product?.price}₫</span></h4>
                                    <h2 className="mb-4"><strong>{product?.soldQuantity}</strong> of buyers enjoyed this product! <strong>({product?.quantity} in Stock)</strong></h2>
                                    <h2 className="mb-4">
                                        <strong>Special offers?</strong>
                                        <p><small className="py-1.5 px-2.5 top-0 right-0
                                                         text-base
                                                         bg-gradient-to-r from-cyan-500 from-0% via-sky-800 via-50% to-fuchsia-700 to-100%">{product?.special}% protion pay</small></p>
                                    </h2>
                                    <div className="action">
                                        <button className="py-5 px-6
                                                       border-none
                                                       uppercase
                                                       font-bold text-white
                                                       bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%
                                                       hover:bg-gradient-to-r hover:from-indigo-700 hover:from-10% hover:via-sky-700 hover:via-30% hover:to-emerald-700 hover:to-90%"
                                        >add to cart</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}