import React, { useEffect, useState } from 'react'
import Head from "next/head";
import { useRouter } from "next/router";
import {
    collection,
     getDocs,
  } from "@firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebase';
import Sidebar from '../../components/Sidebar';
import MobaUserCom from '../../components/MobaUserCom'
import { modalState, postModalState, shareModalState, sharePostIDstate } from '../../atoms/modalAtom';
import { useRecoilState } from 'recoil';
import PostModal from '../../components/PostModal';
import Modal from '../../components/Modal';
import ShareModal from '../../components/ShareModal';
import Widgets from '../../components/Widgets';
function UserPage(props) {
    const router = useRouter()
    const {user} = router.query
    const [userAuth] = useAuthState(auth)
    const userDatas = JSON.parse(props.data);
    const userId = userAuth.uid;
    const [userData,setUserData] = useState()
    const [mobaUserData,setMobaUserData] = useState()
    const [isLoad,setIsLoad] = useState(false)
    const [isPostModalOpen , setIsPostModalOpen] = useRecoilState(postModalState)
    const [isCommentModalOpen , setIsCommentModalOpen] = useRecoilState(modalState)
    const [isShareOpen , setIsShareOpen] = useRecoilState(shareModalState)
    const [sharePostID , setSharePostID] = useRecoilState(sharePostIDstate)
    useEffect(() => {
        for(let i = 0 ; i < userDatas.length;i++){
            if(userDatas[i].id == userId){
              setUserData(userDatas[i])
            }
        }
        for(let i = 0 ; i < userDatas.length;i++){
          if(userDatas[i].tag == user){
            setMobaUserData(userDatas[i])
          }
        }
        setIsLoad(true)
      },[])
  return (
    <div>
        <Head>
        <title>Moba User | {user}</title>
        <link rel="icon" href="/Logo.png" />
      </Head>
      <main className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
      {isLoad && (
          <Sidebar photoUrl={userData.photoUrl} tag={userData.tag} userName={userData.name} />
        )}
          {isLoad && (
              <MobaUserCom userName={mobaUserData.name} userTag={mobaUserData.tag} userImage={mobaUserData.photoUrl} creationTime={mobaUserData.creationTime}  userID={mobaUserData.id} bio={mobaUserData.bio} website={mobaUserData.website}/>
          )}
        {isPostModalOpen && <PostModal userImage={userData.photoUrl} userName={userData.name} userTag={userData.tag}/>}
        {isCommentModalOpen && (
          <Modal userImage={userData.photoUrl} userName={userData.name} userTag={userData.tag}/>
        )}
        {isLoad && (
          <Widgets userDatas={userDatas}/>
        )}
        {isShareOpen && <ShareModal postID = {sharePostID} />}
      </main>
    </div>
  )
}

export default UserPage
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