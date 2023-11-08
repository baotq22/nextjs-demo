'use client'

import React, {useEffect, useState} from "react";
import axios from "axios";
import Link from "next/link";
import "./styles.css"
import ReactPaginate from "react-paginate";
import {Card, Col, Row, Skeleton, Statistic} from "antd";
import {ShoppingOutlined, UserOutlined} from "@ant-design/icons";

export default function Page() {
    const [productList, setProductList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemPerPage = 8;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            const res = await axios.get(`https://64f71db49d77540849531dc0.mockapi.io/product`);
            setProductList(res.data);
            setLoading(false);
        }
        const fetchUser = async () => {
            const res = await axios.get(`https://64f71db49d77540849531dc0.mockapi.io/users`);
            setUserList(res.data);
        }
        fetchProduct();
        fetchUser();
    }, []);

    let loadingContent
    if (loading) {
        loadingContent = <>
            <h2 className="text-black text-2xl dark:text-white">Loading....</h2>
            <Skeleton paragraph={{ rows: 4 }} active />
            <Skeleton paragraph={{ rows: 4 }} active />
        </>
    }

    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };

    const paginatedProductList = productList.slice(
        currentPage * itemPerPage,
        (currentPage + 1) * itemPerPage
    );

    return (
        <>
            <div className="max-w-7xl mx-auto my-0">
                <div className="container">
                    <h3 className="my-5 text-3xl dark:text-white">DASHBOARD</h3>
                    <Row gutter={[16, 24]} className="rowClass">
                        <Col span={12} className="drop-shadow-xl">
                            <Card className="cardBody" style={{ backgroundImage: "linear-gradient(to right, #fff 30%, #C779D0)" }}>
                                <ShoppingOutlined style={{ float: "right", fontSize: '40px', color: "#fff" }} />
                                <Statistic
                                    title="Total Products"
                                    value={productList.length}
                                    valueStyle={{ color: '#000' }}
                                />
                            </Card>
                        </Col>
                        <Col span={12} className="drop-shadow-xl">
                            <Card className="cardBody" style={{ backgroundImage: "linear-gradient(to right, #fff 30%, #26d0ce)" }}>
                                <UserOutlined style={{ float: "right", fontSize: '40px', color: "#fff" }} />
                                <Statistic
                                    title="Total Users"
                                    value={userList.length}
                                    valueStyle={{ color: '#000' }}
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
            <div className="max-w-7xl mx-auto my-0">
                <div className="container">
                    <h3 className="my-5 text-3xl dark:text-white">BEST SELLER</h3>
                    {loadingContent}
                    <div className="products__list flex flex-wrap">
                        {
                            paginatedProductList.map((product, index) =>
                                <div className="products__item
                                                drop-shadow-xl
                                                rounded-e-xl
                                                rounded-es-xl
                                                p-5 mx-3.5 mb-8 mt-0
                                                bg-gradient-to-r from-pink-300 from-0% to-sky-400 to-100%" key={index}>
                                    <Link href={`dashboard/products/details/${product.id}`}>
                                        <small className="text-white
                                                          py-1.5 px-2.5 top-0 right-0
                                                          rounded-ee-xl
                                                          bg-gradient-to-r from-cyan-500 from-0% via-sky-800 via-50% to-fuchsia-700 to-100%">Portion pay {product.special}%</small>
                                        <div className="products__img my-1.5">
                                            <a href={`dashboard/products/details/${product.id}`} className="my-1.5 flex items-center justify-center h-64">
                                                <img className="max-w-full inline-block" src={product.image} />
                                            </a>
                                        </div>
                                        <p className="products__title text-lg text-center text-black mb-4">{product.productName}</p>
                                        <p className="text-red-600 text-center text-base">
                                            <span>{product.price}₫</span>
                                            <span className="bg-slate-100 ml-2 text-red-600 text-base p-1 rounded-md pl-2.5">-{product.discount}% SALE</span>
                                        </p>
                                        <div className="text-center">
                                            <span className="text-sm p-1">{product.ratingPoint}</span>
                                            <span className="text-sm p-1"><i className="fa-solid fa-star" style={{ color: '#f9c61f' }}></i></span>
                                            <span className="text-sm p-1">({product.quantity} sold)</span>
                                        </div>
                                    </Link>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
            <ReactPaginate
                pageCount={Math.ceil(productList.length / itemPerPage)}
                pageRangeDisplayed={5}
                marginPagesDisplayed={2}
                onPageChange={handlePageChange}
                containerClassName="pagination flex justify-center dark:text-white"
                subContainerClassName="pages pagination"
                activeClassName="active bg-gradient-to-r from-purple-500 to-green-500 text-white"
                disabledClassName="text-zinc-300"
                previousLabel={"<-"}
                nextLabel={"->"}
                pageClassName="mx-2 my-3 px-1 py-1.5 rounded border-2 border-sky-600"
                pageLinkClassName="mx-2 my-3 px-1 py-1.5"
                previousClassName="mx-2 my-3 px-1 py-1.5 rounded border-2 border-sky-600"
                previousLinkClassName="mx-2 my-3 px-1 py-1.5"
                nextClassName="mx-2 my-3 px-1 py-1.5 rounded border-2 border-sky-600"
                nextLinkClassName="mx-2 my-3 px-1 py-1.5"
                breakClassName="mx-2 my-3 px-1 py-1.5 rounded border-2 border-sky-600"
                breakLinkClassName="mx-2 my-3 px-1 py-1.5"
            />
        </>
    )
}