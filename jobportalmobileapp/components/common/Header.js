import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Chip } from 'react-native-paper';
import Colors from '../../theme/Color';
import Styles from './Styles';

const Header = ({ data, selectedId, onSelect, defaultLabel = "Tất cả" }) => {
    return (
        <View style={Styles.headerContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity onPress={() => onSelect(null)} style={Styles.headerChipWrapper}>
                    <Chip 
                        mode={selectedId === null || selectedId === "" ? "flat" : "outlined"} 
                        icon="check"
                        style={{ backgroundColor: selectedId === null || selectedId === "" ? Colors.primary : Colors.white }}
                        textStyle={{ color: selectedId === null || selectedId === "" ? Colors.white : Colors.text.primary }}
                    >
                        {defaultLabel}
                    </Chip>
                </TouchableOpacity>

                {data.map(item => (
                    <TouchableOpacity 
                        key={item.id.toString()} 
                        onPress={() => onSelect(item.id)} 
                        style={Styles.headerChipWrapper}
                    >
                        <Chip 
                            mode={selectedId === item.id ? "flat" : "outlined"} 
                            icon="label"
                            style={{ backgroundColor: selectedId === item.id ? Colors.primary : Colors.white }}
                            textStyle={{ color: selectedId === item.id ? Colors.white : Colors.text.primary }}
                        >
                            {item.name}
                        </Chip>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

export default Header;