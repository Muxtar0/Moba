import { collection, doc, orderBy, query ,getDocs,getDoc} from 'firebase/firestore'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import ChatScreen from '../../components/ChatScreen'
import ChatSidebar from '../../components/ChatSidebar'
import { auth, db } from '../../firebase'
import getRecipientTag from '../../utils/getRecipientTag'
import ChatAddUserModal from '../../components/ChatAddUserModal'
import { useRecoilState } from 'recoil'
import { chatAddUserModalState } from '../../atoms/modalAtom'
function Chating({chat,messages,data}) {
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
            <title>Chat width {getRecipientTag(chat.users,user)}</title>
            <link rel="icon" href="/Logo.png" />
        </Head>
        <main className="flex items-start justify-start overflow-hidden">
            {isLoad && (
                <ChatSidebar chatScreen userImage={userData.photoUrl} userName={userData.name} tag={userData.tag}/>
            )}
            <div className="flex-1 overflow-scroll h-screen scrollbarHidden">
                <ChatScreen chat={chat} messages={messages}/>
            </div>
            {isChatAddUserModalOpen && (
                <ChatAddUserModal userDatas={JSON.parse(data)}/>
            )}
        </main>
    </div>
  )
}

export default Chating

export async function getServerSideProps(context){
    const messagesRef = query(collection(db,"chats",context.query.id,"messages"),orderBy("timeStamp","asc"))
    const messagesRes = await getDocs(messagesRef);
    const messages = messagesRes.docs.map(doc => ({
        id:doc.id,
        ...doc.data(),
    })).map(messages => ({
        ...messages,
        timestamp:messages.timeStamp.toDate().getTime()
    }))
    const ref = doc(db, "chats", context.query.id);
    const chatRes = await getDoc(ref);
    const chat = {
        id:chatRes.id,
        ...chatRes.data()
    }
    const refUser = collection(db, "users")
    const querySnapshot = await getDocs(refUser);
    let data = [];
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });

    return {
        props: {
            data : JSON.stringify(data),
            messages:JSON.stringify(messages),
            chat:chat,
        }
    }
}