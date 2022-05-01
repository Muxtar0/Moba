import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'
import { auth, db } from '../firebase'
import {collection,addDoc,query, where } from "firebase/firestore"; 
import getRecipientTag from '../utils/getRecipientTag'
import { useRouter } from "next/router";
function Chat({id,users}) {
    const [user] = useAuthState(auth)
    const [recipientSnapshot] = useCollection(query(collection(db, "users"), where("tag", "==",getRecipientTag(users,user) )));
    const size = useWindowSize();
    const router = useRouter()

    const enterChat = () => {
        router.push(`/chat/${id}`)
    }

    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientTag = getRecipientTag(users,user)
  return (
    <div onClick={enterChat} className="w-[100%] flex transition-all items-center cursor-pointer py-3 px-3 hover:bg-[#212121]">
        <div className="flex items-center justify-start">
          {recipient && (
            <img className="w-[45px]  h-[45px] rounded-full object-cover" src={recipient?.photoUrl} />
          )}
          {recipient && (
            <div className="ml-2">
              {size.width > 640 ? (
                <h3 className="font-bold text-white">{recipient.name.length < 23 ? recipient.name : recipient.name.substring(0, 22)+"..."}</h3>
              ) : (
                <h3 className="font-bold text-white">{recipient.name}</h3>
              )}
              <p className="text-[14px] text-gray-700">@{recipientTag}</p>
            </div>
          )}
        </div>
    </div>
  )
}

export default Chat
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      function handleResize() {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    
      window.addEventListener("resize", handleResize);
     
      handleResize();
    
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []); 
  return windowSize;
}