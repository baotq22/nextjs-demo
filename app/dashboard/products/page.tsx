"use client"

import React, {useEffect, useState} from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import {Button, Form, Input, InputNumber, Modal, Skeleton} from "antd";
import Link from "next/link";
import {DownOutlined, UpOutlined} from "@ant-design/icons";
import '../styles.css'
function Search({ productList, setFilteredProducts }) {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filteredProducts = productList.filter((product) =>
            product.productName.toLowerCase().includes(query)
        );

        setFilteredProducts(filteredProducts);
    };

    return (
        <>
            <form className="float-right">
                <label htmlFor="default-search"
                       className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input type="search" id="default-search"
                           className="block w-96 p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                           placeholder="Search..."
                           required
                           value={searchQuery}
                           onChange={handleSearch}
                    />
                </div>
            </form>
        </>
    )
}
function CollapsibleText({ text, maxChars }) {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <>
            {isCollapsed ? (
                <div>
                    {text.length > maxChars ? text.slice(0, maxChars) : text}...
                    <button className="py-3 pr-3"><span onClick={toggleCollapse} className="p-1 bg-cyan-600 hover:bg-cyan-900 text-white hover:cursor-pointer rounded-lg">More</span></button>
                </div>
            ) : (
                <div>
                    {text}
                    <p><button className="py-3 pr-3"><span onClick={toggleCollapse} className="p-1 bg-cyan-600 hover:bg-cyan-900 text-white hover:cursor-pointer rounded-lg">Less</span></button></p>
                </div>
            )}
        </>
    );
}

