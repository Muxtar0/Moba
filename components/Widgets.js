import { SearchIcon } from "@heroicons/react/outline";
import Trending from "./Trending";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

function Widgets({userDatas}) {
  const userAuth = useAuthState(auth)
  const [searchingResults,setSearchingResults] = useState([])
  const router = useRouter()
  const [limitedUsersRight,setLimitedUsersRight] = useState([])
  const [staticUser,setStaticUser] = useState();
  const isUserHaveFunc = (e) => {
    if(e.target.value !== ""){
      for(const se in userDatas){
        if(userDatas[se].name.toLowerCase().includes(e.target.value.toLowerCase()) || userDatas[se].tag.includes(e.target.value.toLowerCase())){
          setSearchingResults([userDatas[se]])
        }
      }
          
    }
    else{
      setSearchingResults([])
    }
    
    
  }
  useEffect(() => {
    for(let i = 0 ; i < 4;i++){
      setLimitedUsersRight(prevdata => [...prevdata,userDatas[i]])
    }
  },[])
  return (
    <div className="hidden lg:inline ml-8 xl:w-[450px] py-1 space-y-5">
      <div className="sticky top-0 py-1.5 bg-black z-50 w-11/12 xl:w-9/12">
        <div className="flex items-center bg-[#202327] p-3 rounded-full relative">
          <SearchIcon className="text-gray-500 h-5 z-50" />
          <input
            type="text"
            className="bg-transparent placeholder-gray-500 outline-none text-[#d9d9d9] absolute inset-0 pl-11 border border-transparent w-full focus:border-[#1d9bf0] rounded-full focus:bg-black focus:shadow-lg"
            placeholder="Search Moba"
            onChange={(e) => isUserHaveFunc(e)}
          />
        </div>
        <div>
        {searchingResults.map((result) => (
                    
                    <div key={result.id} onClick={() => {
                      router.push(`/user/${result.tag}`)
                    }} className="flex items-center justify-start cursor-pointer hover:opacity-75 my-1 py-2">
                    <img className="w-[40px] h-[40px] rounded-full object-cover" src={result.photoUrl} />
                    <div className="ml-4">
                        <h3 className="font-bold text-white">{result.name}</h3>
                        <p className="text-[14px] text-gray-700">@{result.tag}</p>
                    </div>
                  </div>
                  ))}
        </div>
      </div>
      <div className="text-[#d9d9d9] space-y-3 bg-[#15181c] pt-2 rounded-xl w-11/12 xl:w-9/12">
        <h4 className="font-bold text-xl px-4">Who to follow</h4>
        
        {limitedUsersRight.map((user) => (
            <div
              className="hover:bg-white hover:bg-opacity-[0.03] px-4 py-2 cursor-pointer transition duration-200 ease-out flex items-center"
              key={user.id}
              onClick={() => {router.push(`/user/${user.tag}`)}}
            >
              <img src={user.photoUrl} className="rounded-full w-[50px] h-[50px] object-cover" />
              <div className="ml-4 leading-5 group">
                <h4 className="font-bold group-hover:underline">
                  {user.name}
                </h4>
                <h5 className="text-gray-500 text-[15px]">@{user.tag}</h5>
              </div>
              {/* <button className="ml-auto bg-white text-black rounded-full font-bold text-sm py-1.5 px-3.5">
                Follow
              </button> */}
            </div>
          ))}
        {/* <button className="hover:bg-white hover:bg-opacity-[0.03] px-4 py-3 cursor-pointer transition duration-200 ease-out flex items-center justify-between w-full text-[#1d9bf0] font-light">
          Show more
        </button> */}
      </div>
    </div>
  );
}

export default Widgets;