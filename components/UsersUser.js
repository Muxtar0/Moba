import { AnnotationIcon } from '@heroicons/react/solid'
import React from 'react'
import { useRouter } from "next/router";
function UsersUser({Datas}) {
    const router = useRouter()
  return (
        <div className='text-white flex-grow min-h-screen border-l border-r  border-gray-700 max-w-2xl sm:ml-[73px] xl:ml-[200px] 2xl:ml-[450px] 2xl:max-w-[1500px]'>
        <div className='text-[#d9d9d9] flex items-center sm:justify-between py-2 px-3 sticky top-0 z-50 bg-black bg-opacity-90'>
            <h2 className='text-lg sm:text-xl font-bold'>Users</h2>
            <div onClick={() => router.push('/chat')} className='hoverAnimation h-9 w-9 flex items-center justify-center xl:px-0 ml-auto'>
                <AnnotationIcon className='h-5 text-white' />
            </div>
        </div>
        {Datas.map((user) => (
            <div key={user.id} onClick={() => router.push(`/user/${user.tag}`)} className="flex cursor-pointer items-center group py-4 px-4 border-b  border-gray-700 transition hover:bg-gray-700">
                <img className='w-[50px] h-[50px] object-cover rounded-full' src={user.photoUrl} />
                <div className="ml-4">
                    <h3 className="font-bold">{user.name}</h3>
                    <p className="text-gray-700 transition group-hover:text-white text-[14px]">@{user.tag}</p>
                </div>
            </div>
        ))}
        <div className="pb-20"></div>
    </div>
  )
}

export default UsersUser