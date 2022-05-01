import {
    ChatIcon,
    DotsHorizontalIcon,
    HeartIcon,
    ShareIcon,
    SwitchHorizontalIcon,
    TrashIcon,
  } from "@heroicons/react/outline";
  import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    setDoc,
  } from "@firebase/firestore";
  import {
    HeartIcon as HeartIconFilled,
  } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
  import Moment from "react-moment";
import { useRecoilState } from "recoil";
import { shareModalState } from "../atoms/modalAtom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
  
  function Comment({ comment , postID ,id ,userID,userName,userTag }) {
    const [user] = useAuthState(auth)
      const [liked,setLiked] = useState(false);
      const [likes,setLikes] = useState([])
      const [posts,setPosts] = useState([])
      const [isShareOpen,setIsShareOpen] = useRecoilState(shareModalState)
      const router = useRouter()
      const getPosts = () => {
        onSnapshot(
            query(collection(db, "posts"), orderBy("timestamp", "desc")),
            (snapshot) => {
              setPosts(snapshot.docs);
            }
          )
      }
      useEffect(() => {
        getPosts()
      },[])
      useEffect(
        () =>
          onSnapshot(collection(db,'posts',postID,"comments",id,'likes'), (snapshot) =>
            setLikes(snapshot.docs)
          ),
        [db, id]
      );
      useEffect(() => {
        setLiked(
          likes.findIndex((like) => like.id === user.uid) !== -1
        )
      },[likes])
      const likeComment = async () => {
        if(liked){
            await deleteDoc(doc(db,'posts',postID,"comments",id,'likes',user.uid))
          } else{
            await setDoc(doc(db,'posts',postID,"comments",id,'likes',user.uid), {
              userId: user.uid,
            })
          }
      }
    return (
      <div className="p-3 flex cursor-pointer border-b border-gray-700">
        <img
          src={comment?.userImg}
          alt=""
          className="h-11 w-11 rounded-full mr-4 object-cover"
        />
        <div className="flex flex-col space-y-2 w-full">
          <div className="flex justify-between w-full">
            <div className="text-[#6e767d]">
              <div className="inline-block group" onClick={() => router.push(`/user/${userTag}`)}>
                <h4 className="font-bold text-[#d9d9d9] text-[15px] sm:text-base inline-block group-hover:underline">
                  {comment?.username}
                </h4>
                <span className="ml-1.5 text-sm sm:text-[15px]">
                  @{comment?.tag}{" "}
                </span>
              </div>{" "}
              ·{" "}
              <span className="hover:underline text-sm sm:text-[15px]">
                <Moment fromNow>{comment?.timestamp?.toDate()}</Moment>
              </span>
              <p className="text-[#d9d9d9] mt-0.5 max-w-[440px] max-h-[150px] overflow-y-auto overflow-x-hidden text-[15px] sm:text-base">
                {comment?.comment}
              </p>
            </div>
            <div className="icon group flex-shrink-0">
              <DotsHorizontalIcon className="h-5 text-[#6e767d] group-hover:text-[#c01616]" />
            </div>

          </div>
  
          <div className="text-[#6e767d] flex justify-between w-10/12">
            {/* <div className="icon group">
              <ChatIcon className="h-5 group-hover:text-[#c01616]" />
            </div> */}
  
            <div className="flex items-center space-x-1 group" onClick={(e) => {
                e.stopPropagation()
                likeComment();
            }}>
              <div className="icon group-hover:bg-pink-600/10">
              {liked ? (
                <HeartIconFilled className="h-5 text-pink-600" />
              ) : (
                <HeartIcon className="h-5 group-hover:text-pink-600" />
              )}
              </div>
              {likes.length > 0 && (
              <span
                className={`group-hover:text-pink-600 text-sm ${
                  liked && "text-pink-600"
                }`}
              >
                {likes.length}
              </span>
            )}
            </div>
            
            {user.uid  === userID  ? (
                <div
                  className="flex items-center space-x-1 group"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteDoc(doc(db, "posts", postID , "comments" , id));
                  }}
                >
                  <div className="icon text-[#6e767d] group-hover:bg-red-600/10">
                    <TrashIcon className="h-5 group-hover:text-red-600" />
                  </div>
                </div>
                
              ) : (
                <div
                  className="flex items-center space-x-1 group"
                  
                >
                  <div className="icon text-[#6e767d] group-hover:bg-red-600/10">
                    <SwitchHorizontalIcon className="h-5 group-hover:text-green-500" />
                  </div>
                </div>
              )
            }
            
            <div onClick={(e) => {
              e.stopPropagation();
              setIsShareOpen(true);
            }} className="icon group relative">
            <div className="icon text-[#6e767d] group-hover:bg-[#c01616] group-hover:bg-opacity-10">
              <ShareIcon className="h-5 group-hover:text-[#c01616]" />
            </div>
          </div>
            
          </div>
        </div>
      </div>
    );
  }
  
  export default Comment;