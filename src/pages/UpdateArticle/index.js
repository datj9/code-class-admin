import React, { Component } from "react";
import "./style.css";
import CustomEditor from "../../components/CustomEditor";
import parse from "html-react-parser";
import { FormInput, Button, Alert, FormCheckbox, FormSelect } from "shards-react";
import { connect } from "react-redux";
import {
    uploadImage,
    fetchOneArticle,
    getTechnologies,
    updateArticle,
    clearErrorsAndLink,
} from "../../redux/articles/actions";
import { withRouter } from "react-router-dom";

class UpdateArticle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorValue: "",
            title: "",
            description: "",
            gotArticle: false,
            thumbnailUrl: "",
            difficultyLevel: 0,
            readingTime: 1,
            technologies: {},
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

    updateArticle = () => {
        const technologies = this.props.technologies
            .filter((tech) => this.state.technologies[tech.name])
            .map((tech) => tech.id);

        this.props.updateArticleReq(this.props.article.id, {
            thumbnailUrl: this.props.linkUrl || this.state.thumbnailUrl || this.props.article.thumbnailUrl,
            title: this.state.title,
            description: this.state.description,
            content: this.state.editorValue,
            difficultyLevel: this.state.difficultyLevel,
            readingTime: this.state.readingTime,
            technologies,
        });
    };

    static getDerivedStateFromProps(props, state) {
        const { article } = props;

        if (article.title && props.technologies.length > 0 && !state.gotArticle) {
            const technologies = {};

            props.technologies.forEach((tech) => (technologies[tech.name] = false));
            article.technologies.forEach((tech) => {
                const foundTech = props.technologies.find((t) => t.id === tech);
                if (foundTech) {
                    technologies[foundTech.name] = true;
                }
            });
            return {
                title: article.title,
                description: article.description,
                editorValue: article.content,
                difficultyLevel: article.difficultyLevel,
                readingTime: article.readingTime,
                technologies,
                gotArticle: true,
            };
        }
        return null;
    }

    componentDidMount() {
        this.props.fetchArticleReq(this.props.match.params.articleId);
        this.props.getTechnologies();
        window.scrollTo(0, 0);
    }

    componentWillUnmount() {
        this.props.clearErrAndLink();
    }

    render() {
        const { editorValue, title, description, difficultyLevel, readingTime, technologies } = this.state;
        const { linkUrl, isUploading, isLoading, article, message, errors } = this.props;

        const ThumbnailImage = () => {
            if (linkUrl || article.thumbnailUrl) {
                return (
                    <div className='w-50 mb-3'>
                        <img src={linkUrl || article.thumbnailUrl} alt='' className='w-100 h-auto' />
                    </div>
                );
            }
            return null;
        };

        return (
            <div className='container update-article-page'>
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
                    <option invalid={errors.difficultyLevel ? "true" : "false"}>
                        {errors.difficultyLevel ? "Vui lòng chọn độ khó" : `Độ khó: ${difficultyLevel}`}
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
                    defaultValue={article.thumbnailUrl}
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
                <Button disabled={isLoading} className='mt-5' onClick={this.updateArticle}>
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
    linkUrl: state.article.linkUrl,
    isUploading: state.article.isUploading,
    isLoading: state.article.isLoading,
    article: state.article.article,
    technologies: state.article.technologies,
    message: state.article.message,
    errors: state.article.errors,
});
const mapDispatchToProps = (dispatch) => ({
    uploadImageReq: (file) => dispatch(uploadImage(file)),
    fetchArticleReq: (id) => dispatch(fetchOneArticle(id)),
    getTechnologies: () => dispatch(getTechnologies()),
    updateArticleReq: (id, article) => dispatch(updateArticle(id, article)),
    clearErrAndLink: () => dispatch(clearErrorsAndLink()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UpdateArticle));
