import {createStore, mapGetters} from 'vuex'
const store = createStore({
    state() {
        return {
            teacher_id : null
        }
    },
    mutations:{
        set_id(state,id){
            state.teacher_id = id
        }
    },
    getters:{
        get_id:state=>{
            return state.teacher_id
        }
    }
})

export default store;