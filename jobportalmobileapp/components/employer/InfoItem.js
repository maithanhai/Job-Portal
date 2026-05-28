import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../../theme/Color';
import ComponentStyles from './Styles';

const InfoItem = ({ icon, label, value, isHighlight }) => (
    <View style={ComponentStyles.infoRow}>
        <View style={ComponentStyles.labelRow}>
            <MaterialCommunityIcons name={icon} size={16} color={Colors.primary} />
            <Text style={ComponentStyles.label}> {label.toUpperCase()}</Text>
        </View>
        <Text style={[ComponentStyles.value, isHighlight && { color: Colors.salary.primary, fontWeight: '700' }]}>{value}</Text>
    </View>
);

export default InfoItem;