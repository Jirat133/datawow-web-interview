'use client'
import React, { useEffect } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import HomeIcon from '../asset/image/home_icon.png';
import EditIcon from '../asset/image/edit_icon.png';
import Link from 'next/link';

export default function Homepage() {
    const [posts, setPosts] = useState<any>([])
    const [searchParams, setSearchParams] = useState<string>('');
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
    };
    fetchPosts();
}, []);
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
                <div className="flex-1 p-4">
                    {/* Search Box */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full p-2 border border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700 text-black"
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
                    </div>

                    {/* Post Feed Layout */}
                    <div className="flex flex-col gap-4">
                        {posts.map((post: any, index: any) => {
                            console.log('post', post)
                            return(
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
                        )}
                        )}
                    </div>
                    {/* <div className="flex flex-col lg:grid-cols-3 gap-4">
                        {posts.map((post: any, index: any) => (
                            <div
                                key={index}
                                className="bg-white p-4 rounded-md shadow-md flex flex-col h-full"
                            >
                                <h2 className="text-lg font-bold text-gray-800">{post.title}</h2>
                                <p className="text-gray-600 flex-grow">{post.content}</p>
                            </div>
                        ))}
                    </div> */}
                
                </div>
            </div>
        </div>
    );
}