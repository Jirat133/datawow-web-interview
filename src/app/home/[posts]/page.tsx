'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { UserContext, UserProvider } from '../../../context/UserContext';
import HomeIcon from '../../asset/image/home_icon.png';
import EditIcon from '../../asset/image/edit_icon.png';
import DeleteIcon from '../../asset/image/delete_icon.png';
import CommentIcon from '../../asset/image/comment_icon.png';
import SearchIcon from '../../asset/image/search_icon.png';
import Image from 'next/image';
import { ModalPost } from '../page';
import UserIcon from '../../asset/image/avatar_icon.png';
import MenuIcon from '../../asset/image/menu_icon.png';
import BackIcon from '../../asset/image/back_icon.png';
import Link from 'next/link';

interface PostDto {
    id: number;
    title: string;
    content: string;
    tag: string;
    author: number;
    createdAt: Date;
    updatedAt: Date;
    comments?: CommentDto[];
}

interface CommentDto {
    id: number;
    postId: number;
    content: string;
    author: string;
    createdAt: Date;
    updatedAt: Date;
}

export default function PostPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const postId = searchParams.get('id');
    const [isCommentBoxOpen, setIsCommentBoxOpen] = useState(false);
    const [post, setPost] = useState<PostDto | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editCommentId, setEditCommentId] = useState<number | null>(null);
    const [editCommentContent, setEditCommentContent] = useState('');
    const [commentContent, setCommentContent] = useState('');
    const [newComment, setNewComment] = useState('');
    const { user: currentUser } = useContext(UserContext);

    const fetchPostDetail = async (postId: string | null) => {
        if (postId) {
            fetch(`http://localhost:3001/postDetail/${postId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    setPost(data)
                    console.log('Post data:', data);
                })
                .catch((err) => console.error('Error fetching post:', err));
        }
    }
    useEffect(() => {
        if (postId) {
            fetchPostDetail(postId);
        }
    }, []);

    if (!post) {
        return <div>Loading...</div>;
    }

    const handlePostComment = async () => {
        try {
            const response = await fetch(`http://localhost:3001/comments`, {
                method: "POST",
                body: JSON.stringify({
                    postId: Number(postId), // ID of the post the comment belongs to
                    content: newComment, // Content of the comment
                    author: currentUser.username, // Author of the comment
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const result = await response.json();
            if (!(result.statusCode === 201)) {
                alert(`Failed to create comment: ${result.message}`);
                return;
            } else {
                setPost(result.data);
            }

            setNewComment('');
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error posting comment:', error);
            alert('Failed to post comment');
        } finally {
            setIsModalOpen(false);
            setNewComment('');
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        try {
            const response = await fetch(`http://localhost:3001/comments/${commentId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    author: currentUser.username, // Author of the comment
                })
            });
            const result = await response.json();
            if (!(result.statusCode === 200)) {
                alert(`Failed to delete comment: ${result.message}`);
                return;
            } else {
                await fetchPostDetail(postId);
            }

        } catch (e) {
            alert('Failed to delete comment');
        }
    }


    const handleEditComment = async () => {
        try {
            const response = await fetch(`http://localhost:3001/comments/${editCommentId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: editCommentContent, // Updated content of the comment
                    author: currentUser.username, // Author of the comment
                })
            });

            const result = await response.json();
            if (!(result.statusCode === 200)) {
                alert(`Failed to edit comment: ${result.message}`);
                return;
            } else {
                await fetchPostDetail(postId);
            }

            setIsModalOpen(false);
        } catch (error) {
            console.error('Error editing comment:', error);
            alert('Failed to edit comment');
        } finally {
            setIsModalOpen(false);
        }
    };

    const onEditCommentClick = (comment: any) => {
        setEditCommentId(comment.id);
        setEditCommentContent(comment.content);
        setIsModalOpen(true);
    };

    return (
        <div className="bg-custom-grey-300 h-screen flex overflow-hidden">
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
            <div className="flex flex-col md:flex-row h-full pt-14 w-full ">

                {/* Left Menu Bar */}
                <div className="hidden md:block w-full md:w-1/4 p-4 bg-custom-grey-100">
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
                <div className="flex-1 p-4 bg-white pl-16 pt-12">
                    {/* Edit Comment Modal */}
                    <ModalComment
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                        handleSubmit={() => handleEditComment()}
                        commentContent={editCommentContent}
                        setCommentContent={setEditCommentContent}
                    />

                    {/* Go Back Button */}
                    <button
                        onClick={() => router.back()}
                        className="bg-custom-grey-100 w-12 h-12 flex items-center justify-center rounded-full cursor-pointer hover:bg-custom-grey-300 text-white mb-4 ml-5"
                    >
                        <Image src={BackIcon} alt="Back Icon" className="w-6 h-6" width={24} height={24} />
                    </button>
                    {/* Post Details */}
                    <div className="p-5">
                        <div className='flex items-center gap-2 mb-4'>
                            <div className='flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full'>
                                <Image
                                    src={UserIcon}
                                    alt="Post Image"
                                    width={46}
                                    height={46}
                                    className="rounded-full"
                                />

                            </div>
                            <p className="font-bold text-black">{post?.author}</p>
                            <p className=" text-black">
                                {new Date(post?.updatedAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex flex-wrap w-1/15 h-1/15 gap-2 mb-4">
                            <span
                                className="bg-gray-100 px-3 py-1 rounded-xl text-sm text-black"
                            >
                                {post?.tag}
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold mb-4 text-black">{post?.title}</h1>
                        <p className="mb-6 text-base text-black ">{post?.content}</p>

                        <div className="flex items-center gap-2 mb-6">
                            <Image src={CommentIcon} alt="Comment Icon" width={20} height={20} className="mr-4" />
                            <span className="text-black">{post?.comments?.length ?? 0} comments</span>
                        </div>

                        {/* Add Comment Button */}
                        {!isCommentBoxOpen && (
                            <button
                                onClick={() => setIsCommentBoxOpen(true)}
                                className="border border-green-600 text-green-600 px-4 py-2 rounded-md hover:bg-green-100">
                                Add Comment
                            </button>
                        )

                        }
                        {
                            isCommentBoxOpen && (
                                <div>
                                    <textarea
                                        className="border border-gray-300 rounded-md p-4 mb-6 w-full text-black"
                                        rows={3}
                                        placeholder="Write your comment here..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                    ></textarea>
                                    <div className="flex justify-end space-x-4">
                                        <button
                                            onClick={() => {
                                                setIsCommentBoxOpen(false);
                                                setNewComment('');
                                            }}
                                            className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handlePostComment}
                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                        >
                                            Post
                                        </button>
                                    </div>
                                </div>
                            )
                        }


                        {/* Comments Section */}
                        <div className="overflow-y-auto max-h-96 h-full mt-4">
                            <ul className="list-none p-0">
                                {post?.comments?.map((comment) => (
                                    <li
                                        key={comment.id}
                                        className="relative mb-4 pb-4"
                                    >
                                        <div className="absolute top-2 right-2 flex gap-2">
                                            <button className="text-gray-500 hover:text-gray-700" onClick={() => onEditCommentClick(comment)}>
                                                <Image src={EditIcon} alt="Edit Icon" width={16} height={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteComment(comment.id)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                <Image src={DeleteIcon} alt="Delete Icon" width={16} height={16} />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
                                                <Image
                                                    src={UserIcon}
                                                    alt="Comment Image"
                                                    width={32}
                                                    height={32}
                                                />
                                            </div>
                                            <span className="text-gray-500">
                                                {comment.author}
                                            </span>
                                            <span className="text-gray-500">
                                                {new Date(comment.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-black">{comment.content}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const ModalComment = ({ isModalOpen, setIsModalOpen, handleSubmit, commentContent, setCommentContent }: any) => {
    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-20">
            <div className="flex flex-col bg-white p-6 rounded-md shadow-md w-96">
                <h2 className="text-xl text-black font-bold mb-4">Edit Comment</h2>
                <textarea
                    className="w-full text-black border border-gray-300 rounded-md p-2 mb-4"
                    rows={4}
                    placeholder="What's on your mind..."
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                ></textarea>
                <div className="flex flex-col space-y-4">
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
}
