import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Modal, Portal, Text, RadioButton } from 'react-native-paper';
import Colors from '../../theme/Color';
import Styles from './Styles';
import CustomInput from './CustomInput'; 
import CustomButton from './CustomButton';

const SALARY_RANGES = [
    { label: 'Tất cả', min: '', max: '' },
    { label: 'Dưới 10 triệu', min: 0, max: 10000000 },
    { label: '10 - 15 triệu', min: 10000000, max: 15000000 },
    { label: '15 - 20 triệu', min: 15000000, max: 20000000 },
    { label: '20 - 25 triệu', min: 20000000, max: 25000000 },
    { label: '25 - 30 triệu', min: 25000000, max: 30000000 },
    { label: '30 - 50 triệu', min: 30000000, max: 50000000 },
    { label: '50 triệu trở lên', min: 50000000, max: -1 },
    { label: 'Thỏa thuận', min: -1, max: -1 },
];

const FilterModal = ({ visible, onClose, onApply }) => {
    const [location, setLocation] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [selectedSalaryLabel, setSelectedSalaryLabel] = useState("Tất cả");

    const handleApply = () => {
        const selectedRange = SALARY_RANGES.find(r => r.label === selectedSalaryLabel);
        
        onApply({ 
            location, 
            companyName, 
            salary_min: selectedRange.min, 
            salary_max: selectedRange.max 
        });
        onClose();
    };

    const handleReset = () => {
        setLocation("");
        setCompanyName("");
        setSelectedSalaryLabel("Tất cả");
        
        onApply({ location: "", companyName: "", salary_min: "", salary_max: "" });
        onClose();
    };

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onClose}
                contentContainerStyle={Styles.filterModalContainer}
            >
                <Text style={Styles.filterModalTitle}>Bộ lọc tìm kiếm</Text>

                <CustomInput
                    label="Địa điểm (Ví dụ: Ho Chi Minh)"
                    value={location}
                    onChangeText={setLocation}
                    icon="map-marker"
                />

                <CustomInput
                    label="Tên công ty"
                    value={companyName}
                    onChangeText={setCompanyName}
                    icon="domain"
                />

                <Text style={Styles.filterModalSectionLabel}>Mức lương:</Text>
                <ScrollView style={Styles.filterModalRadioGroupScroll} nestedScrollEnabled={true}>
                    <RadioButton.Group 
                        onValueChange={newValue => setSelectedSalaryLabel(newValue)} 
                        value={selectedSalaryLabel}
                    >
                        {SALARY_RANGES.map((item, index) => (
                            <RadioButton.Item 
                                key={index}
                                label={item.label} 
                                value={item.label} 
                                color={Colors.primary}
                                labelStyle={Styles.filterModalRadioLabel}
                            />
                        ))}
                    </RadioButton.Group>
                </ScrollView>

                <View style={Styles.filterModalRowBtn}>
                    <CustomButton 
                        title="Mặc định" 
                        mode="outlined" 
                        onPress={handleReset} 
                        style={Styles.filterModalBtn} 
                    />
                    <CustomButton 
                        title="Áp dụng" 
                        mode="contained" 
                        onPress={handleApply} 
                        style={Styles.filterModalBtn} 
                    />
                </View>
            </Modal>
        </Portal>
    );
};

export default FilterModal;