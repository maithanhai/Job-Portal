import React from 'react';
import { View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import Colors from '../../theme/Color';
import StatCardStyles from './Styles';

const StatCard = ({ number, label, icon, color }) => (
    <View style={[StatCardStyles.statCard, { borderLeftColor: color }]}>
        <Icon source={icon} size={22} color={color} />
        <Text style={[StatCardStyles.statNumber, { color }]}>{number}</Text>
        <Text style={StatCardStyles.statLabel}>{label}</Text>
    </View>
);
export default StatCard;