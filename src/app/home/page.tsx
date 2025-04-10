'use client'
import React, { useEffect, useContext, useState } from 'react';
import Image from 'next/image';
import HomeIcon from '../asset/image/home_icon.png';
import EditIcon from '../asset/image/edit_icon.png';
import Link from 'next/link';
import { UserContext, UserProvider } from '../../context/UserContext';
import { on } from 'events';

export default function Homepage() {
    const [posts, setPosts] = useState<any>([])
    const [displayPost, setDisplayPost] = useState<any>([])
    const [searchParams, setSearchParams] = useState<string>('');
    const [postTitle, setPostTitle] = useState<string>('');
    const [postContent, setPostContent] = useState<string>('');
    const [tag, setTag] = useState<any>([]);
    const [tagCreatePost, setTagCreatePost] = useState<any>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isModalCreatePostOpen, setIsModalCreatePostOpen] = useState(false);
    const [isDropdownCreatePostOpen, setIsDropdownCreatePostOpen] = useState(false);
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
            setDisplayPost(data)
        };
        fetchPosts();
    }, []);

    useEffect(() => { }, [posts])

    const onCreatePostClick = () => {
        setIsModalOpen(true);
    };

    const handleCreatePost = async () => {
        const response = await fetch('http://localhost:3001/posts', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: postTitle,
                content: postContent, // Content of the post
                tag: tagCreatePost, // Tag associated with the post
                author: currentUser.username, // Author of the post
            })
        });
        const data = await response.json();
        console.log('Create Post response data:', data);
        setPosts((prevPosts: any) => [...prevPosts, data]);
    };

    const onDropdownClick = (tag: string) => {
        setTag(tag);
        setDisplayPost(posts.filter((post: any) => post.tag === tag));
        setIsDropdownOpen(!isDropdownOpen);
    };
    const onDropdownCreatePostClick = (tag: string) => {
        setTagCreatePost(tag);
        setIsDropdownCreatePostOpen(false);
    };
    return (
        <div className="min-h-screen bg-gray-300">
            {/* Top Bar */}
            <div className="bg-green-900 text-white flex justify-between items-center px-4 py-3">
                <div className="text-lg font-bold">a board</div>
                <button className="text-white focus:outline-none">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16m-7 6h7"
                        />
                    </svg>
                </button>
            </div>

            {/* Main Content */}
            <div className="flex bg-grey-300 flex-col md:flex-row">
                {/* Left Menu */}
                <div className="w-full md:w-1/4 p-4">
                    <ul className="space-y-4">
                        <li className="text-gray-700 font-medium cursor-pointer hover:text-green-700">
                            <Image src={HomeIcon} alt="Home Icon" className="inline-block w-5 h-5 mr-2" width={20} height={20} />
                            Home
                        </li>
                        <li className="text-gray-700 font-medium cursor-pointer hover:text-green-700">
                            <Image src={EditIcon} alt="Home Icon" className="inline-block w-5 h-5 mr-2" width={20} height={20} />
                            Our Blog
                        </li>
                    </ul>
                </div>

                {/* Right Content */}
                <div className="flex-1 flex-row p-4">
                    {/* Add Post Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-20">
                            <div className="bg-white p-6 rounded-md shadow-md w-96">
                                <h2 className="text-xl text-black font-bold mb-4">Add Comment</h2>
                                <CommunityButton 
                                    setIsDropdownOpen={setIsDropdownCreatePostOpen}
                                    isDropdownOpen={isDropdownCreatePostOpen}
                                    onDropdownClick={onDropdownCreatePostClick}
                                />
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
                                <div className="flex flex-col space-y-4">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCreatePost}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                    >
                                        Post
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Search Box */}
                    <div className="flex items-center justify-between mb-4">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="flex-grow p-2 border border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700 text-black mr-4"
                            value={searchParams}
                            onChange={(e) => setSearchParams(e.target.value)}
                        />
                        <button
                            className="absolute right-2 top-2"
                            onClick={() => {
                                const filteredPosts = posts.filter((post: any) =>
                                    post.title.toLowerCase().includes(searchParams.toLowerCase())
                                );
                                setPosts(filteredPosts);
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 absolute right-2 top-2 text-gray-500 cursor-pointer black"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 4a7 7 0 100 14 7 7 0 000-14zm0 0l6.3 6.3m-6.3-6.3L4.7 10.7"
                                />
                            </svg>
                        </button>
                        <CommunityButton setIsDropdownOpen={setIsDropdownOpen} isDropdownOpen={isDropdownOpen} onDropdownClick={onDropdownClick} />
                        <button
                            className="bg-green-700 text-white px-4 py-2 rounded-md mr-4"
                            onClick={() => onCreatePostClick()}
                        >
                            Create +
                        </button>
                    </div>

                    {/* Post Feed Layout */}
                    <div className="flex flex-col gap-4">
                        {displayPost.map((post: any, index: any) => {
                            console.log('post', post)
                            return (
                                <Link
                                    key={index}
                                    href={{ pathname: '/home/posts', query: { id: post.id } }}
                                    className="bg-white p-4 rounded-md shadow-md flex flex-col h-full hover:bg-gray-50 transition"
                                >
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">By {post.author}</h3>
                                    <h2 className="text-lg font-bold text-gray-800">{post.title}</h2>
                                    <p className="text-gray-600 flex-grow mt-2">{post.content}</p>
                                    <div className="flex items-center mt-4 text-gray-500">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 mr-1"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17 8h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2h2m3-3h4m-4 0a2 2 0 00-2 2v1h8V7a2 2 0 00-2-2m-4 0h4"
                                            />
                                        </svg>
                                        {post.comments?.length || 0} comments
                                    </div>
                                </Link>
                            )
                        }
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}


const CommunityButton: React.FC<{ 
    setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>; 
    isDropdownOpen: boolean; 
    onDropdownClick: (tag: string) => void; 
}> = ({ setIsDropdownOpen, isDropdownOpen, onDropdownClick }) => {
    return (
        <div className="relative inline-block text-left mr-4">
            <button
                className="text-black px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
                Community
            </button>
            {isDropdownOpen && (
                <div className="absolute right-0 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                    <ul className="py-1">
                        <li>
                            <button
                                onClick={() => onDropdownClick('History')}
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                                History
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => onDropdownClick('Food')}
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                                Food
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => onDropdownClick('Pets')}
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                                Pets
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => onDropdownClick('Health')}
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                                Health
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => onDropdownClick('Fashion')}
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                                Fasion
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => onDropdownClick('Exercise')}
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                                Exercise
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => onDropdownClick('Exercise')}
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
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