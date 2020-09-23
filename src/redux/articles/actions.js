import * as actionTypes from "./action-types";
import BaseApi from "../../api";

const api = BaseApi();

const fetchArticlesStart = () => ({
    type: actionTypes.FETCH_ARTICLES_START,
});

const fetchArticlesSuccess = (tutorials) => ({
    type: actionTypes.FETCH_ARTICLES_SUCCESS,
    payload: tutorials,
});

const fetchArticlesFailure = (err) => ({
    type: actionTypes.FETCH_ARTICLES_FAILURE,
    payload: err,
});

export const fetchArticles = (pageIndex = 1, pageSize = 9) => async (dispatch) => {
    dispatch(fetchArticlesStart());

    try {
        const data = await api.get(`/articles?pageSize=${pageSize}&&pageIndex=${pageIndex}`);
        dispatch(fetchArticlesSuccess(data));
    } catch (error) {
        dispatch(fetchArticlesFailure(error));
    }
};

const fetchOneArticleStart = () => ({
    type: actionTypes.FETCH_ONE_ARTICLE_START,
});

const fetchOneArticleSuccess = (tutorial) => ({
    type: actionTypes.FETCH_ONE_ARTICLE_SUCCESS,
    payload: tutorial,
});

export const fetchOneArticle = (tutorialId) => async (dispatch) => {
    dispatch(fetchOneArticleStart());
    const data = await api.get(`/articles/${tutorialId}?reqFromAd=true`);
    if (data?.id) {
        dispatch(fetchOneArticleSuccess(data));
    }
};

const uploadImageStart = () => ({
    type: actionTypes.UPLOAD_IMAGE_START,
});

const uploadImageSuccess = (url) => ({
    type: actionTypes.UPLOAD_IMAGE_SUCCESS,
    payload: url,
});

const uploadImageFailure = (err) => ({
    type: actionTypes.UPLOAD_IMAGE_FAILURE,
    payload: err,
});

export const uploadImage = (file) => async (dispatch) => {
    dispatch(uploadImageStart());
    const formData = new FormData();
    formData.append("image", file);
    const data = await api.post("/articles/upload-image", formData, "formData");
    if (data?.linkUrl) {
        dispatch(uploadImageSuccess(data.linkUrl));
    } else {
        dispatch(uploadImageFailure(data));
    }
};

export const createArticleStart = () => ({
    type: actionTypes.CREATE_ARTICLE_START,
});

export const createArticleSuccess = (tutorial) => ({
    type: actionTypes.CREATE_ARTICLE_SUCCESS,
    payload: tutorial,
});

export const createArticleFail = (err) => ({
    type: actionTypes.CREATE_ARTICLE_FAILURE,
    payload: err,
});

export const createArticle = (tutorial) => async (dispatch) => {
    dispatch(createArticleStart());
    const data = await api.post("/articles", tutorial);
    if (data?.id) {
        dispatch(createArticleSuccess(data));
    } else {
        dispatch(createArticleFail(data));
    }
};

const deleteArticleStart = () => ({
    type: actionTypes.DELETE_ARTICLE_START,
});

const deleteArticleSuccess = (tutorialId) => ({
    type: actionTypes.DELETE_ARTICLE_SUCCESS,
    payload: tutorialId,
});

export const deleteArticle = (tutorialId) => async (dispatch) => {
    dispatch(deleteArticleStart());
    const data = await api.delete(`/articles/${tutorialId}`);
    if (data?.message) {
        dispatch(deleteArticleSuccess(tutorialId));
    }
};

const updateArticleStart = () => ({
    type: actionTypes.UPDATE_ARTICLE_START,
});

const updateArticleSuccess = () => ({
    type: actionTypes.UPDATE_ARTICLE_SUCCESS,
});

const updateArticleFail = (err) => ({
    type: actionTypes.UPDATE_ARTICLE_FAILURE,
    payload: err,
});

export const updateArticle = (tutorialId, updateData) => async (dispatch) => {
    dispatch(updateArticleStart());
    const data = await api.put(`/articles/${tutorialId}`, updateData);
    if (data?.id) {
        dispatch(updateArticleSuccess());
    } else {
        dispatch(updateArticleFail(data));
    }
};

const clearArticleStart = () => ({
    type: actionTypes.CLEAR_ARTICLE,
});

export const clearArticle = () => (dispatch) => {
    dispatch(clearArticleStart());
};

export const clearAllArticles = () => (dispatch) => {
    dispatch({
        type: actionTypes.CLEAR_ALL_ARTICLES,
    });
};

const clearErrorsAndLinkStart = () => ({
    type: actionTypes.CLEAR_ERRORS_AND_LINK,
});

export const clearErrorsAndLink = () => (dispatch) => {
    dispatch(clearArticle());
    dispatch(clearErrorsAndLinkStart());
};

const searchArticlesStart = () => ({
    type: actionTypes.SEARCH_ARTICLES_START,
});
const searchArticlesSuccess = (tutorials) => ({
    type: actionTypes.SEARCH_ARTICLES_SUCCESS,
    payload: tutorials,
});
export const searchArticles = (technologies) => async (dispatch) => {
    dispatch(searchArticlesStart());

    const data = await api.get(`/articles?technologies=${JSON.stringify(technologies)}`);
    if (Array.isArray(data)) {
        dispatch(searchArticlesSuccess(data));
    }
};

export const getTechnologies = () => async (dispatch) => {
    const data = await api.get("/technologies");
    if (Array.isArray(data)) {
        dispatch({
            type: actionTypes.GET_TECHNOLOGIES_SUCCESS,
            payload: data,
        });
    }
};
