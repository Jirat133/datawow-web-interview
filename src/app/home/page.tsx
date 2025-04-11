'use client'
import React, { useEffect, useContext, useState } from 'react';
import Image from 'next/image';
import HomeIcon from '../asset/image/home_icon.png';
import EditIcon from '../asset/image/edit_icon.png';
import DeleteIcon from '../asset/image/delete_icon.png';
import CommentIcon from '../asset/image/comment_icon.png';
import SearchIcon from '../asset/image/search_icon.png';
import Link from 'next/link';
import { UserContext, UserProvider } from '../../context/UserContext';
import ChevronDown from '../asset/image/chevron_down.png';
import UserIcon from '../asset/image/avatar_icon.png';
import MenuIcon from '../asset/image/menu_icon.png';
import { on } from 'events';

export default function Homepage() {
    const [posts, setPosts] = useState<any>([])
    const [displayPost, setDisplayPost] = useState<any>([])
    const [searchParams, setSearchParams] = useState<string>('');
    const [postTitle, setPostTitle] = useState<string>('');
    const [postContent, setPostContent] = useState<string>('');
    const [editPostId, setEditPostId] = useState<number | null>(null);
    const [deletePostId, setDeletePostId] = useState<number | null>(null);
    const [tag, setTag] = useState<any>('');
    const [tagModal, setTagModal] = useState<any>('');
    const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    // const [isModalCreatePostOpen, setIsModalCreatePostOpen] = useState(false);
    const [isDropdownModalOpen, setIsDropdownModalOpen] = useState(false);
    const { user: currentUser } = useContext(UserContext);
    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch('http://localhost:3001/feed', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            setPosts(data);
            setDisplayPost(data);
        };
        fetchPosts();
    }, []);

    useEffect(() => { }, [posts])

    const onCreatePostClick = () => {
        setIsModalCreateOpen(true);
    };

    const clearState = () => {
        setPostTitle('');
        setPostContent('');
        setTag('');
        setTagModal('');
        setIsModalCreateOpen(false);
        setIsModalEditOpen(false);
        setIsDropdownOpen(false);
        setIsDropdownModalOpen(false);
        setSearchParams('');
        setEditPostId(null);
    };

    const handleCreatePost = async () => {
        try {
            const response = await fetch('http://localhost:3001/posts', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: postTitle,
                    content: postContent, // Content of the post
                    tag: tagModal, // Tag associated with the post
                    author: currentUser.username, // Author of the post
                })
            });
            const result = await response.json();
            if (!(result.statusCode === 201)) {
                alert(`Failed to create post: ${result.message}`);
                return;
            }
            setPosts((prevPosts: any) => {
                const updatedPosts = [...prevPosts, result.data];
                setDisplayPost(updatedPosts);
                return updatedPosts;
            });
        } catch (err) {
            alert(`Failed to create post: ${err}`);
            console.error('Failed to create post', err);
        }


        clearState();
    };

    const handleDeletePost = async () => {
        const response = await fetch(`http://localhost:3001/posts/${deletePostId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const result = await response.json();
        if (result.statusCode === 200) {
            setPosts((prevPosts: any) => prevPosts.filter((post: any) => post.id !== deletePostId));
            setDisplayPost((prevPosts: any) => prevPosts.filter((post: any) => post.id !== deletePostId));
        } else {
            alert(`Failed to delete post: ${result.message}`);
            console.error('Failed to delete post');
        }
        setIsModalDeleteOpen(false);
        setDeletePostId(null);
    };

    const handleEditpost = async () => {
        try {
            const response = await fetch(`http://localhost:3001/posts/${editPostId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: postTitle,
                    content: postContent,
                    tag: tagModal,
                    author: currentUser.username, // Author of the post
                })
            });
            const result = await response.json();
            if (!(result.statusCode === 200)) {
                alert(`Failed to edit post: ${result.message}`);
                return;
            } else {
                const newPost = [...posts];
                Object.assign(newPost[posts.findIndex((post: any) => post.id = editPostId)], result.data);
                setPosts(newPost);
                setDisplayPost(newPost);
            }


        } catch (err) {
            console.error('Failed to edit post', err);
        } finally {
            clearState();
        }


    };

    const onDropdownClick = (tag: string) => {
        setTag(tag);
        setDisplayPost(posts.filter((post: any) => post.tag === tag));
        setIsDropdownOpen(!isDropdownOpen);
    };
    const onDropdownModalClick = (tag: string) => {
        setTagModal(tag);
        setIsDropdownModalOpen(false);
    };

    const onEditPostClick = (post: any) => {
        setEditPostId(post.id);
        setPostTitle(post.title);
        setPostContent(post.content);
        setTagModal(post.tag);
        setIsModalEditOpen(true);
    };

    const onDeletePostClick = (postId: number) => {
        setDeletePostId(postId);
        setIsModalDeleteOpen(true);
    };

    const onCancelDelete = () => {
        setIsModalDeleteOpen(false);
        setDeletePostId(null);
    };
    return (
        <div className="h-screen bg-custom-grey-100 overflow-hidden">
            {/* Top Bar */}
            <div className="fixed top-0 left-0 w-full bg-custom-green-500 text-white flex justify-between items-center p-4 z-10">
                <div className="text-lg font-bold italic">a board</div>
                <div className="flex items-center">
                    <span className="hidden sm:block text-white mr-2">{currentUser.username}</span>
                    <Image
                        src={UserIcon}
                        alt="User Icon"
                        className="hidden sm:block ml-2 w-6 h-6 text-gray-500 mr-2"
                        width={20}
                        height={20}
                    />
                    <button className="block sm:hidden">
                        <Image
                            src={MenuIcon}
                            alt="Edit Icon"
                            className="w-6 h-6"
                            width={20}
                            height={20}
                        />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col md:flex-row h-full pt-14">
                {/* Left Menu */}
                <div className="hidden md:block w-full md:w-1/4 p-4">
                    <ul className="space-y-4">
                        <Link href={{ pathname: '/home/' }}
                            className="text-gray-700 font-medium cursor-pointer hover:text-green-700">
                            <Image src={HomeIcon} alt="Home Icon" className="inline-block w-5 h-5 mr-2" width={20} height={20} />
                            Home
                        </Link>
                        <li className="text-gray-700 font-medium cursor-pointer hover:text-green-700 mt-4">
                            <Image src={EditIcon} alt="Home Icon" className="inline-block w-5 h-5 mr-2" width={20} height={20} />
                            Our Blog
                        </li>
                    </ul>
                </div>

                {/* Right Content */}
                <div className="flex-1 flex flex-col p-4 md:w-3/5 mx-auto mr-16 pr-16">
                    {/* Add Post Modal */}
                    <ModalPost
                        isModalOpen={isModalCreateOpen}
                        setIsModalOpen={setIsModalCreateOpen}
                        modalTitle="Create Post"
                        setIsDropDownOpen={setIsDropdownModalOpen}
                        isDropdownOpen={isDropdownModalOpen}
                        onDropdownClick={onDropdownModalClick}
                        modalTag={tagModal}
                        handleSubmit={handleCreatePost}
                        postTitle={postTitle}
                        setPostTitle={setPostTitle}
                        postContent={postContent}
                        setPostContent={setPostContent}
                    />
                    {/* Edit Post Modal */}
                    <ModalPost
                        isModalOpen={isModalEditOpen}
                        setIsModalOpen={setIsModalEditOpen}
                        modalTitle="Edit Post"
                        setIsDropDownOpen={setIsDropdownModalOpen}
                        isDropdownOpen={isDropdownModalOpen}
                        onDropdownClick={onDropdownModalClick}
                        modalTag={tagModal}
                        handleSubmit={handleEditpost}
                        postTitle={postTitle}
                        setPostTitle={setPostTitle}
                        postContent={postContent}
                        setPostContent={setPostContent}
                    />
                    {/* Delete Post Modal */}
                    <ModalDeletePost
                        isModalOpen={isModalDeleteOpen}
                        setIsModalOpen={setIsModalDeleteOpen}
                        handleDelete={() => handleDeletePost()}
                        onCancelDelete={onCancelDelete}
                    />
                    {/* Search Box */}
                    <div className="flex items-center justify-between mb-4">
                        <div className='flex items-center flex-grow border border-white rounded-md'>
                            <Image src={SearchIcon} alt="Search Icon" className="ml-2 w-6 h-6 text-gray-500 mr-2" width={20} height={20} />
                            <input
                                type="text"
                                placeholder="Search"
                                className="flex-grow p-2 focus:outline-none text-black mr-4"
                                value={searchParams}
                                onChange={(e) => setSearchParams(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const filteredPosts = posts.filter((post: any) =>
                                            post.title.toLowerCase().includes(searchParams.toLowerCase()) && (tag ? post.tag === tag : true)
                                        );
                                        setDisplayPost(filteredPosts);
                                    }
                                }}
                            />
                        </div>
                        <button
                            className="flex items-center justify-center px-2 py-2"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <DropDownTag
                                setIsDropdownOpen={setIsDropdownOpen} isDropdownOpen={isDropdownOpen} onDropdownClick={onDropdownClick}
                            />
                            <div className="flex items-center">
                                <span className="text-black mx-2 text-center">{tag ? tag : 'Community'}</span>
                                <Image
                                    src={ChevronDown}
                                    alt="Dropdown Icon"
                                    width={20}
                                    height={20}
                                />
                            </div>
                        </button>
                        <button
                            className="bg-custom-green-success text-white px-4 py-2 rounded-md mr-4"
                            onClick={() => onCreatePostClick()}
                        >
                            Create +
                        </button>
                    </div>

                    {/* Post Feed Layout */}
                    <div className="flex flex-col gap-0 overflow-y-auto h-full rounded-md">
                        {displayPost.map((post: any, index: any) => {
                            return (
                                <div key={index} className="relative bg-white p-4 flex flex-col border-b border-gray-300 hover:bg-gray-50 transition">
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <button className="text-gray-500 hover:text-gray-700" onClick={() => onEditPostClick(post)}>
                                            <Image src={EditIcon} alt="Edit Icon" width={16} height={16} />
                                        </button>
                                        <button
                                            onClick={(e) => onDeletePostClick(post.id)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <Image src={DeleteIcon} alt="Delete Icon" width={16} height={16} />
                                        </button>
                                    </div>
                                    <Link href={{ pathname: '/home/posts', query: { id: post.id } }} className="flex-grow">
                                        <div className='flex items-center flex-row mb-4'>
                                            <div className='flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full'>
                                                <Image
                                                    src={UserIcon}
                                                    alt="Post Image"
                                                    width={32}
                                                    height={32}
                                                    className="rounded-full"
                                                />

                                            </div>
                                            <h3 className="text-sm font-medium text-gray-500 font-bold ml-2">{post.author}</h3>
                                            <h3 className="text-sm font-medium text-gray-500 font-bold ml-2">{new Date(post.updatedAt).toLocaleDateString()}</h3>
                                        </div>

                                        <div className="flex flex-wrap w-1/15 h-1/15 gap-2 mb-4">
                                            <span className="bg-gray-200 px-3 py-1 rounded-xl text-xs text-black">
                                                {post?.tag}
                                            </span>
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-800">{post.title}</h2>
                                        <p className="text-base text-gray-600 flex-grow mt-2">{post.content}</p>
                                        <div className="flex items-center mt-2 text-gray-500">
                                            <Image src={CommentIcon} alt="Comment Icon" width={16} height={16} className="mr-4" />
                                            {post.comments?.length || 0} comments
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </div>
    );
}

const DropDownTag = ({ setIsDropdownOpen, isDropdownOpen, onDropdownClick }: any) => {
    return (
        <div
            className="relative inline-block text-left"
        >
            {isDropdownOpen && (
                <div className="absolute right-0 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                    <ul className="py-1">
                        <li>
                            <button
                                onClick={() => onDropdownClick('History')}
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                                History
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => onDropdownClick('Food')}
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                                Food
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => onDropdownClick('Pets')}
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                                Pets
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => onDropdownClick('Health')}
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                                Health
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => onDropdownClick('Fashion')}
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                                Fashion
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => onDropdownClick('Exercise')}
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                                Exercise
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => onDropdownClick('Others')}
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                                Others
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export const ModalPost = ({ isModalOpen, setIsModalOpen, modalTitle, setIsDropDownOpen, isDropdownOpen, onDropdownClick, modalTag, handleSubmit, postTitle, setPostTitle, postContent, setPostContent }: any) => {
    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-brightness-70 flex justify-center items-center z-20">
            <div className="flex flex-col bg-white p-6 rounded-md shadow-md w-[32rem]"> {/* Increased width to 32rem */}
                <h2 className="text-xl text-black font-bold mb-4">{modalTitle}</h2>
                <button
                    className="inline-flex items-center justify-center mb-4 border border-custom-green-success rounded-md px-2 py-2 w-30"
                    onClick={() => setIsDropDownOpen(!isDropdownOpen)}
                >
                    <DropDownTag
                        setIsDropdownOpen={setIsDropDownOpen}
                        isDropdownOpen={isDropdownOpen}
                        onDropdownClick={onDropdownClick}
                    />
                    <div className="flex items-center">
                        <span className="text-custom-green-success mr-2 text-center">{modalTag ? modalTag : 'Community'}</span>
                        <Image
                            src={ChevronDown}
                            alt="Dropdown Icon"
                            width={20}
                            height={20}
                        />
                    </div>
                </button>
                <textarea
                    className="w-full text-black border border-gray-300 rounded-md p-2 mb-4"
                    rows={1}
                    placeholder="Title..."
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                ></textarea>
                <textarea
                    className="w-full text-black border border-gray-300 rounded-md p-2 mb-4"
                    rows={4}
                    placeholder="What's on your mind..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                ></textarea>
                <div className="flex justify-end space-x-4 mt-4">
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 bg-white border border-custom-green-success text-custom-green-success rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-custom-green-success text-white rounded-md hover:bg-green-700"
                    >
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
}

export const ModalDeletePost = ({ isModalOpen, setIsModalOpen, handleDelete, onCancelDelete }: any) => {
    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-brightness-70 flex justify-center items-center z-20">
            <div className="flex flex-col bg-white p-6 rounded-md shadow-md w-96">
                <h2 className="text-xl text-black font-bold mb-4 text-center">Please confirm if you wish to
                    delete the post
                </h2>
                <p className="text-black mb-6 text-center">Are you sure you want to delete the post? Once deleted, it cannot be recovered.</p>
                <div className="flex flex-col space-y-4">
                    <button
                        onClick={handleDelete}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => onCancelDelete()}
                        className="w-full px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};


