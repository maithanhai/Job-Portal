import React from 'react';
import { Button } from 'react-native-paper';
import Colors from '../../theme/Color';

const CustomButton = ({ 
    title, 
    onPress, 
    mode = "contained", // Mặc định là nút đổ màu kín ("contained"), có thể đổi thành "outlined" (chỉ có viền)
    style, 
    loading = false,    // Cờ để bật hiệu ứng xoay xoay lúc chờ API
    disabled = false    // Cờ để làm mờ (khóa) nút bấm
}) => {
    return (
        <Button
            mode={mode}
            onPress={onPress}
            loading={loading}
            disabled={disabled}
            // Nếu là nút chính (contained) thì nền xanh chữ trắng. Ngược lại thì chữ xanh nền trong suốt.
            buttonColor={mode === "contained" ? Colors.primary : "transparent"}
            textColor={mode === "contained" ? Colors.white : Colors.primary}
            // Định dạng chung: bo góc 8px cho thanh thoát, chiều cao nhỉnh hơn một chút
            style={[
                { 
                    borderRadius: 8, 
                    paddingVertical: 4,
                    marginVertical: 10,
                }, 
                style // Cho phép ghi đè style từ bên ngoài truyền vào
            ]}
            labelStyle={{ 
                fontSize: 16, 
                fontWeight: 'bold',
                letterSpacing: 0.5 // Kéo giãn khoảng cách các chữ ra một tẹo nhìn cho sang
            }}
        >
            {title}
        </Button>
    );
};
export default CustomButton;