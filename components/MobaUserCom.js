import { SparklesIcon,LinkIcon,CalendarIcon } from '@heroicons/react/outline'
import React, { useEffect, useState} from 'react'
import { auth, db } from "../firebase";
import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    setDoc,
    where, getDocs,getDoc
  } from "@firebase/firestore";
import Post from '../components/Post'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from "next/router";
import { ArrowLeftIcon } from '@heroicons/react/solid';
function MobaUserCom({userImage,userName,userTag,creationTime,userID,bio,website}) {
    const router = useRouter()
    const [user] = useAuthState(auth)
    const [isFollowing,setIsFollowing] = useState(true)
    const [followers,setFollowers] = useState([])
    const [followings,setFollowings] = useState([])
    const [posts,setPosts] = useState([])
    const [limitLink,setLimitLink] = useState(30)
    const creationTimeMain = creationTime.split(' ')
    const getPosts = () => {
        onSnapshot(
            query(collection(db, "posts"), orderBy("timestamp", "desc")),
            (snapshot) => {
              setPosts(snapshot.docs);
            }
          )
    }
    useEffect(() => {
        getPosts();
    },[])
    useEffect(() =>{
        onSnapshot(collection(db, "users", userID, "followers"), (snapshot) =>
      setFollowers(snapshot.docs)
    )
    onSnapshot(collection(db, "users", userID, "following"), (snapshot) =>
    setFollowings(snapshot.docs)
    )
    }
    ,
        [db,userTag]
    );
    useEffect(() => {
        setIsFollowing(
            followers.findIndex((follower) => follower.id === user?.uid) !== -1
        )
    },[followers])
    const followHandler = async () => {
        const followRef = doc(db,'users',userID,'followers',user.uid)
        const followingRef = doc(db,'users',user.uid,'following',userID)
        if(isFollowing){
          await deleteDoc(followRef)
          await deleteDoc(followingRef)
        } 
        else{
          await setDoc(followRef, {
            userId: user.uid,
          })
          await setDoc(followingRef, {
            userId:userID,
          })
        }
      }

  return (
    <div className='text-white flex-grow border-l border-r border-gray-700 max-w-2xl w-[100%] sm:w-auto sm:ml-[73px] xl:ml-[200px] 2xl:ml-[370px]'>
        <div className="flex items-center px-1.5 py-2 border-b border-gray-700 text-[#d9d9d9] font-semibold text-xl gap-x-4 sticky top-0 z-50 bg-black">
            <div
              className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0"
              onClick={() => router.push("/")}
            >
              <ArrowLeftIcon className="h-5 text-white" />
            </div>
            {userName}
          </div>

        <div className='border-b border-gray-700 pb-6'>
            <div className='h-64 w-full relative'>
                <div className='w-full h-full bg-gray-700'></div>
                <div className='w-32 h-32 rounded-full absolute bottom-[-23%] border-4 border-black left-4' >
                    <img className='w-full h-full rounded-full' src={userImage} />
                </div>
            </div>
            <div className='mt-20 px-4 flex relative justify-between w-full'>
                <div className='w-[100%]'>   
                    <h2 className='text-white font-bold text-[26px] leading-[30px]'>{userName.length > 20 ? userName.substring(0,19) +"..." : userName}</h2>
                    <p className='text-gray-500'>@{userTag}</p>
                    <p className="text-white my-3 break-words w-full">{bio}</p>
                    <div className="flex items-start sm:items-center justify-start flex-col sm:flex-row">
                        <a href={website} className='text-[#c01616] text-[15px] flex  items-center'>{website.length > 0 && <LinkIcon className="h-4 mr-1"/>}{
                            website.length < limitLink ? website : website.substring(0, limitLink) + "..."
                        }</a>
                        <p className={`text-gray-600 text-[15px] flex mt-2 sm:mt-0 items-center ${website.length > 1 && `sm:ml-2`}`}><CalendarIcon className="h-4 mr-1" />Joined {creationTimeMain[1] + " " + creationTimeMain[2] + " " + creationTimeMain[3]}</p>
                    </div>
                    <div className="flex items-center">
                        <p onClick={() => {router.push(`/followers/${userID}`)}} className="text-white cursor-pointer group transition mt-2 font-bold">{followers.length} <span className="text-gray-500 group-hover:underline font-normal">Followers</span></p>
                        <p onClick={() => {router.push(`/followings/${userID}`)}} className="text-white ml-4 cursor-pointer group transition mt-2 font-bold">{followings.length} <span className="text-gray-500 group-hover:underline font-normal">Followings</span></p>
                    </div>
                </div>
                <div className="flex justify-start absolute right-6 top-[-50px] flex-col items-center">
                    {userID != user.uid ? (
                        <button className='px-6 py-1 bg-white text-black rounded-3xl' onClick={followHandler}>
                            {isFollowing == false ? "Follow": "Unfollow"}
                        </button>
                    ) : (
                        <button className='px-6 py-1 bg-white text-black rounded-3xl' onClick={() => {router.push(`/editpage/${userTag}`)}}>Edit</button>
                    )}
                </div>
            </div>
            <div className="mt-2 px-4">
                
            </div>
        </div>
        <div className="pb-72">
            <div className="py-2 px-4 border-b border-gray-700">
                <h2 className="text-white  font-bold ">
                    {userID == user.uid ? "Your Posts" : `${userName}'s Posts`}
                </h2>
            </div>
            {posts.map((post) => (
                userID  === post._document.data.value.mapValue.fields.id.stringValue ? <Post key={post.id} userName={userName} id={post.id} post={post.data()} /> : ""
            ))}
        </div>
        <div>

        </div>
    </div>
  )
}

export default MobaUserCom