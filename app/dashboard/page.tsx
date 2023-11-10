'use client'

import React, {useEffect, useState} from "react";
import axios from "axios";
import Link from "next/link";
import "./styles.css"
import ReactPaginate from "react-paginate";
import {Card, Col, Modal, Row, Skeleton, Statistic} from "antd";
import {ShoppingOutlined, UserOutlined} from "@ant-design/icons";

function DotPrice({ number }) {
    const formattedNumber = number.toLocaleString('en-US', { useGrouping: true });

    return (
        <>
            {formattedNumber}
        </>
    )
}

export default function Page() {
    const [productList, setProductList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemPerPage = 8;
    const [loading, setLoading] = useState(false);
    const [openImageDetails, setOpenImageDetails] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const showImageModal = () => {
        setOpenImageDetails(true);
    }

    const hideImageModal = () => {
        setOpenImageDetails(false);
    }

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

    const handleImageClick = (image) => {
        setSelectedImage(image);
        showImageModal();
    }

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
                                                bg-neutral-100 dark:bg-neutral-700" key={index}>
                                    <small className="text-white
                                                          py-1.5 px-2.5 top-0 right-0
                                                          rounded-ee-xl
                                                          bg-indigo-500">Portion pay {product.special}%</small>
                                    <div className="products__img my-1.5">
                                        <div className="my-1.5 flex items-center justify-center h-64">
                                            <button
                                                style={{ width: '100%', height: '100%', cursor: 'pointer', padding: 0, border: 'none', background: 'none' }}
                                                onClick={() => handleImageClick(product?.image)}
                                            >
                                                <img className="max-w-full inline-block" src={product.image} />
                                            </button>
                                        </div>
                                    </div>
                                    <Link href={`dashboard/products/details/${product.id}`}>
                                        <p className="products__title text-lg text-center text-black dark:text-white mb-4">{product.productName}</p>
                                        <p className="text-center text-base">
                                            <span className="text-red-600 dark:text-red-300"><DotPrice number={product?.price} />₫</span>
                                            <span className="bg-slate-300 ml-2 text-red-600 text-base p-1 rounded-md pl-2.5">-{product.discount}% SALE</span>
                                        </p>
                                        <div className="text-center text-black dark:text-white">
                                            <span className="text-sm p-1">{product.ratingPoint} points</span>
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
                activeClassName="active bg-blue-600 text-white"
                disabledClassName="text-zinc-400"
                previousLabel={"<-"}
                nextLabel={"->"}
                pageClassName="mx-2 my-3 px-1 py-1.5 rounded border-2 border-black dark:border-white"
                pageLinkClassName="mx-2 my-3 px-1 py-1.5"
                previousClassName="mx-2 my-3 px-1 py-1.5 rounded border-2 border-black dark:border-white"
                previousLinkClassName="mx-2 my-3 px-1 py-1.5"
                nextClassName="mx-2 my-3 px-1 py-1.5 rounded border-2 border-black dark:border-white"
                nextLinkClassName="mx-2 my-3 px-1 py-1.5"
                breakClassName="mx-2 my-3 px-1 py-1.5 rounded border-2 border-black dark:border-white"
                breakLinkClassName="mx-2 my-3 px-1 py-1.5"
            />
            <Modal
                title="View Details Image"
                visible={openImageDetails}
                onOk={hideImageModal}
                okText="Close"
                footer={(_, { OkBtn }) => (
                    <>
                        <OkBtn />
                    </>
                )}
                className="hide-x"
            >
                <>
                    {selectedImage && (
                        <img style={{ width: '100%', height: '100%' }} src={selectedImage} alt="Selected Image" />
                    )}
                </>
            </Modal>
        </>
    )
}