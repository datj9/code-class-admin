import React, { Component } from "react";
import "./style.css";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import {
    Card,
    CardTitle,
    CardImg,
    CardBody,
    CardFooter,
    Button,
    Badge,
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter,
} from "shards-react";
import { deleteArticle } from "../../redux/articles/actions";
import CardLoader from "../CardLoader";
import moment from "moment";

class ArticlesList extends Component {
    state = { openModalConfirmDelete: false, activeId: "", activeTitle: "" };

    toggleOpenModalConfirmDelete = ({ id, title }) => {
        this.setState({
            openModalConfirmDelete: !this.state.openModalConfirmDelete,
            activeId: id ? id : undefined,
            activeTitle: title ? title : undefined,
        });
    };

    delTurorial = (id) => {
        this.props.delTurorialReq(id);
    };

    render() {
        const { openModalConfirmDelete, activeId, activeTitle } = this.state;
        const { articles, currentUser, isLoading, isSearching, pageSize = 8 } = this.props;

        const Articles = () => {
            let articlesList = [];
            if (currentUser.userType === "admin") {
                articlesList = articles.map((article) => (
                    <div className='card-item-admin text-decoration-none text-dark' key={article.id}>
                        <Card>
                            <CardImg src={article.thumbnailUrl} />
                            <CardBody>
                                <CardTitle>
                                    {article.title.length <= 30 ? article.title : article.title.slice(0, 30)}
                                </CardTitle>
                                <p>
                                    {article.description <= 30 ? article.description : article.description.slice(0, 30)}
                                </p>
                            </CardBody>
                            <CardFooter className='d-flex justify-content-around'>
                                <Button
                                    className='mr-2'
                                    onClick={() => this.toggleOpenModalConfirmDelete(article)}
                                    theme='danger'
                                >
                                    Xóa Bài
                                </Button>

                                <Link to={`/update-article/${article.id}`}>
                                    <Button className='ml-2' theme='warning'>
                                        Chỉnh sửa
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    </div>
                ));
                return (
                    <>
                        {articlesList}
                        <Modal open={openModalConfirmDelete} toggle={this.toggleOpenModalConfirmDelete}>
                            <ModalHeader>Xác nhận xóa bài</ModalHeader>
                            <ModalBody>
                                <div>Bạn có chắc là muốn xóa bài này?</div>
                                <div>Tựa đề: {activeTitle}</div>
                            </ModalBody>
                            <ModalFooter>
                                <Button onClick={this.toggleOpenModalConfirmDelete} theme='secondary'>
                                    Hủy
                                </Button>
                                <Button onClick={() => this.delTurorial(activeId)} theme='danger'>
                                    Xóa
                                </Button>
                            </ModalFooter>
                        </Modal>
                    </>
                );
            } else {
                return articles.map((article) => (
                    <Link
                        to={`/articles/${article.id}`}
                        className='card-item text-decoration-none text-dark'
                        key={article.id}
                    >
                        <img className='mr-3' src={article.thumbnailUrl} alt='' />
                        <div className='d-flex flex-column'>
                            <span className='article-title'>{article.title}</span>
                            <span className='article-description'>{article.description}</span>
                            <span className='mt-2'>
                                {Date.now() - new Date(article.createdAt) <= 3 * 24 * 60 * 60 * 1000
                                    ? moment(article.createdAt).fromNow()
                                    : moment(article.createdAt).format("MMMM DD")}
                            </span>
                            <div>
                                {article.technologies.map((tech) => (
                                    <Badge key={tech} className='mr-2' pill theme='secondary'>
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </Link>
                ));
            }
        };

        return (
            <div className='d-flex flex-wrap'>
                {isLoading || isSearching ? <CardLoader numberOfCards={pageSize} /> : <Articles />}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    articles: state.article.articles,
    isLoading: state.article.isLoading,
    isSearching: state.article.isSearching,
    currentUser: state.user.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
    delTurorialReq: (id) => dispatch(deleteArticle(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ArticlesList));
