import { createContext, useReducer } from "react";
import { MyUserReducer } from "../reducers/reducers";

export const MyUserContext = createContext();

export const MyUserProvider = ({ children }) => {
    const [user, dispatch] = useReducer(MyUserReducer, null);
    
    return (
        <MyUserContext.Provider value={[user, dispatch]}>
            {children}
        </MyUserContext.Provider>
    );
};