"use client"

import React, {useEffect, useState} from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import {Button, Modal, Skeleton} from "antd";
import Link from "next/link";

function Search({ userList, setFilteredUser }) {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filteredUsers = userList.filter((users) =>
            users.username.toLowerCase().includes(query)
        )

        setFilteredUser(filteredUsers);
    }
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
                    <button type="submit"
                            className="text-white absolute right-2.5 bottom-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search
                    </button>
                </div>
            </form>
        </>
    )
}

export default function Page() {
    const [userList, setUserList] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemPerPage = 5;
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [modalMode, setModalMode] = useState('add');
    const [formValues, setFormValues] = useState({
        email: '',
        username: '',
        fullname: '',
        department: 'SAP',
        positions: 'Leader',
        phone: ''
    });
    const [isEnabledSubmitButton, setIsEnabledSubmitButton] = useState(false);
    const [sortOrder, setSortOrder] = useState('asc');

    const resetForm = () => {
        setFormValues({
            email: '',
            username: '',
            fullname: '',
            department: 'SAP',
            positions: 'Leader',
            phone: ''
        });
    };

    const showModal = (user) => {
        setUserToDelete(user);
        setOpen(true);
    };

    const hideModal = () => {
        setUserToDelete(null);
        setOpen(false);
    };

    const showAddModal = () => {
        setOpenAdd(true);
    }

    const cancelAddModal = () => {
        setOpenAdd(false);
        resetForm();
    }

    const getUsers = async () => {
        const res = await axios.get(`https://64f71db49d77540849531dc0.mockapi.io/users`);
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`https://64f71db49d77540849531dc0.mockapi.io/users`);
                setUserList(res.data.reverse());
                setLoading(false);
            } catch (e) {
                console.error(e);
                setLoading(false);
            }
        }
        fetchUser();
    }, []);

    useEffect(() => {
        setFilteredUsers(userList);
    }, [userList])

    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };

    const paginatedUserList = filteredUsers.slice(
        currentPage * itemPerPage,
        (currentPage + 1) * itemPerPage
    );

    const areAllFiendsFilled = () => {
        const requiredFields = [
            "email",
            "username",
            "fullname",
            "phone",
        ];
        return requiredFields.every((field) => formValues[field]);
    }

    const handleInputChange = (e) => {
        const { id, value, type, files } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [id]: type === 'file' ? files[0] : value,
        }));

        const requiredFields = ["email", "username", "fullname", "phone",];
        const allFieldsFilled = requiredFields.every((field) => formValues[field]);
        setIsEnabledSubmitButton(allFieldsFilled);
        setIsEnabledSubmitButton(areAllFiendsFilled());
    };

    const handleSubmit = async () => {
        try {
            const existingUser = userList.find((user) => user.username === formValues.username)
            if (existingUser && modalMode === 'add') {
                alert('This user is already existed. Try again!')
            } else {
                if (modalMode === 'add') {
                    const response = await axios.post(
                        'https://64f71db49d77540849531dc0.mockapi.io/users',
                        formValues
                    );
                    setUserList((prevUserList) => [response.data, ...prevUserList]);
                } else if (modalMode === 'edit' && userToDelete) {
                    const response = await axios.put(
                        `https://64f71db49d77540849531dc0.mockapi.io/users/${userToDelete.id}`,
                        formValues
                    );
                    setUserList((prevUserList) =>
                        prevUserList.map((user) =>
                            user.id === userToDelete.id ? { ...user, ...formValues } : user
                        )
                    );
                }
                setOpenAdd(false);
                resetForm();
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleSort = (field) => {
        const sortedUserList = [...userList];
        sortedUserList.sort((a, b) => {
            if (sortOrder === 'asc') {
                return a[field].localeCompare(b[field]);
            } else {
                return b[field].localeCompare(a[field]);
            }
        });
        setUserList(sortedUserList);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    }

    async function deleteUser(id: number) {
        try {
            await fetch(`https://64f71db49d77540849531dc0.mockapi.io/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            hideModal();
            alert('Delete successfully');
            window.location.reload(false);
            getUsers();
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
                    className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                    onClick={showAddModal}>Add New User
            </button>
            <Search userList={userList} setFilteredUser={setFilteredUsers}/>
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-100 uppercase bg-gradient-to-r from-cyan-500 to-blue-500 dark:bg-gradient-to-r dark:from-indigo-500 dark:via-purple-500 dark:to-pink-500">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                #
                            </th>
                            <th scope="col" className="px-6 py-3" onClick={() => handleSort("email")}>
                                Email <span className="float-right">{sortOrder === 'asc' ? '🔼' : '🔽'}</span>
                            </th>
                            <th scope="col" className="px-6 py-3" onClick={() => handleSort("username")}>
                                Username <span className="float-right">{sortOrder === 'asc' ? '🔼' : '🔽'}</span>
                            </th>
                            <th scope="col" className="px-6 py-3" onClick={() => handleSort("fullname")}>
                                Fullname <span className="float-right">{sortOrder === 'asc' ? '🔼' : '🔽'}</span>
                            </th>
                            <th scope="col" className="px-6 py-3" onClick={() => handleSort("department")}>
                                Department <span className="float-right">{sortOrder === 'asc' ? '🔼' : '🔽'}</span>
                            </th>
                            <th scope="col" className="px-6 py-3" onClick={() => handleSort("positions")}>
                                Position <span className="float-right">{sortOrder === 'asc' ? '🔼' : '🔽'}</span>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Phone Number
                            </th>
                            <th scope="col" className="px-6 py-3">
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
                            paginatedUserList.map((user, index) =>
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={index}>
                                    <td className="px-6 py-4">
                                        {user?.id}
                                    </td>
                                    <td scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                        {user?.username}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user?.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user?.fullname}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user?.department}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user?.positions}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user?.phone}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user?.createDate}
                                    </td>
                                    <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        <Link href={`/dashboard/customers/details/${user?.id}`}>
                                            <button type="button"
                                                    className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Details
                                            </button>
                                        </Link>
                                        <button type="button"
                                                onClick={() => {
                                                    setModalMode('edit');
                                                    setUserToDelete(user);
                                                    setFormValues({
                                                        email: user.email,
                                                        username: user.username,
                                                        fullname: user.fullname,
                                                        department: user.department,
                                                        positions: user.positions,
                                                        phone: user.phone
                                                    });
                                                    showAddModal();
                                                }}
                                                className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Edit
                                        </button>
                                        <button onClick={() => showModal(user)} type="button"
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
                pageCount={Math.ceil(userList.length / itemPerPage)}
                pageRangeDisplayed={5}
                marginPagesDisplayed={2}
                onPageChange={handlePageChange}
                containerClassName="pagination flex justify-center dark:text-white"
                subContainerClassName="pages pagination"
                activeClassName="active bg-gradient-to-r from-purple-500 to-green-500 text-white"
                disabledClassName="text-zinc-300 dark:text-zinc-500"
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
            <Modal
                visible={open}
                title="Confirm Delete"
                onOk={() => deleteUser(userToDelete.id)}
                onCancel={hideModal}
                okText="Confirm"
                cancelText="Cancel"
            >
                Are you sure you want to delete this user?
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
                        <label className='inputTitle'>EMAIL: <span>*</span></label>
                        <br />
                        <input className='w-full rounded-lg' type='text' id='email' name='email' value={formValues.email} onChange={handleInputChange} />
                    </div>

                    <div className='inputContainer'>
                        <label className='inputTitle'>USERNAME: <span>*</span></label>
                        <br />
                        <input className='w-full rounded-lg' type='text' id='username' name='username' value={formValues.username} onChange={handleInputChange}/>
                    </div>

                    <div className='inputContainer'>
                        <label className='inputTitle'>FULLNAME: <span>*</span></label>
                        <br />
                        <input className='w-full rounded-lg mb-4' type='text' id='fullname' name='fullname' value={formValues.fullname} onChange={handleInputChange}/>
                    </div>

                    <div className='inputContainer'>
                        <label className='inputTitle'>PHONE NUMBER: <span>*</span></label>
                        <br />
                        <input className='w-full rounded-lg mb-4' type='text' id='phone' name='phone' value={formValues.phone} onChange={handleInputChange}/>
                    </div>

                    <div className='inputContainer'>
                        <label className='mr-3'>DEPARTMENT: <span>*</span></label>
                        <select className='w-28 rounded-lg' style={{ marginRight: '30px' }} id="department" name='department' value={formValues.department} onChange={handleInputChange}>
                            <option value="SAP">SAP</option>
                            <option value="CF">CF</option>
                        </select>
                        <label className='mr-3.5'>POSITIONS: <span>*</span></label>
                        <select className='w-28 rounded-lg' id="positions" name='positions' value={formValues.positions} onChange={handleInputChange}>
                            <option value="Leader">Leader</option>
                            <option value="Intern">Intern</option>
                        </select>
                    </div>
                </form>
            </Modal>
        </>
    )
}