function ConvertDate({ date }) {
    const inputDate = date;
    const dateObj = new Date(inputDate);
    const formattedDate = dateObj.toLocaleString("en-GB", {timeZone: "UTC"});

    return (
        <>
            {formattedDate}
        </>
    )
}

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
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemPerPage = 5;
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [openImageDetails, setOpenImageDetails] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [modalMode, setModalMode] = useState('add');
    const [selectedImage, setSelectedImage] = useState(null);
    const [formValues, setFormValues] = useState({
        productName: '',
        price: 0,
        ratingPoint: 0,
        quantity: 0,
        soldQuantity: 0,
        description: '',
        discount: '7.5',
        special: '0'
    });
    const [isEnabledSubmitButton, setIsEnabledSubmitButton] = useState(false);
    const [sortOrder, setSortOrder] = useState('asc');

    const productNameRegex = /^[a-zA-Z0-9_\s]+$/;

    const [productNameError, setProductNameError] = useState(null);

    const resetForm = () => {
        setFormValues({
            productName: '',
            price: 0,
            ratingPoint: 0,
            quantity: 0,
            soldQuantity: 0,
            description: '',
            discount: '7.5',
            special: '0'
        });
        setProductNameError(null);
    };

    const showModal = (product) => {
        setProductToDelete(product);
        setOpen(true);
    };

    const hideModal = () => {
        setProductToDelete(null);
        setOpen(false);
    };

    const showAddModal = () => {
        setOpenAdd(true);
    }

    const cancelAddModal = () => {
        setOpenAdd(false);
        resetForm()
    }

    const showImageModal = () => {
        setOpenImageDetails(true);
    }

    const hideImageModal = () => {
        setOpenImageDetails(false);
    }

    const getProduct = async () => {
        const res = await axios.get(`https://64f71db49d77540849531dc0.mockapi.io/product`);
    }

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`https://64f71db49d77540849531dc0.mockapi.io/product`);
                setProductList(res.data.reverse());
                setLoading(false);
            } catch (e) {
                console.error(e);
                setLoading(false)
            }
        }
        fetchProduct();
    }, []);

    useEffect(() => {
        setFilteredProducts(productList);
    }, [productList])

    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };

    const paginatedProductList = filteredProducts.slice(
        currentPage * itemPerPage,
        (currentPage + 1) * itemPerPage
    );

    const areAllFieldsFilled = () => {
        const requiredFields = [
            "productName",
            "price",
            "ratingPoint",
            "quantity",
            "soldQuantity",
            "description",
        ];
        return requiredFields.every((field) => formValues[field]);
    };

    const handleInputChange = (e) => {
        const { id, value, type, files } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [id]: type === 'file' ? files[0] : value,
        }));

        if (id === 'productName') {
            setProductNameError(productNameRegex.test(value) ? null : 'Invalid product name format');
        }

        const requiredFields = ["productName", "price", "ratingPoint", "quantity", "soldQuantity", "description"];
        const allFieldsFilled = requiredFields.every((field) => formValues[field]);
        setIsEnabledSubmitButton(allFieldsFilled);
        setIsEnabledSubmitButton(areAllFieldsFilled() && !productNameError);
    };

    const handleSubmit = async () => {
        try {
            const existingProduct = productList.find((product) => product.productName === formValues.productName)
            if (existingProduct && modalMode === 'add') {
                alert('This product is already existed. Try again!');
            } else {
                if (modalMode === 'add') {
                    const response = await axios.post(
                        'https://64f71db49d77540849531dc0.mockapi.io/product',
                        formValues
                    );
                    setProductList((prevProductList) => [response.data, ...prevProductList]);
                } else if (modalMode === 'edit' && productToDelete) {
                    const response = await axios.put(
                        `https://64f71db49d77540849531dc0.mockapi.io/product/${productToDelete.id}`,
                        formValues
                    );
                    setProductList((prevProductList) =>
                        prevProductList.map((product) =>
                            product.id === productToDelete.id ? { ...product, ...formValues } : product
                        )
                    );
                }
                alert('Successfully!');
                setOpenAdd(false);
                resetForm();
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const handleSort = (field) => {
        const sortedProductList = [...productList];
        sortedProductList.sort((a, b) => {
            if (sortOrder === 'asc') {
                return a[field].localeCompare(b[field]);
            } else {
                return b[field].localeCompare(a[field]);
            }
        });
        setProductList(sortedProductList)
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    }

    const handleImageClick = (image) => {
        setSelectedImage(image);
        showImageModal();
    }

    async function deleteProduct(id: number) {
        try {
            await fetch(`https://64f71db49d77540849531dc0.mockapi.io/product/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            hideModal();
            alert('Delete successfully');
            window.location.reload(false);
            getProduct();
        } catch (e) {
            alert('lol');
        }
    }

    let loadingContent
    if (loading) {
        loadingContent = <>
            <h2 className="text-black text-2xl dark:text-white">Loading....</h2>
            <Skeleton paragraph={{ rows: 4 }} active />
            <Skeleton paragraph={{ rows: 4 }} active />
        </>
    }

    return (
        <>
            <button type="button"
                    className="bg-slate-300 text-black hover:bg-slate-100 dark:bg-slate-500 dark:text-white dark:hover:bg-slate-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                    onClick={showAddModal}>Add New Product
            </button>
            <Search productList={productList} setFilteredProducts={setFilteredProducts}/>
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 dark:text-gray-200 uppercase bg-stone-200 dark:bg-zinc-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 border-r border-slate-500">
                                #
                            </th>
                            <th scope="col" className="px-6 py-3 border-r border-slate-500" onClick={() => handleSort("productName")}>
                                Product Name <span className="float-right">{sortOrder === 'asc' ? <UpOutlined /> : <DownOutlined />}</span>
                            </th>
                            <th scope="col" className="px-6 py-3 border-r border-slate-500">
                                Price
                            </th>
                            <th scope="col" className="px-6 py-3 border-r border-slate-500 whitespace-nowrap">
                                Rating Point
                            </th>
                            <th scope="col" className="px-6 py-3 border-r border-slate-500">
                                Quantity
                            </th>
                            <th scope="col" className="px-6 py-3 border-r border-slate-500 whitespace-nowrap">
                                Sold Quantity
                            </th>
                            <th scope="col" className="px-6 py-3 border-r border-slate-500 whitespace-nowrap">
                                % Discount
                            </th>
                            <th scope="col" className="px-6 py-3 border-r border-slate-500">
                                Special
                            </th>
                            <th scope="col" className="px-6 py-3 border-r border-slate-500">
                                Image
                            </th>
                            <th scope="col" className="px-3 py-3 border-r border-slate-500 whitespace-nowrap" onClick={() => handleSort("description")}>
                                Description &nbsp;&nbsp; <span className="float-right">{sortOrder === 'asc' ? <UpOutlined /> : <DownOutlined />}</span> &nbsp;&nbsp;&nbsp;&nbsp;
                            </th>
                            <th scope="col" className="px-6 py-3 border-r border-slate-500 whitespace-nowrap">
                                Created Date
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    {loadingContent}
                    <tbody>
                        {
                            paginatedProductList.map((product, index) =>
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={index}>
                                    <td className="px-6 py-4 border-r border-slate-500">
                                        {product?.id}
                                    </td>
                                    <td scope="row" className="px-6 py-4 border-r border-slate-500 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {product?.productName}
                                    </td>
                                    <td className="px-6 py-4 border-r border-slate-500 text-center">
                                        <DotPrice number={product?.price} />₫
                                    </td>
                                    <td className="px-6 py-4 border-r border-slate-500 text-center">
                                        {product?.ratingPoint}
                                    </td>
                                    <td className="px-6 py-4 border-r border-slate-500 text-center">
                                        {product?.quantity}
                                    </td>
                                    <td className="px-6 py-4 border-r border-slate-500 text-center">
                                        {product?.soldQuantity}
                                    </td>
                                    <td className="px-6 py-4 border-r border-slate-500 text-center">
                                        {product?.discount}
                                    </td>
                                    <td className="px-2 py-4 border-r border-slate-500">
                                        {product?.special}% of portion pay
                                    </td>
                                    <td className="px-2 py-4 border-r border-slate-500">
                                        <button
                                            style={{ width: '100%', height: '100%', cursor: 'pointer', padding: 0, border: 'none', background: 'none' }}
                                            onClick={() => handleImageClick(product?.image)}
                                        >
                                            <img style={{ width: '100%', height: '100%' }} src={product?.image} alt="Product Image" />
                                        </button>
                                    </td>
                                    <td className="px-3 py-4 border-r border-slate-500">
                                        <CollapsibleText text={product?.description} maxChars={10} />
                                    </td>
                                    <td className="px-6 py-4 border-r border-slate-500">
                                        <ConvertDate date={product?.createDate} />
                                    </td>
                                    <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        <Link href={`/dashboard/products/details/${product?.id}`}>
                                            <button type="button"
                                                    className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Details
                                            </button>
                                        </Link>
                                        <button type="button"
                                                onClick={() => {
                                                    setModalMode('edit');
                                                    setProductToDelete(product);
                                                    setFormValues({
                                                        productName: product.productName,
                                                        description: product.description,
                                                        discount: product.discount,
                                                        price: product.price,
                                                        quantity: product.quantity,
                                                        ratingPoint: product.ratingPoint,
                                                        soldQuantity: product.soldQuantity,
                                                        special: product.special
                                                    });
                                                    showAddModal();
                                                }}
                                                className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Edit
                                        </button>
                                        <button onClick={() => showModal(product)} type="button"
                                                className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Delete
                                        </button>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
            <ReactPaginate
                pageCount={Math.ceil(productList.length / itemPerPage)}
                pageRangeDisplayed={1}
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
                title="Confirm Delete"
                visible={open}
                onOk={() => deleteProduct(productToDelete.id)}
                onCancel={hideModal}
                okText="Confirm"
                cancelText="Cancel"
            >
                Are you sure you want to delete this Product?
            </Modal>
            <Modal
                title={modalMode === "add" ? "Add New Product" : "Edit Product"}
                visible={openAdd}
                onOk={handleSubmit}
                onCancel={cancelAddModal}
                footer={[
                    <Button key="cancel" onClick={cancelAddModal}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleSubmit}
                        disabled={!isEnabledSubmitButton}
                    >
                        {modalMode === "add" ? "Add" : "Save"}
                    </Button>,
                ]}
            >
                <form id="form">
                    <div className='inputContainer'>
                        <label>PRODUCT NAME: <span className="text-red-500">*</span></label>
                        <input className='w-full rounded-lg mb-2 to-dark' type='text' id='productName' name='productName' value={formValues.productName} onChange={handleInputChange} placeholder="Input Product Name..." />
                        {productNameError && <p className="text-red-500">{productNameError}</p> }
                    </div>

                    <div className='inputContainer'>
                        <label>PRICE: <span className="text-red-500">*</span></label>
                        <input className='w-full rounded-lg mb-2 to-dark' type='number' id='price' name='price' value={formValues.price} onChange={handleInputChange} placeholder="Input Price..." />
                    </div>

                    <div className='inputContainer'>
                        <label>RATING POINT: <span className="text-red-500">*</span></label>
                        <input className='w-full rounded-lg mb-2 to-dark' type='number' id='ratingPoint' name='ratingPoint' value={formValues.ratingPoint} onChange={handleInputChange} placeholder="Input Rating Point..." />
                    </div>

                    <div className='inputContainer'>
                        <label>QUANTITY: <span className="text-red-500">*</span></label>
                        <input className='w-full rounded-lg mb-2 to-dark' type='number' id='quantity' name='quantity' value={formValues.quantity} onChange={handleInputChange} placeholder="Input Quantity..." />
                    </div>

                    <div className='inputContainer'>
                        <label>SOLD QUANTITY: <span className="text-red-500">*</span></label>
                        <input className='w-full rounded-lg mb-2 to-dark' type='number' id='soldQuantity' name='soldQuantity' value={formValues.soldQuantity} onChange={handleInputChange} placeholder="Input Sold Quantity..." />
                    </div>

                    <div className='inputContainer'>
                        <label>DESCRIPTION: <span className="text-red-500">*</span></label>
                        <textarea type="text" className='w-full rounded-lg mb-6 to-dark' id='description' name='description' value={formValues.description} onChange={handleInputChange} placeholder="Input Description..." />
                    </div>

                    <div className='inputContainer'>
                        <label className='mr-3'>% DISCOUNT: <span className="text-red-500">*</span></label>
                        <select className='w-32 rounded-lg to-dark' style={{ marginRight: '30px' }} id="discount" name="discount" value={formValues.discount} onChange={handleInputChange}>
                            <option value="7.5">7.5</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="12">12</option>
                        </select>
                        <label className='mr-3.5'>SPECIAL: <span className="text-red-500">*</span></label>
                        <select className='w-32 rounded-lg to-dark' id="special" name="special" value={formValues.special} onChange={handleInputChange}>
                            <option value="0">0</option>
                            <option value="5">5</option>
                            <option value="7">7</option>
                        </select>
                    </div>

                    <p className="mt-4">The field with "<span className="text-red-500">*</span>" mark is required</p>
                </form>
            </Modal>
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