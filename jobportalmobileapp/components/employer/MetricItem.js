import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Icon } from 'react-native-paper';
import ComponentStyles from './Styles';

const MetricItem = ({ icon, color, value, label }) => (
    <View style={ComponentStyles.metricItem}>
        <View style={[ComponentStyles.iconWrapper, { backgroundColor: color + '15' }]}>
            <Icon source={icon} color={color} size={22} />
        </View>
        <Text style={ComponentStyles.metricValue}>{value}</Text>
        <Text style={ComponentStyles.metricLabel}>{label}</Text>
    </View>
);

export default MetricItem;