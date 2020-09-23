import React, { useEffect, useState } from "react";
import "./style.css";
import { FormInput, Button } from "shards-react";
import { Link } from "react-router-dom";
import ArticlesList from "../../components/ArticlesList";
import { clearAllArticles, fetchArticles } from "../../redux/articles/actions";
import { useDispatch, useSelector } from "react-redux";

export default function AdminPage() {
    const [pageIndex, setPageIndex] = useState(0);
    const dispatch = useDispatch();
    const isFetchingMore = useSelector((state) => state.article.isFetchingMore);
    const total = useSelector((state) => state.article.total);
    const { articles } = useSelector((state) => state.article);

    const fetchMoreArticles = () => {
        dispatch(fetchArticles(pageIndex + 1));
    };

    useEffect(() => {
        dispatch(fetchArticles());

        return () => {
            dispatch(clearAllArticles());
        };
    }, [dispatch]);

    useEffect(() => {
        if (articles.length > pageIndex * 9) {
            setPageIndex((p) => ++p);
        }
    }, [articles.length, pageIndex]);

    return (
        <div className='container manage-articles'>
            <div className='title text-dark font-weight-bold mb-3'>Các bài hướng dẫn</div>
            <hr />
            <FormInput placeholder='Tìm kiếm bài hướng dẫn theo tiêu đề' className='mb-3' />
            <Link to='/create-article'>
                <Button className='mb-3'>Tạo Bài Hướng Dẫn</Button>
            </Link>
            <ArticlesList />
            {total > pageIndex * 9 ? (
                <div className='text-center'>
                    <Button disabled={isFetchingMore} onClick={fetchMoreArticles}>
                        {isFetchingMore ? "..." : "More Articles"}
                    </Button>
                </div>
            ) : null}
        </div>
    );
}
