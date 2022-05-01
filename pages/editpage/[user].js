import React, { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db ,storage} from '../../firebase';
import Sidebar from '../../components/Sidebar'
import { useRouter } from "next/router";
import { PlusIcon } from '@heroicons/react/outline';
import {
    collection,
    getDocs,
    updateDoc,
    doc,
    query,where,
  } from "@firebase/firestore";
import { getDownloadURL, ref, uploadString,deleteObject   } from "@firebase/storage";
import PostModal from '../../components/PostModal';
import { postModalState } from '../../atoms/modalAtom';
import { useRecoilState } from 'recoil';
function EditUser({data}) {
  const [user] = useAuthState(auth)
  const userDatas = JSON.parse(data);
  const userId = user.uid;
  const [userData,setUserData] = useState()
  const [isLoad,setIsLoad] = useState(false)

  const [isPostModalOpen,setIsPostModalOpen] = useRecoilState(postModalState)

  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState(null)
  const profilePhotoRef = useRef()
  const [userNameLenght,setUserNameLenght] = useState(0)
  const [userNameInp,setUserNameInp] = useState("")
  const [bioLenght,setBioLenght] = useState(0)
  const [bioInp,setBioInp] = useState("")
  const [websiteInp,setWebsiteInp] = useState("")
  const [saving,setSaving] = useState(false)
    let postIdS = []
    let allPostsIdS =[]
    let commentsIdS = []

  useEffect(() => {
    for(let i = 0 ; i < userDatas.length;i++){
      if(userDatas[i].id == userId){
        setUserData(userDatas[i])
      }
    }
    setIsLoad(true)
  },[])
  useEffect(() => {
    if(isLoad == true){
        setUserNameLenght(userData.name.length)
        setBioLenght(userData.bio.length)
        setBioInp(userData.bio)
        setUserNameInp(userData.name)
        setWebsiteInp(userData.website)
    }
  },[isLoad])
  const userNameInputHandler = (e) => {
      setUserNameLenght(e.target.value.length)
      setUserNameInp(e.target.value)
  }
  const bioInputHandler = (e) => {
    setBioLenght(e.target.value.length)
    setBioInp(e.target.value)
  }
  const websiteInputHandler = (e) => {
    setWebsiteInp(e.target.value)
  }
  const updateProfilePhoto = (e) => {
    const reader = new FileReader()
    if(e.target.files[0] && e.target.files[0]['type'].split('/')[0] === 'image'){
        if(e.target.files[0]){
            reader.readAsDataURL(e.target.files[0]);
        }
  
        reader.onload = (readerEvent) => {
            setSelectedFile(readerEvent.target.result)
        }
      }
      else{
        alert("This is a video. Please select just an image")
      }
    }
  const saveChangeshandler = async () => {
      if(userNameInp == null || userNameInp == "" || userNameInp == " " || !userNameInp.trim()){
        alert("Name can't empty")
      }
      else{
        setSaving(true)
        const userRef = doc(db, "users", user.uid);
        updateDoc(userRef, {
            name: userNameInp,
            bio:bioInp,
            website:websiteInp,
        });
        const q = query(collection(db, "posts"), where("id", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const querySnapshot2 = await getDocs(collection(db, "posts"));
        let querySnapshot3;
        
        querySnapshot.forEach((doc) => {
            postIdS.push(doc.id)
        });  
        querySnapshot2.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          allPostsIdS.push(doc.id)
        });              
        for(let i = 0 ; i < postIdS.length;i++ ){
            updateDoc(doc(db,"posts",postIdS[i]),{
                username:userNameInp
            });
        } 
        for(let i = 0 ; i < allPostsIdS.length;i++ ){
          querySnapshot3 = await getDocs(collection(db, "posts",allPostsIdS[i],"comments"));
          querySnapshot3.forEach((doc) => {
            if(doc.data().id == user.uid){
              commentsIdS.push({
                postID:allPostsIdS[i],
                commentID:doc.id
              })
            }
          });
        }
        
        for(let i = 0 ; i < commentsIdS.length;i++){
          updateDoc(doc(db,"posts",commentsIdS[i].postID,"comments",commentsIdS[i].commentID),{
            username:userNameInp,
          })
        }                 
        if(selectedFile){
            const imageRef = ref(storage , `users/${user.uid}/ProfilePhoto`)
            deleteObject(imageRef).then(() => {
                uploadString(imageRef, selectedFile,"data_url").then((snapshot) => {
                    getDownloadURL(imageRef)
                    .then(async (url) => {    
                        console.log(url)
                        updateDoc(userRef, {
                            photoUrl:url
                        })
                        
                        for(let i = 0 ; i < postIdS.length;i++ ){
                            updateDoc(doc(db,"posts",postIdS[i]),{
                                userImg:url
                            });
                        }
                        for(let i = 0 ; i < commentsIdS.length;i++){
                          updateDoc(doc(db,"posts",commentsIdS[i].postID,"comments",commentsIdS[i].commentID),{
                            username:userNameInp,
                            userImg:url
                          })
                        } 
  
                    })
                    .catch((error) => {
                        console.log(error)
                    });
                });
              }).catch((error) => {
                // Uh-oh, an error occurred!
              });
            
            
            
            
        }
        setSaving(false)
        
        
      }
  }
  return (
    <div>
        <Head>
        <title>Moba Edit User</title>
        <link rel="icon" href="/Logo.png" />
      </Head>
      <main className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
        {saving && (
          <div className="fixed top-[50%] w-screen h-screen flex items-center justify-center flex-col left-[50%] translate-x-[-50%] translate-y-[-50%] z-[1000]">
          <div className="absolute top-0 left-0 z-[-1] w-full h-full bg-black"></div>
          {saving == true ? (
            <h1 className="text-white z-[1000] text-[40px]">Changes saving...</h1>

          ):(<h1 className="text-white z-[1000] text-[40px]">Saved</h1>)}
          
        </div>
        )}
        {isLoad && (
          <Sidebar photoUrl={userData.photoUrl} tag={userData.tag} userName={userData.name} />
        )}
        {isLoad && (
            <div className='text-white flex-grow border-l border-r  border-gray-700 max-w-2xl sm:ml-[73px] xl:ml-[200px] 2xl:ml-[370px]'>
                <div className="flex items-center pb-16 justify-center flex-col mt-10">
                    <input
                        type="file"
                        hidden
                        onChange={updateProfilePhoto}
                        ref={profilePhotoRef}
                    />    
                    <div onClick={() => profilePhotoRef.current.click()}>
                        <button className="rounded-full EditProfileImg relative overflow-hidden w-[100px] h-[100px]">
                            <img className="w-full h-full object-cover" src={userData.photoUrl} />
                            <PlusIcon className="text-white h-5 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"/>
                        </button>
                    </div>
                    <div className="w-full">
                        <form className="w-full flex items-center justify-center flex-col">
                            <label htmlFor="userName" className="form-group">
                                <div>
                                    <h5>Name</h5>
                                    <span>{userNameLenght}/30</span>
                                </div>
                                <input type="text" id="userName" onChange={(e) => {userNameInputHandler(e)}} defaultValue={userData.name} maxLength = "30" />
                                
                            </label>
                            <label htmlFor="tag" className="form-group disabled">
                                <div>
                                    <h5>Tag</h5>
                                </div>
                                <input type="text" id="tag" disabled value={userData.tag} />
                            </label>
                            <label htmlFor="bio" className="form-group">
                                <div>
                                    <h5>Bio</h5>
                                    <span>{bioLenght}/160</span>
                                </div>
                                <textarea rows="4" id="bio" defaultValue={userData.bio} onChange={(e) => {bioInputHandler(e)}} maxLength = "160"/>
                            </label>
                            <label htmlFor="website" className="form-group">
                            <div>
                                    <h5>Website</h5>
                                </div>
                                <input type="text" id="website" defaultValue={userData.website} onChange={(e) => {websiteInputHandler(e)}}/>
                            </label>
                            
                        </form>
                        <div className="w-[90%] flex items-center justify-end py-4 px">
                                <button className="px-2 py-1 mr-4" onClick={() => router.push(`/user/${userData.tag}`)}>Cancel</button>
                                <button className="px-4 py-1 bg-white rounded-[10px] text-black " onClick={saveChangeshandler}>Save</button>
                        </div>
                    </div>
                </div>


        
            </div>
        )}
        {isPostModalOpen && <PostModal userImage={userData.photoUrl} userName={userData.name} userTag={userData.tag}/>}
        
      </main>
    </div>
  )
}

export default EditUser
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