<template>
    <div class="custom-select" :tabindex="tabindex" @blur="open = false">
        <div class="selected" :class="{ open: open }" @click="open = !open">
           <p>{{ selected }}</p>
            <img src="../../assets/images/chevron-down.png" alt=" meetset dropdown"/>
        </div>

        <div class="items" :class="{ selectHide: !open }">
            <div v-for="(option, i) of options" :key="i" @click="selectVal(option)">
               <p>{{ option.name }}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        selectVal(val) {
            this.selected = val.name;
            this.open = false;
            this.$emit("selectValue", val);
        },
    },
    props: {
        options: {
            type: Array,
            required: true,
        },
        default: {
            type: Number,
            default: "",
        },
        tabindex: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            selected: "Otaq seçin",
            open: false,
        };
    },

    mounted() {
       this.$nextTick(() => {
          this.options?.forEach((item) => {
                if (item.id === this.default) this.selected = item.name;
            });
        });
    },
};
</script>

<style >
.custom-select {
    position: relative ;
    width: 100% ;
    text-align: left ;
    outline: none ;
    height: 56px ;
    line-height: 22px ;
}

.custom-select .selected {
    background-color: #fff ;
    border-radius: 6px ;
    border: 1px solid #cdd5df ;
    color: #364152 ;
    height: 56px ;
    cursor: pointer ;
    padding: 16px ;

    display: flex ;
    justify-content: space-between ;

    font-family: TTInterfaces-Regular ,sans-serif;
    font-size: 16px ;
    font-weight: 400 ;
    line-height: 22px ;

    user-select: none ;
}

.custom-select .selected.open {
    border: 1px solid #cdd5df ;
    border-radius: 6px 6px 0px 0px ;
}

.custom-select .selected:after {
    position: absolute ;
    content: "" ;
    top: 22px ;
    right: 1em ;
    width: 0 ;
    height: 0 ;
    border: 5px solid transparent ;
    border-color: #fff transparent transparent transparent ;
}

.custom-select .items {
    color: #364152 ;
    border-radius: 0px 0px 6px 6px ;
    border-right: 1px solid #cdd5df;
    border-left: 1px solid #cdd5df;
    border-bottom: 1px solid #cdd5df;
    position: absolute;
    background-color: #fff;
    left: 0;
    right: 0;
    z-index: 1;
}

.custom-select .items div {
    color: #364152;
    padding: 16px;
    cursor: pointer;
    user-select: none;

    font-family: TTInterfaces-Regular , sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
}

.custom-select .items div:hover {
    background-color: #eef2f6;
}

.selectHide {
    display: none;
}
</style>
