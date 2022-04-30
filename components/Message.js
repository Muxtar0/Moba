import React, { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase'
import moment from 'moment'

function Message({user,message}) {
  const [userLoggenIn] = useAuthState(auth)
  return (
    <div>
      {message.message && (
        <div>
          {user === userLoggenIn.email.split('@')[0] ? (
        <div>
          {
            message.message.includes('https://firebasestorage.googleapis.com') == true ? (
              <img className="max-w-[300px] max-h-[200px] object-cover rounded-[10px] ml-auto"  src={message.message} /> 
            ) : (
              <p className="text-white bg-[#5c0769] w-[fit-content] px-[10px] py-[5px] rounded-[8px] my-[10px] ml-auto min-w-[60px] max-w-[70%] break-words pb-[26px] relative text-left">
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
              <p className="text-white bg-[#161616]   w-[fit-content] px-[10px] py-[5px] rounded-[8px]  my-[10px] mr-auto min-w-[60px] max-w-[70%] break-words pb-[26px] relative text-left">
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