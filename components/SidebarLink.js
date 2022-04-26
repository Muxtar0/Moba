import React from 'react'
import { useRouter } from 'next/router'

function SidebarLink({Icon,text,active,linkway}) {
  const router = useRouter()
  return (
    <div onClick={() => router.push(linkway)}  className={`text-[#d9d9d9] flex items-center justify-center xl:justify-start  text-xl space-x-3 hoverAnimation  ${active && "font-bold"}`}>
        <Icon className="h-5 sm:h-7" />
        <span className='hidden 2xl:inline'>{text}</span>
    </div>
  )
}

export default SidebarLink