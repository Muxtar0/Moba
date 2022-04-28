import { useRecoilState, useResetRecoilState } from "recoil";
import { chatAddUserModalState } from "../atoms/modalAtom";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { XIcon , LinkIcon } from "@heroicons/react/solid";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { addDoc, collection, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";



function chatAddUserModal({userDatas}) {
  const [isOpen, setIsOpen] = useRecoilState(chatAddUserModalState);
  const [user] = useAuthState(auth)
    const userTag = user.email.split("@");
    const userChatRef = query(collection(db, "chats"), where("users", "array-contains", userTag[0]));
    const [chatsSnapshot] = useCollection(userChatRef)
    const [searchingResults,setSearchingResults] = useState([])
    const [isUserHave,setIsUserHave] = useState(false)
    const [input,setInput] = useState("")
    const addUserInputRef = useRef()
    const isUserHaveFunc = (e) => {
      setInput(e.target.value)
      if(e.target.value !== ""){
        for(const se in userDatas){
          if(userDatas[se].name.toLowerCase().includes(e.target.value.toLowerCase()) || userDatas[se].tag.includes(e.target.value.toLowerCase())){
            setSearchingResults([userDatas[se]])
          }
        }
        for(let i = 0 ; i < userDatas.length;i++){
          if(userDatas[i].tag == e.target.value) {
            setIsUserHave(true)
          }
        }      
      }
      else{
        setSearchingResults([])
      }
      
      
    }
  const createChat = () => {    
    if(isUserHave == true){
        if(input !== userTag[0] && !chatAlreadyExsist(input)){
            addDoc(collection(db, "chats"), {
                users:[userTag[0],input],
            });
            setIsOpen(false)
        }
        else{
            alert("Some Error.Try again")
        }
        setIsUserHave(false)
    }
    else{
        alert("This user does not exist.Please try again")
    }
}    
const chatAlreadyExsist = (recipientTag) => !!chatsSnapshot?.docs.find((chat) => 
    chat.data().users.find((user) => user === recipientTag)?.length > 0
) 

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed sharemodaldi z-[1000] inset-0 pt-8" onClose={setIsOpen}>
        <div className="flex items-start justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-[#5b7083] bg-opacity-40 transition-opacity" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-black rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl w-[100%] sm:w-full">
              <div className="flex items-center px-1.5 py-2 border-b border-gray-700">
                <div
                  className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0"
                  onClick={() => setIsOpen(false)}
                >
                  <XIcon className="h-[22px] text-white" />
                </div>
              </div>
              <div className="flex flex-col px-4 pt-5 pb-2.5 sm:px-6">
                <div className="w-full pb-5">
                  <h2 className="text-white font-bold text-[18px]">Write User Tag</h2>
                  <input type="text" ref={addUserInputRef} placeholder="Write user tag..." onChange={(e) => isUserHaveFunc(e)} className="w-full mt-4  text-white  px-2 py-2   border-none rounded-[10px] bg-[#1f1f1f] outline-none"/>
                  <div  className="max-h-[300px] overflow-y-auto">
                  {searchingResults.map((result) => (
                    
                    <div key={result.id} onClick={() => {addUserInputRef.current.value = result.tag}} className="flex items-center justify-start cursor-pointer hover:opacity-75 my-1 py-2">
                    <img className="w-[40px] h-[40px] rounded-full object-cover" src={result.photoUrl} />
                    <div className="ml-4">
                        <h3 className="font-bold text-white">{result.name}</h3>
                        <p className="text-[14px] text-gray-700">{result.tag}</p>
                    </div>
                  </div>
                  ))}
                  </div>
                  
                  <button onClick={createChat} className="text-white text-center w-full py-3">Add</button>
                </div>
                
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default chatAddUserModal;