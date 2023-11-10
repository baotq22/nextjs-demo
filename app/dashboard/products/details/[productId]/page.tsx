'use client'

import React, {useState, useEffect} from 'react';
import {api} from "@/app/axios-instance";
import {Skeleton} from "antd";

function DotPrice({ number }) {
    const formattedNumber = number.toLocaleString('en-US', { useGrouping: true });

    return (
        <>
            {formattedNumber}
        </>
    )
}

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
        <div className="mx-auto my-0">
            <div className="drop-shadow-2xl">
                <div className="p-12 mt-12 leading-6
                                bg-neutral-200 dark:bg-neutral-700">
                    {loading ? (
                        <>
                            <h2 className="text-2xl text-black dark:text-white">Loading....</h2>
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
                                                  bg-lime-500">{product?.discount}% DISCOUNT</small>
                                    <h3 className="mt-0 text-2xl text-black dark:text-white">{product?.productName}</h3>
                                    <div className="mb-4">
                                        <span className="text-teal-600 dark:text-teal-300">{product?.ratingPoint}</span><span className="text-black dark:text-white"> reviews</span>
                                    </div>
                                    <p className="mb-4 text-black dark:text-white">{product?.description}</p>
                                    <h4 className="mb-4 uppercase text-black dark:text-white">current price: <span className="text-emerald-600 dark:text-emerald-300"><DotPrice number={product?.price} />₫</span></h4>
                                    <h2 className="mb-4 text-black dark:text-white"><strong>{product?.soldQuantity}</strong> of buyers enjoyed this product! <strong>({product?.quantity} in Stock)</strong></h2>
                                    <h2 className="mb-4">
                                        <strong className="text-black dark:text-white">Special offers?</strong>
                                        <p className="mb-4"><small className="py-0.5 px-2.5 top-0 right-0
                                                         text-base
                                                         bg-emerald-600">{product?.special}% protion pay</small></p>
                                    </h2>
                                    <div className="action">
                                        <button className="py-5 px-6
                                                       border-none
                                                       uppercase
                                                       font-bold text-white
                                                       bg-indigo-500
                                                       hover:bg-indigo-800"
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