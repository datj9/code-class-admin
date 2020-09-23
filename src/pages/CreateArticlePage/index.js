import React, { Component } from "react";
import "./style.css";
import CustomEditor from "../../components/CustomEditor";
import parse from "html-react-parser";
import { FormInput, Button, Alert, FormCheckbox, FormSelect } from "shards-react";
import { connect } from "react-redux";
import { uploadImage, createArticle, clearErrorsAndLink, getTechnologies } from "../../redux/articles/actions";

class CreateArticlePage extends Component {
    state = {
        editorValue: "",
        title: "",
        description: "",
        thumbnailUrl: "",
        difficultyLevel: 0,
        readingTime: 1,
        technologies: {},
        setTechs: false,
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

    handleReadingTime = (e) => {
        this.setState({ readingTime: +e.target.value });
    };

    handleTechChange = (e, tech) => {
        console.log(tech);
        console.log(this.state.technologies);
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

    createArticle = () => {
        const technologies = this.props.technologies
            .filter((tech) => this.state.technologies[tech.name])
            .map((tech) => tech.id);

        this.props.createArticleReq({
            thumbnailUrl: this.props.linkUrl || this.state.thumbnailUrl,
            title: this.state.title,
            description: this.state.description,
            content: this.state.editorValue,
            difficultyLevel: this.state.difficultyLevel,
            readingTime: this.state.readingTime,
            technologies,
        });
    };

    static getDerivedStateFromProps(props, state) {
        if (props.technologies.length > 0 && state.setTechs === false) {
            const technologies = {};

            props.technologies.forEach((tech) => (technologies[tech.name] = false));

            return {
                technologies,
                setTechs: true,
            };
        }
    }

    componentDidMount() {
        this.props.getTechnologies();
    }

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
            <div className='container create-article-page'>
                <div className='mb-5 h3'>Tạo bài hướng dẫn</div>
                <FormInput placeholder='Tiêu đề' className='mb-3' onChange={this.handleTitle} />
                {errors.title && errors.title.includes("required") ? (
                    <div className='text-danger mb-3'>Vui lòng nhập tiêu đề</div>
                ) : null}
                <FormInput placeholder='Mô tả' className='mb-3' onChange={this.handleDescription} />
                {errors.description && errors.description.includes("required") ? (
                    <div className='text-danger mb-3'>Vui lòng nhập mô tả</div>
                ) : null}
                <FormInput
                    type='number'
                    placeholder='Thời gian đọc'
                    className='mb-3'
                    onChange={this.handleReadingTime}
                />
                {errors.readingTime && errors.readingTime.includes("required") ? (
                    <div className='text-danger mb-3'>Vui lòng nhập thời gian đọc</div>
                ) : null}
                <FormSelect className='mb-2' onChange={this.handleDifficulty}>
                    <option invalid={errors.difficultyLevel ? "true" : "false"}>
                        {errors.difficultyLevel ? "Vui lòng chọn độ khó" : "Chọn độ khó của bài"}
                    </option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                </FormSelect>
                <div>
                    <p>Chọn công nghệ: </p>
                    {this.props.technologies.map((tech) => (
                        <FormCheckbox
                            key={tech.id}
                            inline
                            checked={technologies[tech.name]}
                            onChange={(e) => this.handleTechChange(e, tech.name)}
                        >
                            {tech.name}
                        </FormCheckbox>
                    ))}
                </div>
                {errors.technologies && errors.technologies.includes("required") ? (
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

                <CustomEditor handleEditorValue={this.handleEditorValue} editorValue={editorValue} />
                {errors.content && errors.content.includes("required") ? (
                    <div className='text-danger'>Vui lòng nhập nội dung</div>
                ) : null}
                {message.includes("success") ? (
                    <Alert className='mt-3' theme='success'>
                        Đã tạo thành công
                    </Alert>
                ) : null}
                <Button disabled={isLoading} className='mt-5' onClick={this.createArticle}>
                    {isLoading ? "Đang lưu..." : "Lưu bài viết"}
                </Button>
                <div className='mt-5'>
                    <span className='h4'>Xem trước ở bên dưới:</span>
                    <div>{parse(editorValue)}</div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    linkUrl: state.article.linkUrl,
    isUploading: state.article.isUploading,
    isLoading: state.article.isLoading,
    message: state.article.message,
    errors: state.article.errors,
    technologies: state.article.technologies,
});
const mapDispatchToProps = (dispatch) => ({
    uploadImageReq: (file) => dispatch(uploadImage(file)),
    createArticleReq: (article) => dispatch(createArticle(article)),
    clearErrAndLink: () => dispatch(clearErrorsAndLink()),
    getTechnologies: () => dispatch(getTechnologies()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateArticlePage);
