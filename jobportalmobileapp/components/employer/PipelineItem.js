import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Colors from '../../theme/Color';
import ComponentStyles from './Styles';

const PipelineItem = ({ value, label, color }) => (
    <View style={ComponentStyles.pipelineItem}>
        <Text style={[ComponentStyles.pipelineValue, { color: color }]}>{value}</Text>
        <Text style={ComponentStyles.pipelineLabel}>{label}</Text>
    </View>
);

export default PipelineItem;