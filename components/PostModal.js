import { useRecoilState } from "recoil";
import {postModalState } from "../atoms/modalAtom";
import { Dialog, Transition } from "@headlessui/react";
import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import {
  EmojiHappyIcon,
  PhotographIcon,
  XIcon,
} from '@heroicons/react/outline'
import { db, storage,auth } from "../firebase";
import {
    addDoc,
    collection,
    doc,
    serverTimestamp,
    updateDoc,
  } from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import React, { useRef, useState,Fragment } from 'react'
import { useAuthState } from "react-firebase-hooks/auth";
function PostModal({userName,userTag,userImage}) {
  const [user] = useAuthState(auth)
    const [isOpen, setIsOpen] = useRecoilState(postModalState)
    const [input, setInput] = useState('')
    const [selectedFile, setSelectedFile] = useState(null)
    const [showEmojis, setShowEmojis] = useState(false)
    const [loading,setLoading] = useState(false)
    const filePickerRef = useRef()
  
  
    const sendPost = async () => {
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
  
      if(selectedFile){
          await uploadString(imageRef,selectedFile,"data_url").then(async () => {
              const downloadURL = await getDownloadURL(imageRef);
              await updateDoc(doc(db,"posts" , docRef.id), {
                  image:downloadURL
              })
          })
      }
  
      setLoading(false)
      setInput("")
      setSelectedFile(null)
      setShowEmojis(false)
      setIsOpen(false)
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
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed sharemodaldi z-50  inset-0 pt-8" onClose={setIsOpen}>
        <div className="flex items-start justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-[#5b7083] bg-opacity-40 transition-opacity" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom overflow-auto  max-h-[400px]   min-h-[300px]  sm:min-h-[400px] bg-black rounded-2xl text-left  shadow-xl transform transition-all sm:my-2 sm:align-middle sm:max-w-xl  w-[100%] sm:w-full">
              <div className="flex items-center px-1.5 py-2 border-b border-gray-700">
                <div
                  className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0"
                  onClick={() => setIsOpen(false)}
                >
                  <XIcon className="h-[22px] text-white" />
                </div>
              </div>
              <div className="flex flex-col px-4 pt-5 pb-2.5 sm:px-6">
                {!loading && (
                    <div
                    className={`flex space-x-3   p-3`}
                    >
                    <img
                        className="h-11 w-11 cursor-pointer rounded-full object-cover"
                        src={userImage}
                    />
                    <div className="w-full divide-y divide-gray-700">
                        <div className={`${selectedFile && "pb-7"} ${input && "space-y-2.5"}`}>
                        <textarea
                            value={input}
                            rows="2"
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="What's happening?"
                            className="text-[#d9d9d9] min-h-[50px] w-full bg-transparent text-lg tracking-wide placeholder-gray-500 outline-none"
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
                                <PhotographIcon className="h-[22px] text-[#c01616]" />
                                <input
                                type="file"
                                hidden
                                onChange={addImageToPost}
                                ref={filePickerRef}
                                />
                            </div>
                            {/* <div className="icon rotate-90">
                                <ChartBarIcon className="h-[22px] text-[#1d9bf0]" />
                            </div> */}
                
                            <div className="icon hover:rotate-12 transition-all" onClick={() => setShowEmojis(!showEmojis)}>
                                <EmojiHappyIcon className="h-[22px] text-[#c01616]" />
                            </div>
                
                            {/* <div className="icon">
                                <CalendarIcon className="h-[22px] text-[#1d9bf0]" />
                            </div> */}
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
                            className="rounded-full bg-[#c01616] px-4 py-1.5 font-bold text-white shadow-md hover:bg-[#c01616] disabled:cursor-default disabled:opacity-50 disabled:hover:bg-[#c01616]"
                            disabled={!input.trim() && !selectedFile}
                            onClick={sendPost}
                            >
                            Post
                            </button>
                        </div>
                        )}
                    </div>
                            </div>
                )}
                {loading && (
                    <h2 className="text-white font-bold mx-auto my-auto text-[30px]">Post Sending...</h2>
                )}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default PostModal