import React, { useEffect,useState } from 'react'
import { HomeIcon } from "@heroicons/react/solid";
import {collection,addDoc,query, where, getDocs } from "firebase/firestore"; 
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRouter } from 'next/router'
import Chat from './Chat';
import { useRecoilState } from 'recoil';
import { chatAddUserModalState } from '../atoms/modalAtom';
function  ChatSidebarDekstop({userImage,userName,tag,chatScreen,userDatas}) {
    const [user] = useAuthState(auth)
    const userTag = user.email.split("@");
    const userChatRef = query(collection(db, "chats"), where("users", "array-contains", userTag[0]));
    const [chatsSnapshot] = useCollection(userChatRef)
    const [isUserHave,setIsUserHave] = useState(false)
    const router = useRouter()
    const size = useWindowSize();
    const [isChatAddUserModalOpen,setIsChatAddUserModalOpen] = useRecoilState(chatAddUserModalState)
    // console.log(userDatas)
      
            
    
    
    
  return (
    <div className={`h-screen sm:max-w-[350px] chatSideBar overflow-y-scroll scrollbarHidden py-3 px-3 border-r border-gray-800 flex-[0.45] ${size.width < 640 ? (chatScreen && `hidden`) : ""}`}>
        <div className="flex items-center pb-3 justify-between border-b border-gray-800">
            <div className="flex items-center cursor-pointer" onClick={() => router.push(`/user/${tag}`)}>
                <img className="h-[50px] w-[50px] rounded-full object-cover" src={userImage}/>
                <div className="flex items-start justify-center flex-col ml-3">
                    <h3 className="text-white">{userName.length > 18 ? userName.substring(0,18)+"..." : userName}</h3>
                    <p className="text-gray-700 text-[13px]">@{tag}</p>
                </div>
            </div>
            <button onClick={() => router.push('/')} className="transition hover:opacity-[0.7]"><HomeIcon className="h-6 text-white"/></button>
        </div>
        <div className="border-b border-gray-800">
            <button onClick={() => setIsChatAddUserModalOpen(true)} className="text-white text-center  w-full py-3 transition hover:opacity-[0.7]">Add New Chat</button>
        </div>
        {/* <div className="mt-4 pb-3">
            <input type="text" className="text-white w-full bg-transparent outline-none border border-gray-500 rounded-lg px-1 py-1" placeholder="Search..."/>
        </div> */}
        <div className="mt-1">
          {chatsSnapshot?.docs.map((chat) => (
              <Chat key={chat.id} id={chat.id} users={chat.data().users} />
          ))}
        </div>
    </div>
  )
}

export default ChatSidebarDekstop
// Hook
function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
      width: undefined,
      height: undefined,
    });
  
    useEffect(() => {
      // only execute all the code below in client side
      if (typeof window !== 'undefined') {
        // Handler to call on window resize
        function handleResize() {
          // Set window width/height to state
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        }
      
        // Add event listener
        window.addEventListener("resize", handleResize);
       
        // Call handler right away so state gets updated with initial window size
        handleResize();
      
        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
      }
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
  }