import React, { useState } from 'react';
import { TextInput } from 'react-native-paper';
import Colors from '../../theme/Color';
import Styles from './Styles';

const CustomInput = ({ 
    label, 
    icon, 
    isPassword = false, 
    value, 
    onChangeText, 
    keyboardType = 'default',
    style ,
    disabled = false,
}) => {
    const [hidePassword, setHidePassword] = useState(isPassword);

    return (
        <TextInput
            label={label}
            value={value}
            onChangeText={onChangeText}
            mode="outlined"
            keyboardType={keyboardType}
            secureTextEntry={hidePassword}
            disabled={disabled}
            left={icon ? <TextInput.Icon icon={icon} color={Colors.gray} /> : null}
            right={
                isPassword ? (
                    <TextInput.Icon 
                        icon={hidePassword ? "eye-off" : "eye"} 
                        color={Colors.gray}
                        onPress={() => setHidePassword(!hidePassword)}
                    />
                ) : null
            }

            outlineColor={Colors.lightGray}
            activeOutlineColor={Colors.primary} 
            
            style={[Styles.customInput, style]}
        />
    );
};

export default CustomInput;