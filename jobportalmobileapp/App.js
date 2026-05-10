import { NavigationContainer } from "@react-navigation/native";
import RootNavigation from "./navigations/RootNavigation";
import { MyUserContext } from "./configs/Contexts";
import { useReducer } from "react";
import MyUserReducer from "./reducers/reducers";

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  return (
    <MyUserContext.Provider value={[ user, dispatch ]}>
      <NavigationContainer>
        <RootNavigation />
      </NavigationContainer>
    </MyUserContext.Provider>
  );
};
export default App;
