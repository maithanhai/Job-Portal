import React from 'react';
import { Button } from 'react-native-paper';
import Colors from '../../theme/Color';
import ComponentStyles from './Styles';
import { Text } from 'react-native';

const CustomButton = ({ 
    title, 
    onPress, 
    mode = "contained",
    style, 
    loading = false,
    disabled = false,
    icon,        
    textColor,    
    buttonColor    
}) => {
    return (
        <Button
            mode={mode}
            onPress={loading ? undefined : onPress} 
            loading={loading}
            disabled={disabled}
            icon={loading ? undefined : icon} 
            buttonColor={buttonColor || (mode === "contained" ? Colors.primary : "transparent")}
            textColor={textColor || (mode === "contained" ? Colors.white : Colors.primary)}
            style={[
                ComponentStyles.customButton, 
                style 
            ]}
            contentStyle={{ minHeight: 45 }}
            labelStyle={[
                ComponentStyles.customButtonLabel,
                loading && { marginHorizontal: 0, marginVertical: 0 }
            ]}
        >
            {loading ? "" : <Text style={ComponentStyles.customButtonLabel}>{title}</Text>}
        </Button>
    );
};
export default CustomButton;