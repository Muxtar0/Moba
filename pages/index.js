import Head from "next/head";
import Sidebar from '../components/Sidebar'
import Feed from '../components/Feed'
import Login from '../components/Login'
import Modal from '../components/Modal'
import PostModal from '../components/PostModal'
import ClipBoardSuccesfull from '../components/ClipBoardSuccesfull'
import ShareModal from '../components/ShareModal'
import { modalState, postIdState, shareModalState, postModalState, sharePostIDstate, userInfoState } from "../atoms/modalAtom";
import { RecoilRoot , useRecoilState} from 'recoil'
import Widgets from '../components/Widgets'
import { db, storage } from "../firebase";

import { useEffect, useState } from "react";
import LogoIMG from '../img/Logo.png'
import {signOut } from "firebase/auth";
import { auth, provider } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
  query, where, getDocs,onSnapshot,orderBy,getDoc,getColl
} from "@firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
const Home = (props) => {
  const [user] = useAuthState(auth)
  const userDatas = JSON.parse(props.data);
  const userId = user.uid;
  const [userData,setUserData] = useState()
  const [isLoad,setIsLoad] = useState(false)
  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const [isPostModalOpen, setPostModalOpen] = useRecoilState(postModalState);
  const [isShareOpen,setIsShareOpen] = useRecoilState(shareModalState) 
  const [sharePostID , setSharePostID] = useRecoilState(sharePostIDstate)
  const [postID,setPostID] = useRecoilState(postIdState)

  useEffect(() => {
    for(let i = 0 ; i < userDatas.length;i++){
      if(userDatas[i].id == userId){
        setUserData(userDatas[i])
      }
    }
    setIsLoad(true)
  },[])

  return (
    <div>
      <Head>
        <title>Moba</title>
        <link rel="icon" href="/Logo.png" />
      </Head>
      <main className='bg-black min-h-screen flex max-w-[1500px] mx-auto'>
        {isLoad && (
          <Sidebar photoUrl={userData.photoUrl} tag={userData.tag} userName={userData.name} />
        )}
        {isLoad && (
          <Feed userImage={userData.photoUrl} userName={userData.name} userTag={userData.tag} />
        )}
        {isLoad && (
          <Widgets userDatas={userDatas}/>
        )}
        {isOpen && <Modal userImage={userData.photoUrl} userName={userData.name} userTag={userData.tag}/>}
        {isPostModalOpen && <PostModal userImage={userData.photoUrl} userName={userData.name} userTag={userData.tag}/>}
        {isShareOpen && <ShareModal postID = {sharePostID} />}
      </main>
    </div>
  )
}

export default Home
export async function getServerSideProps(context){
  try{
    const ref = collection(db, "users")
    const querySnapshot = await getDocs(ref);
    let data = [];
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
    return {
      props:{
        data : JSON.stringify(data)
      }
    }
  }
  catch (error) {
    return { props: {
      err:JSON.stringify(error)
    } };
  }
}
