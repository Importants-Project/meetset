<template>
    <div class="uploadFile">
        <input
            type="file"
            id="file"
            accept=".png, .jpeg, .gif, .svg"
            ref="uploadFile__file"
            @input="uploadFile"
        >

        <span>{{ fileName }}</span>

        <label for="file">Yüklə</label>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                fileName: 'Loqonu yükləyin',
            }
        },
        methods: {
            uploadFile() {
                this.fileName = this.$refs.uploadFile__file.files[0].name;
                this.$emit('file', this.$refs.uploadFile__file.files[0]);
            }
        },
        props: {
            selected: {
                type: String
            }
        }
    }
</script>

<style lang="scss" scoped>
    .uploadFile {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 9px 10px 16px;
        border-radius: 8px;
        border: 1px solid #D8DCE0;
        font-family: TTInterfaces-Regular, sans-serif;
        input {
            display: none;
        }
        span {
            font-weight: 400;
            font-size: 16px;
            line-height: 22px;
            color: #697586;
        }
        label {
            padding: 9px 42px;
            font-weight: 500;
            font-size: 14px;
            line-height: 18px;
            color: #1E293B;
            border-radius: 6px;
            cursor: pointer;
            background-color: #E2E8F0;
        }
    }
</style>