import { AnnotationIcon } from '@heroicons/react/outline'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../firebase';
import Input from './Input'
import Post from './Post'
import { useRouter } from "next/router";
function Feed({userImage,userName,userTag}) {
    const [posts,setPosts] = useState([]);
    const router = useRouter()

  // CLEAN
  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "posts"), orderBy("timestamp", "desc")),
        (snapshot) => {
          setPosts(snapshot.docs);
        }
      ),
    [db]
  );
  return (
    <div className='text-white flex-grow border-l border-r  border-gray-700 max-w-2xl sm:ml-[73px] xl:ml-[200px] 2xl:ml-[0px] 2xl:max-w-[1500px]'>
        <div className='text-[#d9d9d9] flex items-center sm:justify-between py-2 px-3 sticky top-0 z-50 bg-black bg-opacity-90'>
            <h2 className='text-lg sm:text-xl font-bold'>Home</h2>
            <div onClick={() => router.push('/chat')} className='hoverAnimation h-9 w-9 flex items-center justify-center xl:px-0 ml-auto'>
                <AnnotationIcon className='h-5 text-white' />
            </div>
        </div>

        <Input userName={userName} userImage={userImage} userTag={userTag}/>

        <div className="pb-72">
        {posts.map((post) => (
          <Post key={post.id} id={post.id} post={post.data()} userName={userName} userImage={userImage} userTag={userTag} />
        ))}
      </div>
    </div>
  )
}

export default Feed