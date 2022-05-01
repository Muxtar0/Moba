import React, { useEffect, useState } from 'react'
import {useRouter} from 'next/router'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { auth, db } from '../../firebase'
import Sidebar from '../../components/Sidebar'
import { useAuthState } from 'react-firebase-hooks/auth'
import { AnnotationIcon } from '@heroicons/react/solid'
import Head from "next/head";
import Widgets from '../../components/Widgets'
function Followers({followersData,userData,allDatas}) {
    const router = useRouter()
    const {id} = router.query
    const followersDataa = JSON.parse(followersData)
    const userDataa = JSON.parse(userData)
    

    const [user] = useAuthState(auth)
  const userDatas = JSON.parse(allDatas);
  const userId = user.uid;
  const [userDataAll,setUserDataAll] = useState()
  const [isLoad,setIsLoad] = useState(false)
    const [followerDataArr , setFollowerDataArr] = useState([])
  const [followersLoaded,setFollowersLoaded] = useState(false)
  useEffect(async() => {
    for(let i = 0 ; i < userDatas.length;i++){
      if(userDatas[i].id == userId){
        setUserDataAll(userDatas[i])
      }
    }
    for(let i = 0 ; i < followersDataa.length;i++){
        const ref = doc(db, "users", followersDataa[i].userId)
        const docSnap = await getDoc(ref);
        setFollowerDataArr(ld => [...ld,docSnap.data()])
    }
    setFollowersLoaded(true)
    setIsLoad(true)
  },[])

  return (
    <div>
        <Head>
        <title>{JSON.parse(userData).name} Followers</title>
        <link rel="icon" href="/Logo.png" />
      </Head>
        {isLoad && (
          <Sidebar photoUrl={userDataAll.photoUrl} tag={userDataAll.tag} userName={userDataAll.name} />
        )}
        <main className='bg-black min-h-screen flex max-w-[1500px] mx-auto'>
        <div className='text-white flex-grow min-h-screen border-l border-r  border-gray-700 max-w-2xl sm:ml-[73px] xl:ml-[200px] 2xl:ml-[450px] 2xl:max-w-[1500px]'>
            <div className='text-[#d9d9d9] flex items-center sm:justify-between py-2 px-3 sticky top-0 z-50 bg-black bg-opacity-90'>
                <h2 className='text-lg sm:text-xl font-bold'>Followers</h2>
                <div onClick={() => router.push('/chat')} className='hoverAnimation h-9 w-9 flex items-center justify-center xl:px-0 ml-auto'>
                    <AnnotationIcon className='h-5 text-white' />
                </div>
            </div>
            {followersLoaded && (
                followerDataArr.map((user) => (
                    <div key={user.id} onClick={() => router.push(`/user/${user.tag}`)} className="flex cursor-pointer items-center group py-4 px-4 border-b  border-gray-700 transition hover:bg-gray-700">
                            <img className='w-[50px] h-[50px] object-cover rounded-full' src={user.photoUrl} />
                            <div className="ml-4">
                                <h3 className="font-bold">{user.name}</h3>
                                <p className="text-gray-700 transition group-hover:text-white text-[14px]">@{user.tag}</p>
                            </div>     
                        </div>
                ))
        )}
            <div className="pb-20"></div>
        </div>
        {isLoad && (
          <Widgets userDatas={userDatas}/>
          )}
        </main>
        
        
    </div>
  )
}

export default Followers
export async function getServerSideProps(context){
    try{
      const ref = collection(db, "users",context.query.id,"followers")
      const refDoc = doc(db, "users",context.query.id)
      const querySnapshot = await getDocs(ref);
      const docSnap = await getDoc(refDoc);
      let data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      const refDatas = collection(db, "users")
        const querySnapshotDatas = await getDocs(refDatas);
        let datas = [];
        querySnapshotDatas.forEach((doc) => {
            datas.push(doc.data());
        });
      return {
        props:{
          followersData : JSON.stringify(data),
          userData:JSON.stringify(docSnap.data()),
          allDatas:JSON.stringify(datas)
        }
      }
    }
    catch (error) {
      return { props: {
        err:JSON.stringify(error)
      } };
    }
  }