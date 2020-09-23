import * as actionTypes from "./action-types";

const INITIAL_STATE = {
    isLoading: false,
    isSearching: false,
    isFetchingMore: false,
    loaded: false,
    articles: [],
    technologies: [],
    total: 0,
    article: {},
    linkUrl: "",
    isUploading: false,
    error: {},
    errors: {},
    message: "",
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case actionTypes.FETCH_ARTICLES_START:
            return {
                ...state,
                [state.articles.length === 0 ? "isLoading" : "isFetchingMore"]: true,
            };
        case actionTypes.FETCH_ARTICLES_SUCCESS:
            return {
                ...state,
                [state.articles.length === 0 ? "isLoading" : "isFetchingMore"]: false,
                articles:
                    state.articles.length === 0
                        ? action.payload.articles
                        : state.articles.concat(action.payload.articles),
                total: action.payload.total,
            };
        case actionTypes.FETCH_ARTICLES_FAILURE:
            return {
                ...state,
                [state.articles.length === 0 ? "isLoading" : "isFetchingMore"]: false,
                error: action.payload,
            };
        case actionTypes.FETCH_ONE_ARTICLE_START:
            return {
                ...state,
                isLoading: true,
            };
        case actionTypes.FETCH_ONE_ARTICLE_SUCCESS:
            return {
                ...state,
                article: action.payload,
                isLoading: false,
            };
        case actionTypes.CLEAR_ARTICLE:
            return {
                ...state,
                article: {},
            };
        case actionTypes.UPLOAD_IMAGE_START:
            return {
                ...state,
                isUploading: true,
            };
        case actionTypes.UPLOAD_IMAGE_SUCCESS:
            return {
                ...state,
                isUploading: false,
                linkUrl: action.payload,
            };
        case actionTypes.CLEAR_ALL_ARTICLES:
            return {
                ...state,
                articles: [],
            };
        case actionTypes.CREATE_ARTICLE_START:
            return {
                ...state,
                isLoading: true,
                message: "",
            };
        case actionTypes.CREATE_ARTICLE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                message: "success",
            };
        case actionTypes.CREATE_ARTICLE_FAILURE:
            return {
                ...state,
                isLoading: false,
                errors: action.payload,
            };
        case actionTypes.DELETE_ARTICLE_START:
            return {
                ...state,
                isLoading: true,
            };
        case actionTypes.DELETE_ARTICLE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                articles: state.articles.filter((article) => article.id !== action.payload),
            };
        case actionTypes.UPDATE_ARTICLE_START:
            return {
                ...state,
                isLoading: true,
                message: "",
            };
        case actionTypes.UPDATE_ARTICLE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                message: "success",
                errors: {},
            };
        case actionTypes.UPDATE_ARTICLE_FAILURE:
            return {
                ...state,
                isLoading: false,
                errors: action.payload,
            };
        case actionTypes.CLEAR_ERRORS_AND_LINK:
            return {
                ...state,
                errors: {},
                error: "",
                linkUrl: "",
                message: "",
            };

        case actionTypes.SEARCH_ARTICLES_START:
            return {
                ...state,
                isSearching: true,
            };
        case actionTypes.SEARCH_ARTICLES_SUCCESS:
            return {
                ...state,
                isSearching: false,
                articles: action.payload,
            };
        case actionTypes.GET_TECHNOLOGIES_SUCCESS:
            return {
                ...state,
                technologies: action.payload,
            };
        default:
            return state;
    }
};
