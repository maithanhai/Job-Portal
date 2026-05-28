import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Modal, Portal, List } from 'react-native-paper';
import CustomInput from '../common/CustomInput';
import Styles from './Styles';

const CategoryPicker = ({ categories, value, onSelect, style }) => {
    const [visible, setVisible] = useState(false);
    const selected = categories.find(c => c.id.toString() === value);

    return (
        <View style={style}>
            <View onTouchStart={() => setVisible(true)}>
                <CustomInput
                    label="Ngành nghề *"
                    icon="format-list-bulleted"
                    value={selected ? selected.name : "Chọn..."}
                    disabled={true}
                    style={Styles.categoryPickerInputNoMargin}
                />
            </View>
            <Portal>
                <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={Styles.categoryPickerModalContent}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {categories.map((c) => (
                            <List.Item
                                key={c.id}
                                title={c.name}
                                onPress={() => { onSelect(c.id.toString()); setVisible(false); }}
                            />
                        ))}
                    </ScrollView>
                </Modal>
            </Portal>
        </View>
    );
};

export default CategoryPicker;