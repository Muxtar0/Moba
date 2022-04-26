import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import SidebarLink from './SidebarLink'
import { HomeIcon, XIcon } from "@heroicons/react/solid";
import {
    UserIcon,
    PencilIcon,
    CogIcon,
    AnnotationIcon,
    UsersIcon,
  } from "@heroicons/react/outline";
import LogoImg from '../img/Logo.png'
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { postModalState, userInfoState } from '../atoms/modalAtom';
import { collection, query, where, getDocs,doc,getDoc } from "firebase/firestore";
import {db,auth} from '../firebase'
import {useAuthState} from 'react-firebase-hooks/auth'
import {signOut } from "firebase/auth";
function Sidebar(props) {
  const [user] = useAuthState(auth)
  const [userInfo, setUserInfo] = useState();
  const [windowInnerWidth,setWindowInnerWidth] = useState();
  const [profileModal , setProfileModal] = useState(false)
  const [postModal,setPostModal] = useRecoilState(postModalState)
  const router = useRouter();
  
  const SignOut = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
      console.log("err")
    });
  }
  
  useEffect(()=> {
    window.addEventListener('load', ()=> {
      setWindowInnerWidth(window.innerWidth)
    })
    window.addEventListener('resize', ()=> {
      setWindowInnerWidth(window.innerWidth)
    })
 }, [])
  return (
    <div>
        <div className='bg-black  h-[60px] w-full sm:w-auto  justify-between z-[1000] sm:z-10 bottom-0 left-0  flex flex-row  sm:flex-col items-center xl:items-start xl:w-[200px] 2xl:w-[340px] p-2 fixed sm:h-full'>
          <div className='sm:flex items-center hidden justify-center w-12 h-12 cursor-pointer p-0 xl:ml-[94px] 2xl:ml-24' onClick={() => router.push('/')}>
            <Image
              src={LogoImg}
              alt="Picture of the author"
              width={50}
              height={50}
            />
          </div>
          <div className='flex flex-row sm:flex-col justify-between  w-[60%] sm:w-auto  mt-4 mb-2.5 xl:ml-[92px]'>
              <SidebarLink text="Home" linkway={`/`} Icon={HomeIcon} active  />
              <SidebarLink text="Profile" Icon={UserIcon} linkway={`/user/${props.tag}`} />
              <SidebarLink text="Chat" Icon={AnnotationIcon}  linkway={`/chat`} />
              <SidebarLink text="Users" Icon={UsersIcon} linkway={`/users`} />
              <SidebarLink text="Settings" Icon={CogIcon} linkway={`/editpage/${props.tag}`}/>
          </div>
          <button onClick={() => setPostModal(true)} className='xl:ml-[92px] 2xl:ml-auto bg-[#c01616] text-white rounded-full sm:w-[52px] w-[35px] 2xl:w-56 h-[35px] mt-[5px] sm:mt-0  sm:h-[52px] font-bold shadow-md hover:bg-[#e41e1e]'>{windowInnerWidth  > 1536 ? "Tweet" : (<PencilIcon className=' h-5 sm:h-7 mx-auto'/>)}</button>
          <div  className='text-[#d9d9d9]   flex items-center relative  justify-center  xl:ml-[93px] 2xl:ml-auto 2xl:w-[250px] 2xl:-mr-5 mt-auto'>
              {profileModal && (
                <div className='absolute space-y-2 top-[-155px] sm:left-0 right-2 w-[300px] rounded-lg sidebarModalBoxShadow shadow-[0_0px_5px_5px_rgba(51,51,51,1)] bg-black   py-3'>
                <div className='border-b border-gray-700 pb-2'>
                  <div className='flex items-center w-full px-4 justify-between'>
                    <img   className="h-14 object-cover w-14 rounded-full mr-3" src={props.photoUrl} />
                    <div className='flex items-center justify-between w-full'>
                      <div>
                        <h4 className='font-bold text-[15px] sm:text-base text-[#d9d9d9] '>{props.userName.length < 17 ? props.userName : props.userName.substring(0,17) + "..."}</h4>
                        <span className='text-sm sm:text-[15px] text-[#6e767d]'>@{props.tag.length < 18 ? props.tag : props.tag.substring(0,17) + "..."}</span>
                      </div>
                      <XIcon onClick={() => setProfileModal(false)} className='h-12 w-12 text-white hoverAnimation px-2 py-2' />
                    </div>
                  </div>
                </div>
                <div>
                  <button onClick={SignOut} className='py-3 w-full text-left px-4 hover:bg-[#d9d9d9] hover:bg-opacity-10'>Sign Out @{props.tag.length < 21 ? props.tag : props.tag.substring(0,20) + "..."}</button>
                </div>
              </div>
              )}
              <div onClick={() => setProfileModal(true)} className='text-[#d9d9d9] flex items-center relative  justify-center hoverAnimation mt-auto w-full'>
                <img className='h-10 w-10  mb-[15px] sm:mb-0 rounded-full 2xl:mr-2.5 object-cover' src={props.photoUrl}  />
                <div className='hidden 2xl:inline leading-5'>
                    <h4 className='font-bold'>{props.userName.length < 17 ? props.userName : props.userName.substring(0,17) + "..."}</h4>
                    <p className='text-[#6e767d]'>{props.tag}</p>
                </div>
              </div>
          </div>
      </div>
    </div>
  )
}

export default Sidebar

