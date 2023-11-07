'use client'

import React, {useState, useEffect} from 'react';
import {api} from "@/app/axios-instance";
import '../styles.css'
import {manrope} from "@/app/fonts";

export default function Page({
    params: {productId},
}: {
    params: {
        productId: string
    };
}) {
    const [product, setProduct] = useState();

    useEffect(() => {
        api.get(`/product/${productId}`).then(res => {
            setProduct(res.data)
        }).catch(e => console.log(e));
    }, [])

    return (
        <div id='productDetail' className={`${manrope.className} antialiased`}>
            <div className="container">
                <div className="card">
                    <div className="container-fliud">
                        <div className="wrapper row">
                            <div className="preview col-md-6">
                                <div className="preview-pic tab-content">
                                    <div className="tab-pane active" id="pic-1"><img src={product?.image} /></div>
                                </div>
                            </div>
                            <div className="details col-md-6 text-white">
                                <small className="products__sale">{product?.discount}% DISCOUNT</small>
                                <h3 className="product-title">{product?.productName}</h3>
                                <div className="rating">
                                    <div className="stars">
                                        <span className="fa fa-star checked"></span>
                                        <span className="fa fa-star checked"></span>
                                        <span className="fa fa-star checked"></span>
                                        <span className="fa fa-star checked"></span>
                                        <span className="fa fa-star checked"></span>
                                    </div>
                                    <span className="review-no">{product?.ratingPoint} reviews</span>
                                </div>
                                <p className="product-description">{product?.description}</p>
                                <h4 className="price">current price: <span>{product?.price}₫</span></h4>
                                <h2 className="vote"><strong>{product?.soldQuantity}</strong> of buyers enjoyed this product! <strong>({product?.quantity} in Stock)</strong></h2>
                                <h2 className="vote"><strong>Special offers?</strong><span><h3>{product?.special}% protion pay</h3></span></h2>
                                <div className="action">
                                    <button className="add-to-cart btn btn-default">add to cart</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}