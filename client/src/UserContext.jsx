import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

function UserContextProvider({children}){
    const [id , setId] = useState(null);

    return (
        <UserContext.Provider value={{ id , setId}}>
            {children}
        </UserContext.Provider>
    )
}
export default UserContextProvider

