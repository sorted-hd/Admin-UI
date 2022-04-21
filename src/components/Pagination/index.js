import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

import { CircularButton } from '../UI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Search from '../Search';
import config from '../../config';
import styles from './Pagination.module.css';

const Pagination = ({
    userDetails,
    rowLimit,
    onEdit,
    onDelete,
    onSelect,
    onSelectAll,
    onBunchDelete,
    onEditValues,
    onSearch,
}) => {
    const [noOfPages, setNoOfPages] = useState(1);
    const [pageLimit, setPageLimit] = useState(1);
    const [currentPageIndex, setCurrentPageIndex] = useState(1);
    const [editedUserValues, setEditedUserValues] = useState({});
    const [allChecked, setAllChecked] = useState(false);

    useEffect(() => {
        let detailSize = userDetails.reduce((total, user) => {
            if (user.visible && !user.deleted) {
                return (total += 1);
            }
            return total;
        }, 0);
        let calcPages = Math.ceil(detailSize / rowLimit);
        setNoOfPages(calcPages);
        if (calcPages <= config.PAGE_LIMIT) {
            if (calcPages <= 0) calcPages = 1;
            setPageLimit(calcPages);
            return;
        }
        setPageLimit(config.PAGE_LIMIT);
    }, [rowLimit, userDetails]);

    useEffect(() => {}, [allChecked]);

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
        let nData = userDetails.filter((user) => user.visible && !user.deleted);
        const startIndex = currentPageIndex * rowLimit - rowLimit;
        return nData.splice(startIndex, rowLimit);
    };

    const getSelectedCount = () => {
        const usersVisible = getItemsPerPage();
        let flag = usersVisible.every((user) => !user.checked);
        return flag;
    };

    const getAllSelectedFlag = () => {
        const usersVisible = getItemsPerPage();
        let flag = usersVisible.every((user) => user.checked);
        return flag;
    };

    const getPaginationCluster = () => {
        let startingValue =
            Math.floor((currentPageIndex - 1) / pageLimit) * pageLimit;
        const paginationCluster = [];

        for (let idx = 0; idx < pageLimit; idx++) {
            let value = idx + startingValue + 1;
            paginationCluster.push(value);
        }

        if (paginationCluster.at(0) > noOfPages) {
            if (startingValue <= 0) {
                return paginationCluster;
            }
            setCurrentPageIndex(startingValue);
        }

        return paginationCluster;
    };

    return (
        <div className={styles.paginationContainer}>
            <Search
                placeholder="Search by name, email or role"
                onChange={onSearch}
            />
            <table>
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                name="selectAll"
                                checked={getAllSelectedFlag()}
                                style={{
                                    cursor: 'pointer',
                                }}
                                onChange={(event) => {
                                    onSelectAll(event, getItemsPerPage());
                                }}
                            />
                        </th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {getItemsPerPage().map((user, idx) => {
                        if (user.visible && !user.deleted) {
                            return (
                                <tr key={idx}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            name={user.name}
                                            style={{
                                                cursor: 'pointer',
                                            }}
                                            onChange={(event) =>
                                                onSelect(event, user)
                                            }
                                            checked={user.checked}
                                        />
                                    </td>
                                    {user.edit && (
                                        <>
                                            <td>
                                                <input
                                                    type="text"
                                                    defaultValue={user.name}
                                                    onChange={(e) =>
                                                        setEditedUserValues({
                                                            ...editedUserValues,
                                                            name: e.target
                                                                .value,
                                                        })
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="email"
                                                    defaultValue={user.email}
                                                    onChange={(e) =>
                                                        setEditedUserValues({
                                                            ...editedUserValues,
                                                            email: e.target
                                                                .value,
                                                        })
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    defaultValue={user.role}
                                                    onChange={(e) =>
                                                        setEditedUserValues({
                                                            ...editedUserValues,
                                                            role: e.target
                                                                .value,
                                                        })
                                                    }
                                                />
                                            </td>
                                        </>
                                    )}

                                    {!user.edit && (
                                        <>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.role}</td>
                                        </>
                                    )}

                                    {user.edit && (
                                        <td>
                                            <CircularButton
                                                content={String.fromCharCode(
                                                    10003
                                                )}
                                                isDisabled={false}
                                                isSelected={false}
                                                onClick={onEditValues.bind(
                                                    null,
                                                    user,
                                                    editedUserValues
                                                )}
                                            />
                                        </td>
                                    )}
                                    {!user.edit && (
                                        <td>
                                            <>
                                                <FontAwesomeIcon
                                                    icon={faEdit}
                                                    style={{
                                                        marginRight: '2rem',
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={onEdit.bind(
                                                        null,
                                                        user
                                                    )}
                                                />
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                    color="red"
                                                    style={{
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={onDelete.bind(
                                                        null,
                                                        user.id
                                                    )}
                                                />
                                            </>
                                        </td>
                                    )}
                                </tr>
                            );
                        } else {
                            return false;
                        }
                    })}
                </tbody>
            </table>

            <div className={styles.actionBtn}>
                <button
                    className={styles.actionBtn__delete}
                    disabled={getSelectedCount()}
                    onClick={onBunchDelete.bind(null, getItemsPerPage())}
                >
                    <span>Delete Selected</span>
                </button>
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
