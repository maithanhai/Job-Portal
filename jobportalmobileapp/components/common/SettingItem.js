import React from 'react';
import { List, Divider } from 'react-native-paper';
import Colors from "../../theme/Color";

const SettingItem = ({ title, icon, onPress, hideDivider = false }) => {
    return (
        <>
            <List.Item
                title={title}
                left={(props) => <List.Icon {...props} icon={icon} color={Colors.primary} />}
                right={(props) => <List.Icon {...props} icon="chevron-right" size={20} color={Colors.white} />}
                onPress={onPress}
            />
            {!hideDivider && <Divider />}
        </>
    );
};

export default SettingItem;