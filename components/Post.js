import React from 'react'
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  addDoc,
} from "@firebase/firestore";
import {
  ChartBarIcon,
  ChatIcon,
  DotsHorizontalIcon,
  HeartIcon,
  ShareIcon,
  SwitchHorizontalIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import {
  HeartIcon as HeartIconFilled,
  ChatIcon as ChatIconFilled,
} from "@heroicons/react/solid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Moment from "react-moment";
import { useRecoilState } from "recoil";
import { modalState, postIdState, shareModalState, sharePostIDstate } from "../atoms/modalAtom";
import { auth, db } from "../firebase";
import parse from 'html-react-parser';

import Link from 'next/link'
import { useAuthState } from 'react-firebase-hooks/auth';
function Post({id,post,postPage,userName,userTag,userImage}) {
  const [user] = useAuthState(auth)
  const [isOpen,setIsOpen] = useRecoilState(modalState)
  const [isShareOpen,setIsShareOpen] = useRecoilState(shareModalState) 
  const [PostId,setPostId] = useRecoilState(postIdState)
  const [sharePostID , setSharePostID] = useRecoilState(sharePostIDstate)
  const [comments,setComments] = useState([])
  const router = useRouter()
  const [liked,setLiked] = useState(true)
  const [likes,setLikes] = useState([]);
  const [isLinkHave , setIsLinkHave] = useState(false)
  const [linkText , setLinkText] = useState("")
  const [isDeleting,setIsDeleting] = useState(false)
  const [postPageUrl,setPostPageUrl] = useState("")
  const parse = require('html-react-parser');


  useEffect(() => {
    onSnapshot(query(collection(db,"posts",id,"comments"),orderBy("timestamp","desc")),(snapshot) => {
      setComments(snapshot.docs)
    })
  },[db,id])

  useEffect(
    () =>
      onSnapshot(collection(db, "posts", id, "likes"), (snapshot) =>
        setLikes(snapshot.docs)
      ),
    [db, id]
  );
  useEffect(() => {
    setLiked(
      likes.findIndex((like) => like.id === user?.uid) !== -1
    )
  },[likes])
  function URLReplacer(str){
    if(str.includes("http")){
      let match = str.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);
      let final=str;
      match.map(url=>{
          final=final.replace(url,"<a className='text-[#d55757]' href=\""+url+"\" target=\"_BLANK\">"+url+"</a>")
      })
      setIsLinkHave(true)
      setLinkText(final);
    }
    else{
      setIsLinkHave(false)
    }
  }
  useEffect(() => {
    if(postPage){
      onSnapshot(doc(db, "posts", id), (snapshot) => {
        URLReplacer(snapshot.data().text)
      })
    }
    else{
      URLReplacer(post?.text)
    }
  },[db,id])
  const likePost = async () => {
    const likeRef = doc(db,'posts',id,'likes',user.uid)
    if(liked){
      await deleteDoc(likeRef)
    } 
    else{
      await setDoc(likeRef, {
        userId: user.uid,
      })
    }
  }
  const openUserPage =() => {
    const user = post.tag;
    router.push(`/user/${user}`)
  }
  return (
    <div className='p-3 flex cursor-pointer border-b border-gray-700' onClick={() => router.push(`/post/${id}`)}>
      {!postPage && (
        <img onClick={(e) => {
          e.stopPropagation();
          openUserPage();
        }} src={post?.userImg}  className="h-11 w-11 rounded-full mr-4 object-cover"/>
      )}
      <div className='flex flex-col space-y-2 w-full'>
        <div className={`flex ${!postPage && "justify-between"}`}>
            {postPage && (
               <img onClick={(e) => {
                e.stopPropagation();
                openUserPage();
              }} src={post?.userImg} alt="Profile Pic" className="h-11 w-11 rounded-full mr-4"/>
            )}
            <div className='text-[#6e767d]'>
              <div className='inline-block group' onClick={(e) => {
                e.stopPropagation();
                openUserPage();
              }}>
                <h4 className={`font-bold text-[15px] sm:text-base text-[#d9d9d9] group-hover:underline ${!postPage && "inline-block"}`}>{post?.username}</h4>
                <span className={`text-sm sm:text-[15px] ${!postPage && "ml-1.5"}`}>@{post?.tag}</span>
              </div>{" "}
              ·{" "}
              <span className='hover:underline text-sm sm:text-[15px]'>
                <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
              </span>
              {!postPage && (   
                isLinkHave == true ? (
                  <div className='text-[#d9d9d9] text-[15px] sm:text-base mt-0.5'>{parse(linkText)}</div>
                ) : <p className='text-[#d9d9d9] text-[15px] sm:text-base mt-0.5'>{post?.text}</p>
              )}
            </div>
            <div className='icon group flex-shrink-0 ml-auto'>
                <DotsHorizontalIcon className='h-5 text-[#6e767d] group-hover:text-[#c01616]' />
            </div>
        </div>
        {postPage && (
          isLinkHave == true ? (
            <div className='text-[#d9d9d9] text-[15px] sm:text-base mt-0.5'>{parse(linkText)}</div>
          ) : <p className='text-[#d9d9d9] text-[15px] sm:text-base mt-0.5'>{post?.text}</p>
        )}
        <img src={post?.image} className="rounded-2xl max-h-[400px] object-cover mr-2" />
        <div className={`text=[#6e767d] flex justify-between w-10/12 ${postPage && "mx-auto"}`}>
        <div
            className="flex items-center space-x-1 group"
            onClick={(e) => {
              e.stopPropagation();
              setPostId(id);
              setIsOpen(true);
            }}
          >
            <div className="icon group-hover:bg-[#c01616] group-hover:bg-opacity-10">
              <ChatIcon className="h-5 text-white group-hover:text-[#c01616]" />
            </div>
            {comments.length > 0 && (
              <span className="group-hover:text-[#c01616] text-white text-sm">
                {comments.length}
              </span>
            )}
          </div>

          {user.uid === post?.id ? (
            <div
              className="flex items-center space-x-1 group"
              onClick={(e) => {
                e.stopPropagation();
                deleteDoc(doc(db, "posts", id));
                router.push("/");
              }}
            >
              <div className="icon text-white group-hover:bg-red-600/10">
                <TrashIcon className="h-5 group-hover:text-red-600" />
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-1 group">
              <div className="icon text-white group-hover:bg-green-500/10">
                <SwitchHorizontalIcon className="h-5 group-hover:text-green-500" />
              </div>
            </div>
          )}

          <div
            className="flex items-center space-x-1 group"
            onClick={(e) => {
              e.stopPropagation();
              likePost();
            }}
          >
            <div className="icon text-white group-hover:bg-pink-600/10">
              {liked ? (
                <HeartIconFilled className="h-5 text-pink-600" />
              ) : (
                <HeartIcon className="h-5 group-hover:text-pink-600" />
              )}
            </div>
            {likes.length > 0 && (
              <span
                className={`group-hover:text-pink-600 text-white text-sm ${
                  liked && "text-pink-600"
                }`}
              >
                {likes.length}
              </span>
            )}
          </div>

          <div onClick={(e) => {
              e.stopPropagation();
              setIsShareOpen(true);
              setSharePostID(id)
            }} className="icon group relative">
            <div className="icon text-white group-hover:bg-[#c01616] group-hover:bg-opacity-10">
              <ShareIcon className="h-5 group-hover:text-[#c01616]" />
            </div>
          </div>
          
        </div>
      </div>
    </div>
    
  )
}

export default Post