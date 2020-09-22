import * as actionTypes from "./action-types";
import BaseApi from "../../api";

const api = BaseApi();

const fetchTutorialsStart = () => ({
    type: actionTypes.FETCH_TUTORIALS_START,
});

const fetchTutorialsSuccess = (tutorials) => ({
    type: actionTypes.FETCH_TUTORIALS_SUCCESS,
    payload: tutorials,
});

const fetchTutorialsFailure = (err) => ({
    type: actionTypes.FETCH_TUTORIALS_FAILURE,
    payload: err,
});

export const fetchTutorials = (pageIndex = 1, pageSize = 9) => async (dispatch) => {
    dispatch(fetchTutorialsStart());

    try {
        const data = await api.get(`/articles?pageSize=${pageSize}&&pageIndex=${pageIndex}`);
        dispatch(fetchTutorialsSuccess(data));
    } catch (error) {
        dispatch(fetchTutorialsFailure(error));
    }
};

const fetchOneTutorialStart = () => ({
    type: actionTypes.FETCH_ONE_TUTORIAL_START,
});

const fetchOneTutorialSuccess = (tutorial) => ({
    type: actionTypes.FETCH_ONE_TUTORIAL_SUCCESS,
    payload: tutorial,
});

export const fetchOneTutorial = (tutorialId) => async (dispatch) => {
    dispatch(fetchOneTutorialStart());
    const data = await api.get(`/articles/${tutorialId}?reqFromAd=true`);
    if (data?.id) {
        dispatch(fetchOneTutorialSuccess(data));
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

export const createTutorialStart = () => ({
    type: actionTypes.CREATE_TUTORIAL_START,
});

export const createTutorialSuccess = (tutorial) => ({
    type: actionTypes.CREATE_TUTORIAL_SUCCESS,
    payload: tutorial,
});

export const createTutorialFail = (err) => ({
    type: actionTypes.CREATE_TUTORIAL_FAILURE,
    payload: err,
});

export const createTutorial = (tutorial) => async (dispatch) => {
    dispatch(createTutorialStart());
    const data = await api.post("/articles", tutorial);
    if (data?.id) {
        dispatch(createTutorialSuccess(data));
    } else {
        dispatch(createTutorialFail(data));
    }
};

const deleteTutorialStart = () => ({
    type: actionTypes.DELETE_TUTORIAL_START,
});

const deleteTutorialSuccess = (tutorialId) => ({
    type: actionTypes.DELETE_TUTORIAL_SUCCESS,
    payload: tutorialId,
});

export const deleteTutorial = (tutorialId) => async (dispatch) => {
    dispatch(deleteTutorialStart());
    const data = await api.delete(`/articles/${tutorialId}`);
    if (data?.message) {
        dispatch(deleteTutorialSuccess(tutorialId));
    }
};

const updateTutorialStart = () => ({
    type: actionTypes.UPDATE_TUTORIAL_START,
});

const updateTutorialSuccess = () => ({
    type: actionTypes.UPDATE_TUTORIAL_SUCCESS,
});

const updateTutorialFail = (err) => ({
    type: actionTypes.UPDATE_TUTORIAL_FAILURE,
    payload: err,
});

export const updateTutorial = (tutorialId, updateData) => async (dispatch) => {
    dispatch(updateTutorialStart());
    const data = await api.put(`/articles/${tutorialId}`, updateData);
    if (data?.id) {
        dispatch(updateTutorialSuccess());
    } else {
        dispatch(updateTutorialFail(data));
    }
};

const clearTutorialStart = () => ({
    type: actionTypes.CLEAR_TUTORIAL,
});

export const clearTutorial = () => (dispatch) => {
    dispatch(clearTutorialStart());
};

export const clearAllTutorials = () => (dispatch) => {
    dispatch({
        type: actionTypes.CLEAR_ALL_TUTORIALS,
    });
};

const clearErrorsAndLinkStart = () => ({
    type: actionTypes.CLEAR_ERRORS_AND_LINK,
});

export const clearErrorsAndLink = () => (dispatch) => {
    dispatch(clearTutorial());
    dispatch(clearErrorsAndLinkStart());
};

const getSavedTutorialsStart = () => ({
    type: actionTypes.GET_SAVED_TUTORIALS_START,
});

const getSavedTutorialsSuccess = (savedTutorials) => ({
    type: actionTypes.GET_SAVED_TUTORIALS_SUCCESS,
    payload: savedTutorials,
});

export const getSavedTutorials = () => async (dispatch) => {
    dispatch(getSavedTutorialsStart());
    const data = await api.get("/auth/saved-articles");
    if (data?.length >= 0) {
        dispatch(getSavedTutorialsSuccess(data));
    }
};

const searchTutorialsStart = () => ({
    type: actionTypes.SEARCH_TUTORIALS_START,
});
const searchTutorialsSuccess = (tutorials) => ({
    type: actionTypes.SEARCH_TUTORIALS_SUCCESS,
    payload: tutorials,
});
export const searchTutorials = (technologies) => async (dispatch) => {
    dispatch(searchTutorialsStart());

    const data = await api.get(`/articles?tags=${JSON.stringify(technologies)}`);
    if (Array.isArray(data)) {
        dispatch(searchTutorialsSuccess(data));
    }
};
