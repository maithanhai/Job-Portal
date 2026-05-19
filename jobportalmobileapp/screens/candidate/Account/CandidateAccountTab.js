import React, { useContext } from "react";
import { View, ScrollView } from "react-native";
import { MyUserContext } from "../../../configs/Contexts";
import { useNavigation } from "@react-navigation/native";
import LogoutButton from "../../../components/common/LogoutButton";
import ProfileHeader from "../../../components/common/ProfileHeader";
import SettingItem from "../../../components/common/SettingItem";
import GlobalStyles from "../../../style/Styles";
import ScreenStyles from "./Styles";

const CandidateAccountTab = () => {
    const [user] = useContext(MyUserContext);
    const nav = useNavigation();

    return (
        <ScrollView
            contentContainerStyle={GlobalStyles.scrollContainer}
            showsVerticalScrollIndicator={false}
            style={GlobalStyles.container}
        >
            <View style={ScreenStyles.greenBackground} />

            <ProfileHeader 
                user={user} 
                onPress={() => nav.navigate("UserDetail")} 
            />

            <View style={ScreenStyles.body}>
                <View style={GlobalStyles.menuGroup}>
                    <SettingItem 
                        title="Hồ sơ của tôi" 
                        icon="file-account-outline" 
                        onPress={() => nav.navigate("UserDetail")} 
                    />
                    <SettingItem 
                        title="Đổi mật khẩu" 
                        icon="lock-reset" 
                        onPress={() => nav.navigate("ChangePassword")} 
                    />
                    
                    <SettingItem 
                        title="Việc làm đã lưu" 
                        icon="heart-outline" 
                        onPress={() => { /* Navigate tới màn SavedJobs */ }} 
                        hideDivider={true} 
                    />
                </View>
            </View>

            <View style={GlobalStyles.spacer} />

            <View style={ScreenStyles.logoutBox}>
                <LogoutButton />
            </View>
        </ScrollView>
    );
};

export default CandidateAccountTab;