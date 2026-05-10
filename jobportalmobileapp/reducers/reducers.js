const MyUserReducer = (currentState, action) => {
    switch (action.type) {
        case "LOGIN":
            return action.payload;
        case "LOGOUT":
            return null;
        default:
            return currentState;
    }
};

export default MyUserReducer; // BẮT BUỘC phải có dòng này để có
//  thể import được reducer này vào App.js,
//  nếu không sẽ bị lỗi "Module not found" hoặc
//  "undefined is not a function" khi gọi useReducer(MyUserReducer, null)