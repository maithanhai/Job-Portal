import { useState } from "react"
import AuthStack from "./AuthStack";
import CandidateTabs from "./CandidateTabs";
import EmployerTabs from "./EmployerTabs";


const RootNavigation = () => {
    const [isLogin,setIsLogin] = useState(false);
    const [userRole,setUserRole] = useState("CANDIDATE");

    if (!isLogin){
        return <AuthStack />
    }

    if (userRole === "CANDIDATE"){
        return <CandidateTabs />
    }

    return <EmployerTabs />

}

export default RootNavigation;