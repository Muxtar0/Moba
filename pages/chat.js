import { collection, getDocs } from 'firebase/firestore';
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState } from 'recoil';
import { chatAddUserModalState} from '../atoms/modalAtom';
import ChatAddUserModal from '../components/ChatAddUserModal'
import ChatSidebar from '../components/ChatSidebar'
import { auth, db } from '../firebase';

function Chat({data}) {
  const [user] = useAuthState(auth)
    const userDatas = JSON.parse(data);
    const userId = user.uid;
    const [userData,setUserData] = useState()
    const [isLoad,setIsLoad] = useState(false)
    const [isChatAddUserModalOpen,setIsChatAddUserModalOpen] = useRecoilState(chatAddUserModalState)
    
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
            <title>Chat</title>
            <link rel="icon" href="/Logo.png" />
        </Head>
        <main>
            {isLoad && (
                <ChatSidebar userImage={userData.photoUrl} userDatas={JSON.parse(data)} userName={userData.name} tag={userData.tag}/>
            )}
            {isChatAddUserModalOpen && (
                <ChatAddUserModal userDatas={JSON.parse(data)}/>
            )}
        </main>
    </div>
  )
}

export default Chat
export async function getServerSideProps(context){
  const refUser = collection(db, "users")
  const querySnapshot = await getDocs(refUser);
  let data = [];
  querySnapshot.forEach((doc) => {
    data.push(doc.data());
  });

  return {
      props: {
          data : JSON.stringify(data),
      }
  }
}