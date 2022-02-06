const initialState = {
    isLogin: false,
    toggler: '',
    user: {
        uid: '',
        name: 'Admin',
        UserName: 'Admin',
        email: 'example@gmail.com',
        role: ''
    },
};

// Reducer
const rootReducer = (state = initialState, action) => {
    if (action.type === 'GET_USER') {
        console.log('get User called', action.userData.user)
        return {
            ...state,
            isLogin: true,
            user: action.userData.user
        };
    }
    if (action.type === 'LOGOUT_USER') {
        console.log('LOGOUT User called')
        return {
            ...state,
            isLogin: false,
            user: initialState.user
        };
    }
    if (action.type === 'TOGGEL_SIDEBAR') {
        return {
            ...state,
            toggler: action.isToggel
        };
    }
    if (action.type === 'TEST_NAME') {
        return {
            ...state,
            testName: action.test_Name.testName,
            testId: action.test_Id.testId

        };
    }
    if (action.type === 'SET_LOADING') {
        return {
            ...state,
            loader: {
                ...state.loader,
                loading: action.isLoading
            }

        };
    }
    return state;
};

export default rootReducer; 