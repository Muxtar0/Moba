import { collection, getDocs } from 'firebase/firestore';
import Head from "next/head";
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import Sidebar from '../components/Sidebar';
import UsersUser from '../components/UsersUser';
import { auth, db } from '../firebase';

function Users({data}) {
    const [user] = useAuthState(auth)
  const userDatas = JSON.parse(data);
  const userId = user.uid;
  const [userData,setUserData] = useState()
  const [isLoad,setIsLoad] = useState(false)

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
            <title>Moba | Users</title>
            <link rel="icon" href="/Logo.png" />
        </Head>
        <main>
        {isLoad && (
          <Sidebar photoUrl={userData.photoUrl} tag={userData.tag} userName={userData.name} />
        )}
        <UsersUser Datas={JSON.parse(data)} />
        </main>
    </div>
  )
}

export default Users
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