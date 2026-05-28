import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Colors from '../../theme/Color';
import Styles from './Styles';
import CustomButton from './CustomButton';

const CompareBar = ({ compareList, onClear, onCompare }) => {
    if (compareList.length === 0) return null;

    return (
        <View style={Styles.compareBarContainer}>
            <View style={Styles.compareBarRow}>
                <Text style={Styles.compareBarText}>Đã chọn:</Text>
                
                <View style={[
                    Styles.compareBarBadge, 
                    { 
                        backgroundColor: Colors.primary, 
                        paddingHorizontal: 10, 
                        paddingVertical: 2, 
                        borderRadius: 12, 
                        marginLeft: 6,
                        justifyContent: 'center', 
                        alignItems: 'center' 
                    }
                ]}>
                    <Text style={[
                        Styles.compareBarBadgeText, 
                        { color: Colors.white, fontSize: 12, fontWeight: 'bold' }
                    ]}>
                        {compareList.length}/3
                    </Text>
                </View>
            </View>

            <View style={[Styles.compareBarRow, { flexShrink: 0 }]}>
                <CustomButton 
                    title="Hủy" 
                    mode="outlined" 
                    onPress={onClear} 
                    contentStyle={{ paddingHorizontal: 0 }} 
                    style={[Styles.compareBarBtnCancel, { minWidth: 60 }]} 
                />
                
                <View style={{ width: 10 }} />
                
                <CustomButton 
                    title="So sánh" 
                    mode="contained" 
                    onPress={onCompare}
                    disabled={compareList.length < 2} 
                    contentStyle={{ paddingHorizontal: 0 }}
                    style={[Styles.compareBarBtnCompare, { minWidth: 90 }]} 
                />
            </View>
        </View>
    );
};

export default CompareBar;