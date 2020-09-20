import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Badge, Button, Container, FormGroup, FormInput, FormSelect } from "shards-react";
import { createMentor, searchUser } from "../../redux/user/actions";
import "./style.css";

export default function CreateMentor() {
    const [searchValue, setSearchValue] = useState("");
    const [searchBy, setSearchBy] = useState("");
    const [userId, setUserId] = useState("");
    const [currentJob, setCurrentJob] = useState("");
    const [numberOfYearsExperience, setNumberOfYearsExperience] = useState(-1);
    const [speciality, setSpeciality] = useState("");
    const [specialities, setSpecialities] = useState([]);
    const [searchByError, setSearchByError] = useState(null);
    const [userIdErr, setUserIdErr] = useState("");
    const [currentJobErr, setCurrentJobErr] = useState("");
    const [numberOfYearsExperienceErr, setNumberOfYearsExperienceErr] = useState("");
    const [specialitiesErr, setSpecialitiesErr] = useState("");
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.user.isLoading);
    const errors = useSelector((state) => state.user.errors);

    const usersList = useSelector((state) => state.user.usersList);
    const isSearching = useSelector((state) => state.user.isSearching);
    const mentor = useSelector((state) => state.user.mentor);

    const submitSearch = () => {
        if (searchBy !== "email" && searchBy !== "name") {
            setSearchByError(true);
        } else {
            dispatch(searchUser(searchValue, searchBy));
            setSearchByError(false);
        }
    };
    const submitCreate = () => {
        if (userId && currentJob && numberOfYearsExperience !== -1 && specialities.length > 0) {
            dispatch(createMentor({ userId, currentJob, numberOfYearsExperience, specialities }));

            setUserIdErr("");
            setCurrentJobErr("");
            setNumberOfYearsExperienceErr("");
            setSpecialitiesErr("");
        }
        if (userId === "") {
            setUserIdErr("Vui lòng chọn user");
        } else {
            setUserIdErr("");
        }
        if (currentJob === "") {
            setCurrentJobErr("Vui lòng chọn công việc");
        } else {
            setCurrentJobErr("");
        }
        if (numberOfYearsExperience === -1) {
            setNumberOfYearsExperienceErr("Vui lòng nhập số năm làm việc");
        } else {
            setNumberOfYearsExperienceErr("");
        }
        if (specialities.length === 0) {
            setSpecialitiesErr("Vui lòng nhập khả năng mentor");
        } else {
            setSpecialitiesErr("");
        }
    };
    const handleSeachValue = (e) => {
        setSearchValue(e.target.value);
    };
    const handleSearchBy = (e) => {
        setSearchBy(e.target.value);
    };
    const handleUserId = (e) => {
        setUserId(e.target.value);
    };
    const handleCurrentJob = (e) => {
        setCurrentJob(e.target.value);
    };
    const handleNumberOfYearsExperience = ({ target: { value: numberOfYears } }) => {
        if (!isNaN(+numberOfYears) && numberOfYears < 50 && numberOfYears >= 0) {
            setNumberOfYearsExperience(+numberOfYears);
        }
    };
    const handleSpeciality = (e) => {
        setSpeciality(e.target.value);
    };
    const handleSpecialities = () => {
        if (speciality) {
            setSpecialities(specialities.concat([speciality]));
            setSpeciality("");
        }
    };

    useEffect(() => {
        setUserId("");
        setCurrentJob("");
        setNumberOfYearsExperience(-1);
        setSpecialities([]);
        setSearchValue("");
        setSearchBy("");
    }, [mentor.id]);

    useEffect(() => {
        if (errors.userId) {
            setUserIdErr("User này đã là mentor. Vui lòng chọn user khác");
            setUserId("");
        }
    }, [errors.userId]);

    return (
        <div className='create-mentor'>
            <Container>
                <div className='mb-3 h3'>Tạo Mentor</div>
                <FormGroup className='d-flex justify-content-between'>
                    <FormInput
                        type={searchBy === "email" ? searchBy : "text"}
                        placeholder='Nhập thông tin user'
                        className='w-50'
                        onChange={handleSeachValue}
                    />
                    <FormSelect
                        value={searchBy}
                        className='w-25'
                        onChange={handleSearchBy}
                        invalid={searchByError ? true : false}
                    >
                        <option value='' disabled>
                            Tìm kiếm theo
                        </option>
                        <option value='email'>Email</option>
                        <option value='name'>Họ Tên</option>
                    </FormSelect>
                    <Button theme='dark' disabled={isSearching} onClick={submitSearch}>
                        {isSearching ? "Đang Tìm Kiếm" : "Tìm Kiếm"}
                    </Button>
                </FormGroup>
                {/* {errors.title && errors.title.includes("required") ? (
                    <div className='text-danger mb-3'>Vui lòng nhập tiêu đề</div>
                ) : null} */}
                <FormGroup className='mb-3 w-100'>
                    <FormSelect
                        value={userId}
                        placeholder='Chọn user'
                        invalid={userIdErr ? true : false}
                        onChange={handleUserId}
                    >
                        <option value='' disabled>
                            {userIdErr ? userIdErr : "Danh sách user"}
                        </option>
                        {usersList.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name} | {user.email}
                                {user.phoneNumber ? ` | ${user.phoneNumber}` : ""}
                            </option>
                        ))}
                    </FormSelect>
                </FormGroup>
                <FormGroup className='mb-3 d-flex'>
                    <FormSelect
                        value={currentJob}
                        invalid={currentJobErr ? true : false}
                        className='w-50'
                        onChange={handleCurrentJob}
                    >
                        <option value='' disabled>
                            {currentJobErr ? currentJobErr : "Công việc hiện tại"}
                        </option>
                        <option>Front-end Developer</option>
                        <option>Back-end Developer</option>
                        <option>Web Developer</option>
                        <option>Mobile Developer</option>
                        <option>Full-stack Developer</option>
                    </FormSelect>
                    <FormInput
                        invalid={numberOfYearsExperienceErr ? true : false}
                        placeholder={
                            numberOfYearsExperienceErr ? numberOfYearsExperienceErr : "Nhập số năm kinh nghiệm"
                        }
                        className='w-50 ml-3'
                        onChange={handleNumberOfYearsExperience}
                        value={numberOfYearsExperience === -1 ? "" : numberOfYearsExperience}
                    />
                </FormGroup>
                <FormGroup>
                    <FormSelect
                        value={speciality}
                        invalid={specialitiesErr ? true : false}
                        className='w-25 mr-2'
                        onChange={handleSpeciality}
                    >
                        <option value='' disabled>
                            {specialitiesErr ? specialitiesErr : "Có thế mentor về"}
                        </option>
                        {specialities.includes("Java") ? null : <option>Java</option>}
                        {specialities.includes("JavaScript") ? null : <option>JavaScript</option>}
                        {specialities.includes("TypeScript") ? null : <option>TypeScript</option>}
                        {specialities.includes("NodeJS") ? null : <option>NodeJS</option>}
                        {specialities.includes("React") ? null : <option>React</option>}
                        {specialities.includes("Angular") ? null : <option>Angular</option>}
                        {specialities.includes("Vue") ? null : <option>Vue</option>}
                    </FormSelect>
                    <Button theme='secondary' className='mr-2' onClick={handleSpecialities}>
                        Thêm
                    </Button>
                    {specialities.map((spec) => (
                        <Badge key={spec} theme='info' className='mr-1'>
                            {spec}
                        </Badge>
                    ))}
                </FormGroup>
                <Button className='mb-3' disabled={isLoading} onClick={submitCreate}>
                    {isLoading ? "Đang Tạo" : "Tạo Mới"}
                </Button>
                {Object.keys(mentor).length > 0 ? <Alert theme='success'>Đã tạo thành công</Alert> : null}
            </Container>
        </div>
    );
}
