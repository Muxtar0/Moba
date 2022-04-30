import { collection, doc, orderBy, query,setDoc,serverTimestamp, addDoc, where } from 'firebase/firestore'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'
import { auth, db, storage } from '../firebase'
import Message from './Message'
import getRecipientTag from '../utils/getRecipientTag'
import Moment from 'react-moment'
import { PaperAirplaneIcon,XIcon,PhotographIcon } from "@heroicons/react/solid";
import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import {
    EmojiHappyIcon,
} from '@heroicons/react/outline'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
function ChatScreen({chat,messages}) {
    const [user] = useAuthState(auth)
    const [input,setInput] = useState("")
    const endOfMessageRef = useRef(null)
    const router = useRouter()
    const size = useWindowSize();
    const [showEmojis, setShowEmojis] = useState(false)

    const filePickerRef = useRef()
    const [selectedFile, setSelectedFile] = useState(null)


    const [messagesSnapshot] = useCollection(query(collection(db,"chats",router.query.id,"messages"),orderBy("timeStamp",'asc')))
    const [recipientSnapshot] = useCollection(query(collection(db,"users"),where('tag' , "==", getRecipientTag(chat.users,user))))
    const scrollToBottom = () => {
        endOfMessageRef.current.scrollIntoView({
            behavior: "smooth",
            block:"start", 
        })  
    }
    const showMessages = () => {
        if(messagesSnapshot){
            return messagesSnapshot.docs.map(message => (
                <Message
                    key={message.id}
                    user={message.data().user}
                    message={{
                        message:message.data().message,
                        timeStamp:message.data().timeStamp?.toDate().getTime()

                    }}
                />
            ))
        }
        else{
            return JSON.parse(messages).map(message => (
                <Message
                    key={message.id}
                    user={message.user}
                    message={message.message}
                />
            ))
        }
    }
    
    const sendPhoto = (e) => {
      const reader = new FileReader()
      
      if(e.target.files[0]){
          reader.readAsDataURL(e.target.files[0]);
      }

      reader.onload = (readerEvent) => {
          setSelectedFile(readerEvent.target.result)
      }
    }

    const sendMessage = async (e) => {
        e.preventDefault();
        if(selectedFile){
          if(selectedFile.split("/")[0] == "data:video"){
            alert("You can't send video")
            setSelectedFile(null)
          }
          else{
            setDoc(doc(db, "users", user.uid), {
              lastSeen:serverTimestamp(),
            }, {merge:true});
            
            const imageRef = ref(storage , `chats/chat/${router.query.id}/${Math.random()}`)
  
               await uploadString(imageRef,selectedFile,"data_url").then(async () => {
                const downloadURL = await getDownloadURL(imageRef);
                if(downloadURL){
                  const docRef = await addDoc(collection(db,'chats',router.query.id,"messages") , {
                    timeStamp:serverTimestamp(),
                    message:downloadURL,
                    user:user.email.split("@")[0]
                  })
                }
            })
            setSelectedFile(null)
            setInput("")
            setShowEmojis(false)
            scrollToBottom()
          }
        }
        else{
          if(e.target.value !== undefined || e.target.value !== " " || e.target.value !== "" || e.target.value !== null){
            setDoc(doc(db, "users", user.uid), {
                lastSeen:serverTimestamp(),
            }, {merge:true});
            const docRef = addDoc(collection(db,'chats',router.query.id,"messages") , {
                timeStamp:serverTimestamp(),
                message:input,
                user:user.email.split("@")[0]
            })
            setInput("")
            setShowEmojis(false)
            scrollToBottom()
          }
        
        }
    }
    const addEmoji = (e) => {
        let sym = e.unified.split('-')
        let codesArray = []
        sym.forEach((el) => {
          codesArray.push('0x' + el)
        })
        let emoji = String.fromCodePoint(...codesArray)
        setInput(input + emoji)
      }
    useEffect(() => {
        scrollToBottom()
    })
    const recipient = recipientSnapshot?.docs?.[0].data();
    const recipientTag = getRecipientTag(chat.users,user)
  return (
    <div className="chatScreen">
        <div className={`${size.width < 640 ? `absolute w-full` : "sticky"} bg-black z-[100] top-0 flex items-center justify-between py-3 px-3 h-[80px] border-b border-gray-800`}>
            <div className="flex items-center">
                <div>
                {recipientSnapshot && (
                    <img className="w-[50px] h-[50px] object-cover rounded-full" src={recipient?.photoUrl} />
                )}
                </div>
                <div className="ml-4">
                    <h3 className="text-white font-bold">{recipientTag}</h3>
                    {recipientSnapshot ? (
                        <p className="text-gray-500 text-[14px]">
                            Last active: {" "} {recipient?.lastSeen?.toDate() ? (
                                <Moment fromNow>{recipient?.lastSeen?.toDate()}</Moment>
                            ) : "Unavailable"}
                        </p>
                    ) : (
                        <p className="text-gray-500 text-[14px]">Loading Last active ...</p>
                    )}
                    
                </div>
            </div>
            <div>
                <button onClick={() => router.push('/chat')}><XIcon className="h-8 text-white"/></button>
            </div>
        </div>
        <div className="px-8 messages py-8 bg-black min-h-[90vh]">
            <div className="mt-[74px]"></div>
            {showMessages()}
            <div className="pb-2" ref={endOfMessageRef}></div>
        </div>
        {showEmojis && (
                <Picker
                  onSelect={addEmoji}
                  style={{
                    position: 'absolute',
                    bottom:"50px",
                    marginTop: '0px',
                    marginLeft: 5,
                    maxWidth: '320px',
                    borderRadius: '20px',
                  }}
                  theme="dark"
                />
              )}
        <div className="flex bg-black border-t border-gray-800 items-center px-3 py-3 sticky bottom-0 z-[100]">
            {size.width > 640 ? (
              !selectedFile && (
                <button onClick={() => setShowEmojis(!showEmojis)}><EmojiHappyIcon className="h-5 text-white px-3" /></button>
              )
            ) : ""
            }
            {!selectedFile && (
              <input value={input} onChange={e => setInput(e.target.value)} placeholder="Write Something..." className="flex-1 text-white items-center px-2 py-2 sticky bottom-0 border-none rounded-[10px] bg-[#1f1f1f] outline-none" type="text" />
            )}
            <button className="pl-2" onClick={() => filePickerRef.current.click()}>
              <PhotographIcon className="h-5 text-white" />
              <input
                  type="file"
                  hidden
                  onChange={sendPhoto}
                  ref={filePickerRef}
                />
            </button>
            {selectedFile && (<p className="text-[14px] ml-2 text-white">
              Image
            </p>)}
            <button  type="submit" className="px-3" onClick={sendMessage}><PaperAirplaneIcon className="h-5 text-white" /></button>
        </div>
    </div>
  )
}

export default ChatScreen
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