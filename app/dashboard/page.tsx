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
            <div id="products">
                <div className="container">
                    <h3 className="products__heading dark:text-white">DASHBOARD</h3>
                    <Row gutter={[16, 24]} className="rowClass">
                        <Col span={12}>
                            <Card className="cardBody" style={{ backgroundImage: "linear-gradient(to right, #fff 30%, #C779D0)" }}>
                                <ShoppingOutlined style={{ float: "right", fontSize: '40px', color: "#fff" }} />
                                <Statistic
                                    title="Total Products"
                                    value={productList.length}
                                    valueStyle={{ color: '#000' }}
                                />
                            </Card>
                        </Col>
                        <Col span={12}>
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
            <div id="products">
                <div className="container">
                    <h3 className="products__heading dark:text-white">BEST SELLER</h3>
                    {loadingContent}
                    <div className="products__list" id="products__list">
                        {
                            paginatedProductList.map((product, index) =>
                                <div className="products__item" key={index}>
                                    <Link href={`dashboard/products/details/${product.id}`}>
                                        <small className="products__sale">Portion pay {product.special}%</small>
                                        <div className="products__img">
                                            <a href={`dashboard/products/details/${product.id}`} className="products__img">
                                                <img src={product.image} />
                                            </a>
                                        </div>
                                        <p>
                                            <p className="products__title">{product.productName}</p>
                                        </p>
                                        <p className="products__price">
                                            <span>{product.price}₫</span>
                                            <span>-{product.discount}% SALE</span>
                                        </p>
                                        <div className="products__rating">
                                            <span>{product.ratingPoint}</span>
                                            <span><i className="fa-solid fa-star" style={{ color: '#f9c61f' }}></i></span>
                                            <span>({product.quantity} sold)</span>
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