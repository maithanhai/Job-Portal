import { NavigationContainer } from "@react-navigation/native";
import RootNavigation from "./navigations/RootNavigation";

const App = () => {
  return (
    <NavigationContainer>
      <RootNavigation />
    </NavigationContainer>
  )
}
export default App;