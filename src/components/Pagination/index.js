import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

import { CircularButton } from '../UI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import config from '../../config';
import styles from './Pagination.module.css';

const Pagination = ({ userDetails, rowLimit }) => {
    const [noOfPages, setNoOfPages] = useState(1);
    const [pageLimit, setPageLimit] = useState(1);
    const [currentPageIndex, setCurrentPageIndex] = useState(1);
    useEffect(() => {
        let calcPages = Math.round(userDetails.length / rowLimit);
        setNoOfPages(calcPages);
        if (calcPages <= config.PAGE_LIMIT) {
            if (calcPages <= 0) calcPages = 1;
            setPageLimit(calcPages);
            return;
        }
        setPageLimit(config.PAGE_LIMIT);
    }, [rowLimit, userDetails]);

    const getToFirstPage = () => {
        setCurrentPageIndex(1);
    };
    const getToLastPage = () => {
        setCurrentPageIndex(noOfPages);
    };
    const getToNextPage = () => {
        setCurrentPageIndex((current) => current + 1);
    };
    const getToPreviousPage = () => {
        setCurrentPageIndex((current) => current - 1);
    };
    const moveToPage = (event) => {
        event.preventDefault();
        setCurrentPageIndex(Number(event.target.innerText));
    };

    const getItemsPerPage = () => {
        let nData = [...userDetails];
        const startIndex = currentPageIndex * rowLimit - rowLimit;
        return nData.splice(startIndex, rowLimit);
    };

    const getPaginationCluster = () => {
        const startingValue =
            Math.floor((currentPageIndex - 1) / pageLimit) * pageLimit;

        const paginationCluster = [];
        for (let idx = 0; idx < pageLimit; idx++) {
            let value = idx + startingValue + 1;
            paginationCluster.push(value);
        }

        return paginationCluster;
    };

    return (
        <div className={styles.paginationContainer}>
            <table>
                <thead>
                    <tr>
                        <th>
                            <input type="checkbox" />
                        </th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {getItemsPerPage().map((user, idx) => (
                        <tr key={idx}>
                            <td>
                                <input type="checkbox" />
                            </td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <>
                                    <FontAwesomeIcon icon={faEdit} />
                                    <FontAwesomeIcon
                                        icon={faTrash}
                                        color="red"
                                    />
                                </>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className={styles.actionBtn}>
                <CircularButton
                    content={`${String.fromCharCode(60)}${String.fromCharCode(
                        60
                    )}`}
                    isDisabled={currentPageIndex === 1 ? true : false}
                    isSelected={false}
                    onClick={getToFirstPage}
                />
                <CircularButton
                    content={String.fromCharCode(60)}
                    isDisabled={currentPageIndex === 1 ? true : false}
                    isSelected={false}
                    onClick={getToPreviousPage}
                />
                {getPaginationCluster().map((item, idx) => (
                    <CircularButton
                        key={idx}
                        content={item}
                        isDisabled={false}
                        isSelected={currentPageIndex === idx + 1 ? true : false}
                        onClick={moveToPage}
                    />
                ))}
                <CircularButton
                    content={String.fromCharCode(62)}
                    isDisabled={
                        currentPageIndex === noOfPages || noOfPages === 0
                            ? true
                            : false
                    }
                    isSelected={false}
                    onClick={getToNextPage}
                />
                <CircularButton
                    content={`${String.fromCharCode(62)}${String.fromCharCode(
                        62
                    )}`}
                    isDisabled={
                        currentPageIndex === noOfPages || noOfPages === 0
                            ? true
                            : false
                    }
                    isSelected={false}
                    onClick={getToLastPage}
                />
            </div>
        </div>
    );
};

export default Pagination;
