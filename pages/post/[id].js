
import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    getDocs,
  } from "@firebase/firestore";
  import { useRouter } from "next/router";
  import { useEffect, useState } from "react";
  import { useRecoilState } from "recoil";
  import { modalState, postModalState, shareModalState } from "../../atoms/modalAtom";
  import Modal from "../../components/Modal";
  import ShareModal from "../../components/ShareModal";
  import Sidebar from "../../components/Sidebar";
  import Widgets from "../../components/Widgets";
  import Post from "../../components/Post";
  import { auth, db } from "../../firebase";
  import { ArrowLeftIcon } from "@heroicons/react/solid";
  import Comment from "../../components/Comment";
  import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";
import PostModal from "../../components/PostModal";

function PostPage(props) {
  const [user] = useAuthState(auth)
  const userDatas = JSON.parse(props.data);
  const userId = user.uid;
  const [userData,setUserData] = useState()
  const [isLoad,setIsLoad] = useState(false)
  const [isOpen, setIsOpen] = useRecoilState(modalState); 
  const [isPostModalOpen, setIsPostModalOpen] = useRecoilState(postModalState); 
  const [isShareModalOpen,setIsShareModalOpen] = useRecoilState(shareModalState)
  const router = useRouter()
  const {id} = router.query
  const [post,setPost] = useState();
  const [comments,setComments] = useState([]);
  useEffect(() => {
    for(let i = 0 ; i < userDatas.length;i++){
      if(userDatas[i].id == userId){
        setUserData(userDatas[i])
      }
    }
    setIsLoad(true)
  },[])
  useEffect(
    () =>
      onSnapshot(doc(db, "posts", id), (snapshot) => {
        setPost(snapshot.data())
      })
    ,[db]
  );
  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "posts", id, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setComments(snapshot.docs)
      ),
    [db, id]
  );
  return (
    <div>
        <div className="">
      <Head>
        <title>{post?.username} on Moba: "{post?.text}"</title>
        <link rel="icon" href="/Logo.png" />
      </Head>
      <main className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
      {isLoad && (
          <Sidebar photoUrl={userData.photoUrl} tag={userData.tag} userName={userData.name} />
        )}
        <div className="flex-grow border-l border-r border-gray-700 max-w-2xl sm:ml-[73px] xl:ml-[200px] 2xl:ml-[370px]">
          <div className="flex items-center px-1.5 py-2 border-b border-gray-700 text-[#d9d9d9] font-semibold text-xl gap-x-4 sticky top-0 z-50 bg-black">
            <div
              className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0"
              onClick={() => router.push("/")}
            >
              <ArrowLeftIcon className="h-5 text-white" />
            </div>
            Moba
          </div>

          {isLoad && <Post id={id} post={post} postPage userName={userData.name} userImage={userData.photoUrl} userTag={userData.tag} />}
          <div className="py-2 px-4 border-b border-gray-700">
            <h2 className="text-white  font-bold ">Comments</h2>
          </div>
          {comments.length > 0 && (
            <div className="pb-72">
              {comments.map((comment) => (
                <Comment
                  key={comment.id}
                  id={comment.id}
                  postID = {id}
                  userName={userData.name}
                  userTag={userData.tag}
                  userID = {comment._document.data.value.mapValue.fields.id.stringValue}
                  comment={comment.data()}
                />
              ))}
            </div>
          )}
        </div>
        {isLoad && (
          <Widgets userDatas={userDatas}/>
        )}

        {isOpen && <Modal  userImage={userData.photoUrl} userName={userData.name} userTag={userData.tag} />}
        {isShareModalOpen && <ShareModal postID = {id}/>}
        {isPostModalOpen && <PostModal userImage={userData.photoUrl} userName={userData.name} userTag={userData.tag}/>}
      </main>
      
    </div>
    </div>
  )
}

export default PostPage
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
