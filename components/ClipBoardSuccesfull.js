import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useRef, useState } from 'react'
import {ClipBoardSuccesfullState} from '../atoms/modalAtom'
import {useRecoilState} from 'recoil'

function ClipBoardSuccesfull() {
  let [isOpen, setIsOpen] = useRecoilState(ClipBoardSuccesfullState)
  
   


  function closeModal() {
    setTimeout(() => {
        setIsOpen(false)  
    }, 1200);
  }
  closeModal();
  return (
    <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed top-0 inset-0 z-50 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-black shadow-[0_0px_5px_5px_rgba(51,51,51,1)] rounded-xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-white"
                >
                  Copied
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-white">
                    The url copied your clipboard
                  </p>
                </div>
                <span   className='absolute w-full bottom-0 left-0 h-1 bg-white rounded-xl'></span>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
  )
}

export default ClipBoardSuccesfull