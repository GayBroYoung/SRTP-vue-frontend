<template>
<div class="header">
    <!-- 折叠按钮 -->
    <el-row :gutter="20">
        <el-col :span="8" :offset="0">
            <div class="header">
                <div class="collapse-btn">
                    <i class="el-icon-s-fold"></i>
                </div>
                <div>
                    {{title}}
                </div>
            </div>
        </el-col>
        <el-col :span="4" :offset="12">{{name}}</el-col>
    </el-row>
</div>
</template>
<script>
export default {
    name:'VHeader',
    data() {
        return {
            fullscreen: false,
            name: "linxin",
            message: 2,
        };
    },
    props:{
        title:String,
        name:String
    },
    computed: {
        username() {
            let username = localStorage.getItem("ms_username");
            return username ? username : this.name;
        },
    }
};
</script>
<style>
.hbox {
    position: relative;
    box-sizing: border-box;
    width: 100%;
}
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #fff;
}
.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
}
.header .logo {
    float: left;
    width: 250px;
}
.header-right {
    float: right;
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}
.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}
.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
}
.btn-bell .el-icon-bell {
    color: #fff;
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 20px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}
</style>
