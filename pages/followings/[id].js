import React, { useEffect, useState } from 'react'
import {useRouter} from 'next/router'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { auth, db } from '../../firebase'
import Sidebar from '../../components/Sidebar'
import { useAuthState } from 'react-firebase-hooks/auth'
import { AnnotationIcon } from '@heroicons/react/solid'
import Head from "next/head";

function Followings({followingsData,userData,allDatas}) {
    const router = useRouter()
    const {id} = router.query
    const followingsDataa = JSON.parse(followingsData)
    const userDataa = JSON.parse(userData)
    

    const [user] = useAuthState(auth)
  const userDatas = JSON.parse(allDatas);
  const userId = user.uid;
  const [userDataAll,setUserDataAll] = useState()
  const [isLoad,setIsLoad] = useState(false)
    const [followingsDataArr , setFollowingsDataArr] = useState([])
  const [followingsLoaded,setFollowingsLoaded] = useState(false)
  useEffect(async() => {
    for(let i = 0 ; i < userDatas.length;i++){
      if(userDatas[i].id == userId){
        setUserDataAll(userDatas[i])
      }
    }
    for(let i = 0 ; i < followingsDataa.length;i++){
        const ref = doc(db, "users", followingsDataa[i].userId)
        const docSnap = await getDoc(ref);
        setFollowingsDataArr(ld => [...ld,docSnap.data()])
    }
    setFollowingsLoaded(true)
    setIsLoad(true)
  },[])

  return (
    <div>
         <Head>
        <title>{JSON.parse(userData).name} Followings</title>
        <link rel="icon" href="/Logo.png" />
      </Head>
        {isLoad && (
          <Sidebar photoUrl={userDataAll.photoUrl} tag={userDataAll.tag} userName={userDataAll.name} />
        )}
        <div className='text-white flex-grow min-h-screen border-l border-r  border-gray-700 max-w-2xl sm:ml-[73px] xl:ml-[200px] 2xl:ml-[450px] 2xl:max-w-[1500px]'>
            <div className='text-[#d9d9d9] flex items-center sm:justify-between py-2 px-3 sticky top-0 z-50 bg-black bg-opacity-90'>
                <h2 className='text-lg sm:text-xl font-bold'>Home</h2>
                <div onClick={() => router.push('/chat')} className='hoverAnimation h-9 w-9 flex items-center justify-center xl:px-0 ml-auto'>
                    <AnnotationIcon className='h-5 text-white' />
                </div>
            </div>
            {followingsLoaded && (
                followingsDataArr.map((user) => (
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
        
    </div>
  )
}

export default Followings
export async function getServerSideProps(context){
    try{
      const ref = collection(db, "users",context.query.id,"following")
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
          followingsData : JSON.stringify(data),
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