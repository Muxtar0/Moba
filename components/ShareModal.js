import { useRecoilState, useResetRecoilState } from "recoil";
import {ClipBoardSuccesfullState, postIdState, shareModalState } from "../atoms/modalAtom";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { XIcon , LinkIcon } from "@heroicons/react/solid";
import {
  FacebookShareButton,
  FacebookIcon,
  PinterestShareButton,
  PinterestIcon,
  RedditShareButton,
  RedditIcon,
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
} from 'next-share';


function ShareModal({postID}) {
  const [isOpen, setIsOpen] = useRecoilState(shareModalState);
  const [isClipBoardOpen,setIsClipBoardOpen] = useRecoilState(ClipBoardSuccesfullState)
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed sharemodaldi z-50 inset-0 pt-8" onClose={setIsOpen}>
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
            <div className="inline-block align-bottom bg-black rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl w-[100%] sm:w-full">
              <div className="flex items-center px-1.5 py-2 border-b border-gray-700">
                <div
                  className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0"
                  onClick={() => setIsOpen(false)}
                >
                  <XIcon className="h-[22px] text-white" />
                </div>
              </div>
              <div className="flex flex-col px-4 pt-5 pb-2.5 sm:px-6">
                <div className="w-full">
                  <h2 className="text-white font-bold text-[18px]">Share this post</h2>
                </div>
                <div className="w-full space-y-1 mt-3">
                  <div className="w-full">
                  <p className="text-white text-[14px]">Copy post link : </p>
                    <button onClick={() => {navigator.clipboard.writeText(`http://localhost:3000/${postID}`); setIsOpen(false); setIsClipBoardOpen(true)}} className="bg-white border-none outline-none hover:bg-transparent hover:text-white transition-all mt-2 w-8 h-8 rounded-full flex items-center justify-center"><LinkIcon className="h-4" /></button>
                  </div>
                  <div className="mt-2">
                  <p className="text-white text-[14px]">Or width : </p>
                  <div className="w-full py-2 flex justify-start items-center space-x-2">
                  <FacebookShareButton onClick={() => {setIsOpen(false)}}
                    url={`http://localhost:3000/${postID}`} >
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                  <WhatsappShareButton onClick={() => {setIsOpen(false)}}
                    url={`http://localhost:3000/${postID}`} >
                    <WhatsappIcon size={32} round />
                  </WhatsappShareButton>
                  <LinkedinShareButton onClick={() => {setIsOpen(false)}}
                    url={`http://localhost:3000/${postID}`} >
                    <LinkedinIcon size={32} round />
                  </LinkedinShareButton>
                  <RedditShareButton onClick={() => {setIsOpen(false)}}
                    url={`http://localhost:3000/${postID}`} >
                    <RedditIcon size={32} round />
                  </RedditShareButton>
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

export default ShareModal;