import { useRecoilState } from "recoil";
import { modalState, postIdState } from "../atoms/modalAtom";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import {
  onSnapshot,
  doc,
  addDoc,
  collection,
  serverTimestamp,
} from "@firebase/firestore";
import { auth, db } from "../firebase";
import {
  CalendarIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  PhotographIcon,
  XIcon,
} from "@heroicons/react/outline";
import { useRouter } from "next/router";
import Moment from "react-moment";
import parse from 'html-react-parser';
import { useAuthState } from "react-firebase-hooks/auth";

function Modal({userImage,userName,userTag}) {
  const [user] = useAuthState(auth)
  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [post, setPost] = useState();
  const [showEmojis, setShowEmojis] = useState(false)
  const [comment, setComment] = useState("");
  const router = useRouter();
  const [isLinkHave , setIsLinkHave] = useState(false)
  const [linkText , setLinkText] = useState("")
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

  useEffect(
    () =>
      onSnapshot(doc(db, "posts", postId), (snapshot) => {
        URLReplacer(snapshot.data().text)
        setPost(snapshot.data())
      })
      ,
    [db]
  );

  const sendComment = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "posts", postId, "comments"), {
      comment: comment,
      username: userName,
      id: user.uid,
      tag: userTag,
      userImg: userImage,
      timestamp: serverTimestamp(),
    });

    setIsOpen(false);
    setComment("");

    router.push(`/post/${postId}`);
  };
  const addEmoji = (e) => {
    let sym = e.unified.split('-')
    let codesArray = []
    sym.forEach((el) => {
      codesArray.push('0x' + el)
    })
    let emoji = String.fromCodePoint(...codesArray)
    setComment(comment + emoji)
  }
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed    z-50 inset-0 pt-8" onClose={setIsOpen}>
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
            <div className="inline-block overflow-auto align-bottom bg-black rounded-2xl text-left max-h-[400px]  shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
              <div className="flex items-center px-1.5 py-2 border-b border-gray-700">
                <div
                  className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0"
                  onClick={() => setIsOpen(false)}
                >
                  <XIcon className="h-[22px] text-white" />
                </div>
              </div>
              <div className="flex px-4 pt-5 pb-2.5 sm:px-6">
                <div className="w-full">
                  <div className="text-[#6e767d] flex gap-x-3 relative">
                    <span className="w-0.5 h-full z-[-1] absolute left-5 top-11 bg-gray-600" />
                    <img
                      src={post?.userImg}
                      alt=""
                      className="h-11 w-11 rounded-full object-cover"
                    />
                    <div>
                      <div className="inline-block group">
                        <h4 className="font-bold text-[#d9d9d9] inline-block text-[15px] sm:text-base">
                          {post?.username}
                        </h4>
                        <span className="ml-1.5 text-sm sm:text-[15px]">
                          @{post?.tag}{" "}
                        </span>
                      </div>{" "}
                      ·{" "}
                      <span className="hover:underline text-sm sm:text-[15px]">
                        <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
                      </span>
                      {
                        isLinkHave == true ? (
                          <div className='text-[#d9d9d9] text-[15px] sm:text-base '>{parse(linkText)}</div>
                        ) : <p className='text-[#d9d9d9] text-[15px] sm:text-base '>{post?.text}</p>
                      }
                      
                    </div>
                  </div>

                  <div className="mt-7 flex space-x-3 w-full">
                    <img
                      src={userImage}
                      alt=""
                      className="h-11 w-11 rounded-full object-cover"
                    />
                    <div className="flex-grow mt-2">
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Tweet your reply"
                        rows="2"
                        className="bg-transparent outline-none text-[#d9d9d9] text-lg placeholder-gray-500 tracking-wide w-full min-h-[80px]"
                      />

                      <div className="flex items-center justify-between pt-2.5">
                        <div className="flex items-center">
                          {/* <div className="icon">
                            <PhotographIcon className="text-[#c01616] h-[22px]" />
                          </div> */}

                          {/* <div className="icon rotate-90">
                            <ChartBarIcon className="text-[#1d9bf0] h-[22px]" />
                          </div> */}

                            <div className="icon hover:rotate-12 transition-all" onClick={() => setShowEmojis(!showEmojis)}>
                                <EmojiHappyIcon className="h-[22px] text-[#c01616]" />
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
                          {/* <div className="icon">
                            <CalendarIcon className="text-[#1d9bf0] h-[22px]" />
                          </div> */}
                        </div>
                        <button
                          className="bg-[#c01616] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#c01616] disabled:hover:bg-[#c01616] disabled:opacity-50 disabled:cursor-default"
                          type="submit"
                          onClick={sendComment}
                          disabled={!comment.trim()}
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default Modal;