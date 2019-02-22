<template>
    <div class="edit" >
        <script id="editor"  type="text/plain" :style="{height: height,width: width}"></script>
    </div>
</template>
<script>
export default {
    name: 'UE',
    data() {
        return {
            editor: null
        };
    },
    props: {
        height: {
            type: String,
            default: ''
        },
        width: {
            type: String,
            default: ''
        },
        defaultMsg: {
            type: String,
            default: ''
        },
        config: {
            type: Object,
            default: () => {
                return {
                    toolbars: [
                        [
                            'fullscreen',
                            'source',
                            '|',
                            'undo',
                            'redo',
                            '|',
                            'bold',
                            'italic',
                            'underline',
                            'fontborder',
                            'strikethrough',
                            'superscript',
                            'subscript',
                            'removeformat',
                            'formatmatch',
                            'autotypeset',
                            'blockquote',
                            'pasteplain',
                            '|',
                            'forecolor',
                            'backcolor',
                            'insertorderedlist',
                            'insertunorderedlist',
                            'selectall',
                            'cleardoc',
                            '|',
                            'rowspacingtop',
                            'rowspacingbottom',
                            'lineheight',
                            '|',
                            'customstyle',
                            'paragraph',
                            'fontfamily',
                            'fontsize',
                            '|',
                            'directionalityltr',
                            'directionalityrtl',
                            'indent',
                            '|',
                            'justifyleft',
                            'justifycenter',
                            'justifyright',
                            'justifyjustify',
                            '|',
                            'touppercase',
                            'tolowercase',
                            '|',
                            'link',
                            'unlink',
                            'anchor',
                            '|',
                            'imagenone',
                            'imageleft',
                            'imageright',
                            'imagecenter',
                            '|',
                            'simpleupload',
                            'insertimage',
                            'emotion',
                            'map',
                            'insertcode',
                            'pagebreak',
                            'template',
                            'background',
                            '|',
                            'horizontal',
                            'date',
                            'time',
                            'spechars',
                            'snapscreen',
                            'wordimage',
                            '|',
                            'inserttable',
                            'deletetable',
                            'insertparagraphbeforetable',
                            'insertrow',
                            'deleterow',
                            'insertcol',
                            'deletecol',
                            'mergecells',
                            'mergeright',
                            'mergedown',
                            'splittocells',
                            'splittorows',
                            'splittocols',
                            'charts',
                            '|',
                            'print'
                        ]
                    ]
                };
            }
        }
    },
    beforeMount() {
        // this.init();
    },
    mounted() {
        this.init();
    },

    methods: {
        init() {
            const _this = this;
            this.editor = UE.getEditor('editor', this.config); // 初始化UE
            this.editor.ready(function(editor) {
                _this.editor.setContent(_this.defaultMsg);
            });
        },
        setContent(html) {
            const _this = this;
            this.editor.ready(function(editor) {
                _this.editor.setContent(html);
            });
        },
        getUEContent() {
            // 获取内容方法
            return this.editor.getContent();
        }
    },
    destroyed() {
        this.editor.destroy();
    }
};
</script>
<style lang="stylus">


</style>
