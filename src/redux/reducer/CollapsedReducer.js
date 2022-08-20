/*
export const CollapsedReducer = (preState={
    isCollapsed:false
}, action)=>{
    let {type} = action

    switch (type){
        case "change_collapsed":
            let newState = {...preState}
            newState.isCollapsed = !newState.isCollapsed
            return newState

        default:
            return preState
    }
    return preState
}
*/
export const CollapsedReducer = (prevState={isCollapsed:false},action) => {
    
    const {type} = action
    switch (type){
        case "change_collapsed":
            let newState = {...prevState}
            newState.isCollapsed = !newState.isCollapsed
            return newState
        default:
            return prevState
    }
    return prevState
}