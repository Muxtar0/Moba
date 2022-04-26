const getRecipientTag = (users,userLoggedIn) => 
    users?.filter(userToFilter => userToFilter !== userLoggedIn?.email.split("@")[0])[0];
export default getRecipientTag;