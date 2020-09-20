import React, { Component } from "react";
import "./style.css";
import CustomEditor from "../../components/CustomEditor";
import parse from "html-react-parser";
import { FormInput, Button, Alert, FormCheckbox, FormSelect } from "shards-react";
import { connect } from "react-redux";
import { uploadImage, fetchOneTutorial, updateTutorial, clearErrorsAndLink } from "../../redux/tutorials/actions";
import { withRouter } from "react-router-dom";

class UpdateTutorialPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorValue: "",
            title: "",
            description: "",
            gotTutorial: false,
            thumbnailUrl: "",
            difficultyLevel: 0,
            readingTime: 1,
            technologies: {
                Java: false,
                JavaScript: false,
                NodeJS: false,
                TypeScript: false,
                React: false,
                Vue: false,
                Angular: false,
            },
        };
    }

    handleEditorValue = (event, editor) => {
        this.setState({ editorValue: editor.getData() });
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
        this.setState({ difficultyLevel: parseInt(e.target.value) });
    };

    handleReadingTime = (e) => {
        this.setState({ readingTime: +e.target.value });
    };

    updateTutorial = () => {
        const techsObj = this.state.technologies;
        const searchTechnogies = Object.keys(techsObj).filter((tech) => techsObj[tech]);

        this.props.updateTutorialReq(this.props.tutorial.id, {
            thumbnailUrl: this.props.linkUrl || this.state.thumbnailUrl || this.props.tutorial.thumbnailUrl,
            title: this.state.title,
            description: this.state.description,
            content: this.state.editorValue,
            difficultyLevel: this.state.difficultyLevel,
            readingTime: this.state.readingTime,
            tags: searchTechnogies,
        });
    };

    static getDerivedStateFromProps(props, state) {
        const { tutorial } = props;

        if (tutorial.title && !state.gotTutorial) {
            const technologies = {};
            tutorial.tags.forEach((tech) => {
                if (typeof state.technologies[tech] !== "undefined") {
                    technologies[tech] = true;
                }
            });
            return {
                title: tutorial.title,
                description: tutorial.description,
                editorValue: tutorial.content,
                difficultyLevel: tutorial.difficultyLevel,
                readingTime: tutorial.readingTime,
                technologies,
                gotTutorial: true,
            };
        }
        return null;
    }

    componentDidMount() {
        this.props.fetchTutorialReq(this.props.match.params.tutorialId);
        window.scrollTo(0, 0);
    }

    componentWillUnmount() {
        this.props.clearErrAndLink();
    }

    render() {
        const { editorValue, title, description, difficultyLevel, readingTime, technologies } = this.state;
        const { linkUrl, isUploading, isLoading, tutorial, message, errors } = this.props;

        const ThumbnailImage = () => {
            if (linkUrl || tutorial.thumbnailUrl) {
                return (
                    <div className='w-50 mb-3'>
                        <img src={linkUrl || tutorial.thumbnailUrl} alt='' className='w-100 h-auto' />
                    </div>
                );
            }
            return null;
        };

        return (
            <div className='container update-tutorial-page'>
                <div className='mb-5 h3'>Cập nhật bài hướng dẫn</div>
                <FormInput value={title} placeholder='Tiêu đề' className='mb-3' onChange={this.handleTitle} />
                {errors.title && errors.title.includes("required") ? (
                    <div className='text-danger mb-3'>Vui lòng nhập tiêu đề</div>
                ) : null}
                <FormInput value={description} placeholder='Mô tả' className='mb-3' onChange={this.handleDescription} />
                {errors.description && errors.description.includes("required") ? (
                    <div className='text-danger mb-3'>Vui lòng nhập mô tả</div>
                ) : null}
                <FormInput
                    value={readingTime}
                    type='number'
                    placeholder='Thời gian đọc'
                    className='mb-3'
                    onChange={this.handleReadingTime}
                />
                {errors.readingTime && errors.readingTime.includes("required") ? (
                    <div className='text-danger mb-3'>Vui lòng nhập thời gian đọc</div>
                ) : null}
                <FormSelect className='mb-2' onChange={this.handleDifficulty}>
                    <option invalid={errors.difficultyLevel ? true : false}>
                        {errors.difficultyLevel ? "Vui lòng chọn độ khó" : `Độ khó: ${difficultyLevel}`}
                    </option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                </FormSelect>
                <div>
                    <p>Chọn công nghệ: </p>
                    <FormCheckbox inline checked={technologies.Java} onChange={(e) => this.handleTechChange(e, "Java")}>
                        Java
                    </FormCheckbox>
                    <FormCheckbox
                        inline
                        checked={technologies.JavaScript}
                        onChange={(e) => this.handleTechChange(e, "JavaScript")}
                    >
                        JavaScript
                    </FormCheckbox>
                    <FormCheckbox
                        inline
                        checked={technologies.NodeJS}
                        onChange={(e) => this.handleTechChange(e, "NodeJS")}
                    >
                        NodeJS
                    </FormCheckbox>
                    <FormCheckbox
                        inline
                        checked={technologies.TypeScript}
                        onChange={(e) => this.handleTechChange(e, "TypeScript")}
                    >
                        TypeScript
                    </FormCheckbox>
                    <FormCheckbox
                        inline
                        checked={technologies.React}
                        onChange={(e) => this.handleTechChange(e, "React")}
                    >
                        React
                    </FormCheckbox>
                    <FormCheckbox inline checked={technologies.Vue} onChange={(e) => this.handleTechChange(e, "Vue")}>
                        Vue
                    </FormCheckbox>
                    <FormCheckbox
                        inline
                        checked={technologies.Angular}
                        onChange={(e) => this.handleTechChange(e, "Angular")}
                    >
                        Angular
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
                    defaultValue={tutorial.thumbnailUrl}
                    placeholder='Hoặc nhập đường dẫn hình thumbnail'
                    className='mb-3'
                    onChange={this.handleThumbnailInput}
                />
                {errors.thumbnailUrl && errors.thumbnailUrl.includes("required") ? (
                    <div className='text-danger mb-3'>Vui lòng đăng tải hình thumbnail</div>
                ) : null}
                <ThumbnailImage />

                <CustomEditor editorValue={editorValue} handleEditorValue={this.handleEditorValue} />
                {errors.content && errors.content.includes("required") ? (
                    <div className='text-danger'>Vui lòng nhập nội dung</div>
                ) : null}
                {message.includes("success") ? (
                    <Alert className='mt-3' theme='success'>
                        Đã cập nhật thành công
                    </Alert>
                ) : null}
                <Button disabled={isLoading} className='mt-5' onClick={this.updateTutorial}>
                    {isLoading ? "Đang lưu..." : "Cập nhật bài viết"}
                </Button>
                <div className='mt-5'>
                    <span className='h4'>Xem trước ở bên dưới</span>
                    <div id='preview'>{parse(editorValue)}</div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    linkUrl: state.tutorial.linkUrl,
    isUploading: state.tutorial.isUploading,
    isLoading: state.tutorial.isLoading,
    tutorial: state.tutorial.tutorial,
    message: state.tutorial.message,
    errors: state.tutorial.errors,
});
const mapDispatchToProps = (dispatch) => ({
    uploadImageReq: (file) => dispatch(uploadImage(file)),
    fetchTutorialReq: (id) => dispatch(fetchOneTutorial(id)),
    updateTutorialReq: (id, tutorial) => dispatch(updateTutorial(id, tutorial)),
    clearErrAndLink: () => dispatch(clearErrorsAndLink()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UpdateTutorialPage));
