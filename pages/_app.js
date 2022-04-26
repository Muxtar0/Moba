import '../styles/globals.css'
import {useAuthState} from 'react-firebase-hooks/auth'
import {auth, db, storage} from '../firebase'
import Login from '../components/Login'
import { RecoilRoot} from 'recoil'
import { useEffect } from 'react'
import { getDownloadURL, ref, uploadString,deleteObject   } from "@firebase/storage";
import {
  doc,
  serverTimestamp,
  setDoc,getDoc 
} from "@firebase/firestore";
import Loading from '../components/Loading'

export default function App({ Component , pageProps }) {
  const [user, loading] = useAuthState(auth)


  useEffect( async () => {
    if(user){
      const docRef = doc(db, "users",user.uid);
      const docSnap = await getDoc(docRef);
      if(docSnap.exists()){
        
      }
      else{
        const userTag = user.email.split("@");
        const cityRef = doc(db, 'users',user.uid);
        const imageRef = ref(storage , `users/${user.uid}/ProfilePhoto`)
        uploadString(imageRef, "profile").then((snapshot) => {
        });
        setDoc(cityRef, { 
          id:user.uid,
          email: user.email,
          photoUrl: user.photoURL,
          name:user.displayName,
          tag:userTag[0],
          bio:"",
          website:"",
          creationTime:user.metadata.creationTime,
          lastSeen:serverTimestamp(),
        }, { merge: true });
      }
    }
  },[user])
  if(loading) return <Loading/> ;
  if(!user) return <Login/>

  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  )
}
