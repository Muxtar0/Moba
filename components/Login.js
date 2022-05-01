import Image from "next/image";
import { auth, provider,db } from "../firebase";
import LogoImg from '../img/Logo.png'
import {signInWithPopup } from "firebase/auth";

import { useEffect } from "react";
function Login() {
  // const [userINF , setUserINF] = useRecoilState(userInfoState)
  const getUserInfos = async () => {
    const q = query(collection(db, "users"), where("id", "==", user.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // setUserINF(doc.data())
    });
  }
  const signIn = () => {
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      getUserInfos();
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      // const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
  }

  return (
    <div className="flex flex-col items-center space-y-16 pt-12">

      <Image
        src={LogoImg}
        width={350}
        height={350}
        objectFit="contain"
      />

      <div >
        <div>
            <button
              className="relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group"
              onClick={signIn}
            >
              <span className="w-48 h-48 rounded rotate-[-40deg] bg-[#c01616] absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
              <span className="relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">
                Sign in with Google
              </span>
            </button>
          </div>
      </div>
      <p className="text-white text-[15px]">This Project Created by <span className="font-bold">Muxtar Akberov</span></p>
    </div>
  );
}

export default Login;