import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'
import { auth, db } from '../firebase'
import {collection,addDoc,query, where, getDocs } from "firebase/firestore"; 
import getRecipientTag from '../utils/getRecipientTag'
import { useRouter } from "next/router";
function Chat({id,users}) {
    const [user] = useAuthState(auth)
    const [recipientSnapshot] = useCollection(query(collection(db, "users"), where("tag", "==",getRecipientTag(users,user) )));

    const router = useRouter()

    const enterChat = () => {
        router.push(`/chat/${id}`)
    }

    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientTag = getRecipientTag(users,user)
  return (
    <div onClick={enterChat} className="w-[100%] flex transition-all items-center cursor-pointer py-3 px-3 hover:bg-[#212121]">
        {recipient && (
            <img className="w-[45px] h-[45px] rounded-full object-cover mr-3" src={recipient?.photoUrl} />
        )}
        <p className="text-white">{recipientTag}</p>
    </div>
  )
}

export default Chat