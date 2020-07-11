import React, { Component } from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import Heading from "@ckeditor/ckeditor5-heading/src/heading";
import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold";
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic";
import Font from "@ckeditor/ckeditor5-font/src/font";
import Image from "@ckeditor/ckeditor5-image/src/image";
import ImageToolbar from "@ckeditor/ckeditor5-image/src/imagetoolbar";
import ImageResize from "@ckeditor/ckeditor5-image/src/imageresize";
import FileRepository from "@ckeditor/ckeditor5-upload/src/filerepository";
import CodeBlock from "@ckeditor/ckeditor5-code-block/src/codeblock";
import List from "@ckeditor/ckeditor5-list/src/list";
import UploadAdapter from "../../adapter/UploadAdapter";
import parse from "html-react-parser";
import { FormInput, Button, Alert, FormCheckbox, FormSelect } from "shards-react";
import { connect } from "react-redux";
import { uploadImage, createTutorial, clearErrorsAndLink } from "../../redux/tutorials/actions";

const editorConfiguration = {
    plugins: [
        Essentials,
        Paragraph,
        Heading,
        Bold,
        Italic,
        Font,
        List,
        FileRepository,
        Image,
        ImageToolbar,
        ImageResize,
        CodeBlock,
    ],
    toolbar: [
        "heading",
        "bold",
        "italic",
        "fontColor",
        "fontBackgroundColor",
        "bulletedList",
        "numberedList",
        "selectAll",
        "undo",
        "redo",
        "codeBlock",
    ],
    image: {
        toolbar: ["imageTextAlternative"],
    },
    codeBlock: {
        languages: [{ language: "javascript", label: "JavaScript" }],
    },
};

class CreateTutorialPage extends Component {
    state = {
        editorValue: "",
        title: "",
        description: "",
        thumbnailUrl: "",
        difficultyLevel: 0,
        technologies: { ReactJS: false, JavaScript: false },
    };

    handleEditorValue = (event, editor) => {
        const data = editor.getData();
        this.setState({ editorValue: data });
    };

    handleThumbnailUrl = (e) => {
        this.props.uploadImageReq(e.target.files[0]);
    };

    handleTitle = (e) => {
        this.setState({ title: e.target.value });
    };

    handleDescription = (e) => {
        this.setState({ description: e.target.value });
    };

    handleTechChange = (e, tech) => {
        const technologies = this.state.technologies;
        technologies[tech] = !technologies[tech];
        this.setState({ technologies });
    };

    handleThumbnailInput = (e) => {
        this.setState({ thumbnailUrl: e.target.value });
    };

    handleDifficulty = (e) => {
        this.setState({ difficultyLevel: e.target.value });
    };

    createTutorial = () => {
        const techsObj = this.state.technologies;
        const searchTechnogies = Object.keys(techsObj).filter((tech) => techsObj[tech]);

        this.props.createTutorialReq({
            thumbnailUrl: this.props.linkUrl || this.state.thumbnailUrl,
            title: this.state.title,
            description: this.state.description,
            content: this.state.editorValue,
            difficultyLevel: this.state.difficultyLevel,
            tags: searchTechnogies,
        });
    };

    componentWillUnmount() {
        this.props.clearErrAndLink();
    }

    render() {
        const { editorValue, technologies } = this.state;
        const { linkUrl, isUploading, isLoading, message, errors } = this.props;

        const ThumbnailImage = () => {
            if (linkUrl) {
                return (
                    <div className='w-50 mb-3'>
                        <img src={linkUrl} alt='' className='w-100 h-auto' />
                    </div>
                );
            }
            return null;
        };

        return (
            <div className='container my-5'>
                <div className='mb-5 h3'>Tạo bài hướng dẫn</div>
                <FormInput placeholder='Tiêu đề' className='mb-3' onChange={this.handleTitle} />
                {errors.title && errors.title.includes("required") ? (
                    <div className='text-danger mb-3'>Vui lòng nhập tiêu đề</div>
                ) : null}
                <FormInput placeholder='Mô tả' className='mb-3' onChange={this.handleDescription} />
                {errors.description && errors.description.includes("required") ? (
                    <div className='text-danger mb-3'>Vui lòng nhập mô tả</div>
                ) : null}
                <FormSelect className='mb-2' onChange={this.handleDifficulty}>
                    <option invalid={errors.difficultyLevel ? true : false}>
                        {errors.difficultyLevel ? "Vui lòng chọn độ khó" : "Chọn độ khó"}
                    </option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                </FormSelect>
                <div>
                    <p>Chọn công nghệ: </p>
                    <FormCheckbox
                        inline
                        checked={technologies.JavaScript}
                        onChange={(e) => this.handleTechChange(e, "JavaScript")}
                    >
                        JavaScript
                    </FormCheckbox>
                    <FormCheckbox
                        inline
                        checked={technologies.ReactJS}
                        onChange={(e) => this.handleTechChange(e, "ReactJS")}
                    >
                        ReactJS
                    </FormCheckbox>
                </div>
                {errors.tags && errors.tags.includes("required") ? (
                    <div className='text-danger mb-3'>Vui lòng chọn công nghệ</div>
                ) : null}
                <div className='custom-file mb-3'>
                    <input
                        type='file'
                        className='custom-file-input'
                        id='customFile'
                        onChange={this.handleThumbnailUrl}
                    />
                    <label className='custom-file-label' htmlFor='customFile'>
                        {isUploading ? "Đang đăng tải" : "Chọn hình thumbnail"}
                    </label>
                </div>
                <FormInput
                    placeholder='Hoặc nhập đường dẫn hình thumbnail'
                    className='mb-3'
                    onChange={this.handleThumbnailInput}
                />
                {errors.thumbnailUrl && errors.thumbnailUrl.includes("required") ? (
                    <div className='text-danger mb-3'>Vui lòng đăng tải hình thumbnail</div>
                ) : null}
                <ThumbnailImage />

                <CKEditor
                    editor={ClassicEditor}
                    config={editorConfiguration}
                    data={editorValue}
                    onInit={(editor) => {
                        editor.ui.view.editable.element.style.height = "200px";
                        editor.plugins.get("FileRepository").createUploadAdapter = function (loader) {
                            return new UploadAdapter(loader);
                        };
                    }}
                    onChange={this.handleEditorValue}
                    onBlur={(event, editor) => {
                        console.log("Blur.", editor);
                    }}
                    onFocus={(event, editor) => {
                        console.log("Focus.", editor);
                    }}
                />
                {errors.content && errors.content.includes("required") ? (
                    <div className='text-danger'>Vui lòng nhập nội dung</div>
                ) : null}
                {message.includes("success") ? (
                    <Alert className='mt-3' theme='success'>
                        Đã tạo thành công
                    </Alert>
                ) : null}
                <Button disabled={isLoading} className='mt-5' onClick={this.createTutorial}>
                    {isLoading ? "Đang lưu..." : "Lưu bài viết"}
                </Button>
                <div className='mt-5'>
                    <span className='h4'>Xem trước ở bên dưới</span>
                    <div>{parse(editorValue)}</div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    linkUrl: state.tutorial.linkUrl,
    isUploading: state.tutorial.isUploading,
    isLoading: state.tutorial.isLoading,
    message: state.tutorial.message,
    errors: state.tutorial.errors,
});
const mapDispatchToProps = (dispatch) => ({
    uploadImageReq: (file) => dispatch(uploadImage(file)),
    createTutorialReq: (tutorial) => dispatch(createTutorial(tutorial)),
    clearErrAndLink: () => dispatch(clearErrorsAndLink()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateTutorialPage);
