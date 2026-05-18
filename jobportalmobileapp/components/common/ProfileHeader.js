import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Avatar, List } from 'react-native-paper';
import Colors from '../../theme/Color';
import Styles from '../../style/Styles';

const ProfileHeader = ({ user, onPress }) => {
    const fullName = user?.first_name 
        ? `Chào bạn, ${user.first_name}`.trim() 
        : (user?.company_name || "Tài khoản của tôi"); 

    const roleText =
        user?.role === "CANDIDATE" ? "Ứng viên" :
        user?.role === "EMPLOYER" ? "Nhà tuyển dụng" : "Khách";

    const avatarUri = user?.avatar;

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={Styles.infoCard}
            onPress={onPress}
        >
            <View style={Styles.avatarWrapper}>
                <Avatar.Image
                    size={70}
                    source={{ uri: avatarUri || "https://digitalhealthskills.com/no-user-image-icon-27/" }}
                    style={{ backgroundColor: Colors.grey }}
                />
            </View>
            <View style={Styles.textContainer}>
                <Text style={Styles.userName} numberOfLines={1}>
                    {fullName}
                </Text>
                <Text style={Styles.userRole}>{roleText}</Text>
            </View>
            <List.Icon icon="chevron-right" color={Colors.white} />
        </TouchableOpacity>
    );
};

export default ProfileHeader;