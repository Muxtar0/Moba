import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase'
import moment from 'moment'
import {XIcon} from "@heroicons/react/outline";
function Message({user,message}) {
  const [userLoggenIn] = useAuthState(auth)
  const [imageModal,setImageModal] = useState(false)
  const [modalImgUrl,setModalImgUrl] = useState()
  return (
    <div>
      {imageModal && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-red-500 bg-opacity-80 z-[1000]">
          <button onClick={() => setImageModal(false)} className="absolute top-[10px] right-[10px]"><XIcon className="h-10 text-white" /></button>
          <img src={modalImgUrl} className="absolute object-contain top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-w-[78%] max-h-[78%]  sm:max-w-[85%] sm:max-h-[85%] rounded-[10px]" />
        </div>
      )}
      {message.message && (
        <div>
          {user === userLoggenIn.email.split('@')[0] ? (
        <div>
          {
            message.message.includes('https://firebasestorage.googleapis.com') == true ? (
              <img onClick={() => {
                setModalImgUrl(message.message)
                setImageModal(true)
              }} className="max-w-[300px] max-h-[200px] object-cover rounded-[10px] ml-auto"  src={message.message} /> 
            ) : (
              <p className="text-white bg-[#5c0769] w-[fit-content] px-[10px] py-[5px] rounded-[10px] my-[10px] ml-auto min-w-[60px] max-w-[70%] break-words pb-[26px] relative text-left">
                {message.message}
                <span className="text-[#ababab] px-[10px] py-[10px] text-[9px] absolute bottom-0 text-right right-0">{message.timeStamp ? moment(message.timeStamp).format('LT') : '...'}</span>
              </p>
            )
          }
        </div>
      ):(
        <div>
          {
            message.message.includes('https://firebasestorage.googleapis.com') == true ? (
              <img className="max-w-[300px] max-h-[200px] object-cover rounded-[10px] mr-auto"  src={message.message} />
            ) : (
              <p className="text-white bg-[#161616]   w-[fit-content] px-[10px] py-[5px] rounded-[10px]  my-[10px] mr-auto min-w-[60px] max-w-[70%] break-words pb-[26px] relative text-left">
              {message.message}
              <span className="text-[#ababab] px-[10px] py-[10px] text-[9px] absolute bottom-0 text-right right-0">{message.timeStamp ? moment(message.timeStamp).format('LT') : '...'}</span>
            </p>
            )
          }
        </div>
      )}
        </div>
      )}
      
    </div>
  )
}

export default Message