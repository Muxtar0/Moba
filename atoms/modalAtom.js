import {atom} from 'recoil'

export const modalState = atom({
    key:"modalState",
    default:false,
})
export const postIdState = atom({
    key:"postIdState",
    default:"",
})
export const shareModalState = atom({
    key:"shareModalState",
    default:false,
})
export const sharePostIDstate = atom({
    key:"sharePostIDstate",
    default:"",
})
export const ClipBoardSuccesfullState = atom({
    key:"ClipBoardSuccesfullState",
    default:false,
})
export const postModalState = atom({
    key:"postModalState",
    default:false,
})
export const chatAddUserModalState = atom({
    key:"chatAddUserModalState",
    default:false,
})
