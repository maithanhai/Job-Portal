import { useContext } from "react";
import { MyUserContext } from "../configs/Contexts"; // Nhớ check lại đường dẫn này
import AuthStack from "./AuthStack";
import CandidateTabs from "./CandidateTabs";
import EmployerTabs from "./EmployerTabs";

const RootNavigation = () => {
    const [user] = useContext(MyUserContext);

    if (user === null) {
        return <AuthStack />;
    }

    if (user.role === "EMPLOYER") {
        return <EmployerTabs />;
    }
    
    return <CandidateTabs />;
}

export default RootNavigation;