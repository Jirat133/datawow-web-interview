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


interface Comment {
    id: number;
    postId: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    body: string;
    author: string;
}

interface PostDto {
    id: number; // Unique identifier for the post
    title: string; // Title of the post
    content: string; // Content of the post
    tag: string; // Tag associated with the post
    userId: number; // Author of the post
    createdAt: Date; // Timestamp when the post was created
    updatedAt?: Date; // Optional timestamp for when the post was last updated
    comments?: CommentDto[]; // Optional list of comments associated with the post
}

interface CommentDto {
    id: number; // Unique identifier for the comment
    postId: number; // ID of the post the comment belongs to
    content: string; // Content of the comment
    author: string; // Author of the comment
    createdAt: Date; // Timestamp when the comment was created
    updatedAt: Date; // Timestamp when the comment was last updated
}

interface PostResponseDto {
    id: number; // Unique identifier for the post
    title: string; // Title of the post
    content: string; // Content of the post
    tag: string; // Tag associated with the post
    author: string; // Author of the post
    createdAt: Date; // Timestamp when the post was created
    updatedAt?: Date; // Optional timestamp for when the post was last updated
    comments?: CommentDto[]; // Optional list of comments associated with the post
}

export default function PostPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const postId = searchParams.get('id');
    const [post, setPost] = useState<PostResponseDto | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editCommentId, setEditCommentId] = useState<number | null>(null);
    const [editCommentContent, setEditCommentContent] = useState('');
    const [commentContent, setCommentContent] = useState('');
    const [newComment, setNewComment] = useState('');
    const [commentList, setCommentList] = useState<Comment[]>([]);
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
        if (newComment.trim() === '') {
            alert('Comment cannot be empty');
            return;
        }
        try {
            console.log('Current User:', currentUser);
            const response = await fetch(`http://localhost:3001/comments`, {
                method: "POST",
                body: JSON.stringify({
                    postId: Number(postId), // ID of the post the comment belongs to
                    content: newComment, // Content of the comment
                    author: currentUser.username, // Author of the comment
                    createdAt: new Date(), // Timestamp when the comment was created
                    updatedAt: new Date(), // Timestamp when the comment was last updated
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error('Failed to post comment');
            }
            const data = await response.json();
            console.log('Comment posted:', data);
            setPost(data);
            setNewComment('');
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error posting comment:', error);
            alert('Failed to post comment');
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        console.log('Deleting comment with ID:', commentId);
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
            await fetchPostDetail(postId);
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
            if (!response.ok) {
                throw new Error('Failed to edit comment');
            }
            const data = await response.json();
            await fetchPostDetail(postId);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error editing comment:', error);
            alert('Failed to edit comment');
        }
    };

    const onEditCommentClick = (comment: any) => {
        setEditCommentId(comment.id);
        setEditCommentContent(comment.content);
        setIsModalOpen(true);
    };

    return (
        <div className="font-sans bg-white min-h-screen flex">
            {/* Top Bar */}
            <div className="fixed top-0 left-0 w-full flex justify-between items-center p-4 bg-custom-green-500 text-white z-10">
                <span>aBoard</span>
                <button className="bg-light-green-500 text-green-800 px-4 py-2 rounded-md">
                    Sign In
                </button>
            </div>


            {/* Main Content */}
            <div className="flex flex-1 flex-col md:flex-row w-full mt-16">

                {/* Left Menu Bar */}
                <div className="w-1/5 bg-gray-100 pt-16 p-4">
                    <ul className="space-y-4">
                        <li>
                            <button
                                onClick={() => router.push('/')}
                                className="text-black hover:text-green-600"
                            >
                                Home
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => router.push('/blog')}
                                className="text-black hover:text-green-600"
                            >
                                Our Blog
                            </button>
                        </li>
                    </ul>
                </div>
                {/* Go Back Button */}
                <div className="flex-1 p-4">
                    {/* Edit Comment Modal */}
                    <ModalComment
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                        handleSubmit={() => handleEditComment()}
                        commentContent={editCommentContent}
                        setCommentContent={setEditCommentContent}
                    />
                    {/* Add Comment Modal */}
                    {/* {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
                            <div className="bg-white p-6 rounded-md shadow-md w-96">
                                <h2 className="text-xl text-black font-bold mb-4">Add Comment</h2>
                                <textarea
                                    className="w-full text-black border border-gray-300 rounded-md p-2 mb-4"
                                    rows={4}
                                    placeholder="What's on your mind..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                ></textarea>
                                <div className="flex flex-col space-y-4">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
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
                        </div>
                    )} */}
                    <button
                        onClick={() => router.back()}
                        className="bg-none border border-green-500 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-100 text-green-500 mb-4"
                    >
                        Go Back
                    </button>
                    {/* Post Details */}
                    <div className="p-5">
                        <div className='flex items-center gap-2 mb-4'>
                            <p className="font-bold mb-2 text-black">{post?.author}</p>
                            <p className=" text-black mb-2">
                                {new Date(post?.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex flex-wrap w-1/15 h-1/15 gap-2 mb-4">
                            <span
                                className="bg-gray-200 px-3 py-1 rounded-md text-sm text-black"
                            >
                                {post?.tag}
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold mb-4 text-black">{post?.title}</h1>
                        <p className="mb-6 text-base text-black ">{post?.content}</p>

                        <div className="flex items-center gap-2 mb-6">
                            <Image src={CommentIcon} alt="Comment Icon" width={16} height={16} className="mr-4" />
                            <span className="text-black">{post?.comments?.length ?? 0} comments</span>
                        </div>

                        {/* Add Comment Button */}
                        {/* <button
                            onClick={() => setIsModalOpen(true)}
                            className="border border-green-600 text-green-600 px-4 py-2 rounded-md hover:bg-green-100">
                            Add Comment
                        </button> */}
                        {/* <div className="border border-gray-300 rounded-md mb-6"> */}
                        <textarea
                            className="border border-gray-300 rounded-md p-4 mb-6 w-full text-black"
                            rows={3}
                            placeholder="Write your comment here..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        ></textarea>
                        {/* </div> */}
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setNewComment('')}
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

                        {/* Comments Section */}
                        <h2 className="text-xl font-semibold mt-6 mb-4 text-black">Comments</h2>
                        <ul className="list-none p-0">
                            {post?.comments?.map((comment) => (
                                <li
                                    key={comment.id}
                                    className="relative mb-4 border-b border-gray-300 pb-4"
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
