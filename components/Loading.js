import React from 'react'

function Loading() {
  return (
    <div className="flex h-screen w-screen  items-center justify-center">
      <div className="w-[100px] h-[100px] animate-spin border-[4px] border-red-700 relative rounded-full ">
        <div className="bg-black absolute top-0 left-0 w-[40px] rounded-full h-[40px]"></div>
      </div>
    </div>
  )
}

export default Loading