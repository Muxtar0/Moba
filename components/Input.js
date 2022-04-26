import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import {
  CalendarIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  PhotographIcon,
  XIcon,
} from '@heroicons/react/outline'
import { auth, db, storage } from "../firebase";
import {
    addDoc,
    collection,
    doc,
    serverTimestamp,
    updateDoc,
  } from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import React, { useRef, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';

function Input({userImage,userName,userTag}) {
  const [user] = useAuthState(auth);

  const [input, setInput] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [showEmojis, setShowEmojis] = useState(false)
  const [loading,setLoading] = useState(false)
  const [linkTextColor,setLinkTextColor] = useState(false)
  const filePickerRef = useRef()
  const router = useRouter()

  const sendPost = async () => {
    if(selectedFile){
      if(selectedFile.split("/")[0] == "data:video"){
        alert("You can't upload video")
        setSelectedFile(null)
        setShowEmojis(false)
      }
        else{
          if(loading) return;
        setLoading(true)
  
        const docRef = await addDoc(collection(db,'posts') , {
            id:user.uid,
            username:userName,
            userImg:userImage,
            tag:userTag,
            text:input,
            timestamp:serverTimestamp(),
        })
        const imageRef = ref(storage , `posts/${docRef.id}/image`)
  
        await uploadString(imageRef,selectedFile,"data_url").then(async () => {
          const downloadURL = await getDownloadURL(imageRef);
          await updateDoc(doc(db,"posts" , docRef.id), {
              image:downloadURL
          })
      })
        setLoading(false)
        setInput("")
        setSelectedFile(null)
        setShowEmojis(false)
      }
    }else{
      if(loading) return;
        setLoading(true)
  
        const docRef = await addDoc(collection(db,'posts') , {
            id:user.uid,
            username:userName,
            userImg:userImage,
            tag:userTag,
            text:input,
            timestamp:serverTimestamp(),
        })
        setLoading(false)
        setInput("")
        setSelectedFile(null)
        setShowEmojis(false)
    }
    

    
  }
  const addImageToPost = (e) => {
      const reader = new FileReader()
      
      if(e.target.files[0]){
          reader.readAsDataURL(e.target.files[0]);
      }

      reader.onload = (readerEvent) => {
          setSelectedFile(readerEvent.target.result)
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
  return (
    <div
      className={`flex space-x-3  border-b border-gray-700 p-3 ${loading && "opacity-60"}`}
    >
      <img
        className="h-11 w-11 cursor-pointer rounded-full object-cover"
        src={userImage}
        onClick={() => router.push(`/user/${userTag}`)}
      />
      <div className="w-full divide-y divide-gray-700">
        <div className={`${selectedFile && "pb-7"} ${input && "space-y-2.5"}`}>
          <textarea
            value={input}
            rows="2"
            onChange={(e) => {
              setInput(e.target.value);
              if(e.target.value.includes("http") == true){
                setLinkTextColor(true)
              }
              else{
                setLinkTextColor(false)
              }
            }}
            placeholder="What's happening?"
            className={`text-[#d9d9d9] ${linkTextColor && "text-[#c01616]"} min-h-[50px] w-full bg-transparent text-lg tracking-wide placeholder-gray-500 outline-none`}
          />
          {selectedFile && (
            <div className="relative">
              <div
                onClick={() => setSelectedFile(null)}
                className="absolute top-1 left-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#15181c] bg-opacity-75 hover:bg-[#272c26]"
              >
                <XIcon className="h-5 text-white" />
              </div>
              <img
                src={selectedFile}
                className="max-h-80 rounded-2xl object-contain"
              />
            </div>
          )}
        </div>
        {!loading && (
            <div className="flex items-center justify-between pt-2.5">
            <div className="flex items-center">
              <div className="icon hover:rotate-12 transition-all" onClick={() => filePickerRef.current.click()}>
                <PhotographIcon className="h-[22px] text-[#c34141]" />
                <input
                  type="file"
                  hidden
                  onChange={addImageToPost}
                  ref={filePickerRef}
                />
              </div>
              
  
              <div className="icon hover:rotate-12 transition-all" onClick={() => setShowEmojis(!showEmojis)}>
                <EmojiHappyIcon className="h-[22px] text-[#c34141]" />
              </div>
  
              
              {showEmojis && (
                <Picker
                  onSelect={addEmoji}
                  style={{
                    position: 'absolute',
                    marginTop: '465px',
                    marginLeft: -40,
                    maxWidth: '320px',
                    borderRadius: '20px',
                  }}
                  theme="dark"
                />
              )}
            </div>
            <button
              className="rounded-full bg-[#c01616] px-4 py-1.5 font-bold text-white shadow-md hover:bg-[#e12525] disabled:cursor-default disabled:opacity-50 disabled:hover:bg-[#c01616]"
              disabled={!input.trim() && !selectedFile}
              onClick={sendPost}
            >
              Moba
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Input
