import './App.css';

import { useEffect, useState } from 'react';

import Pagination from './components/Pagination';
import Search from './components/Search';
import { StatusCodes } from 'http-status-codes';
import axios from 'axios';
import config from './config';

function App() {
    const [error, setError] = useState({});
    const [userDetails, setUserDetails] = useState([]);

    useEffect(() => {
        dataApiCall();
    }, []);

    const dataApiCall = async () => {
        let responseReceived;
        try {
            responseReceived = await axios.get(config.BASE_URL);
            if (responseReceived.status !== StatusCodes.OK) {
                throw new Error(
                    'Something happened while making a network call'
                );
            }
            responseReceived.data = responseReceived.data.map((el) => ({
                ...el,
                visible: true,
                deleted: false,
            }));
            setUserDetails(responseReceived.data);
        } catch (error) {
            const statusCode = error.response.status
                ? error.response.status
                : StatusCodes.BAD_REQUEST;
            setError({ statusCode, message: error.message });
        }
    };

    const onSearch = (event) => {
        const searchText = event.target.value.toLowerCase();
        const nData = [...userDetails];
        const nUserDetails = nData.map((data) => {
            if (
                data.name.toLowerCase().includes(searchText) ||
                data.role.toLowerCase().includes(searchText) ||
                data.email.toLowerCase().includes(searchText)
            ) {
                return { ...data, visible: true };
            } else {
                return { ...data, visible: false };
            }
        });
        console.log(nUserDetails);
        setUserDetails(nUserDetails);
    };

    const handleDelete = (id) => {
        const nData = [...userDetails];
        const nUserDetails = nData.map((data) => {
            if (data.id === id) {
                return { ...data, deleted: true };
            }
            return data;
        });
        setUserDetails(nUserDetails);
    };

    const handleSelect = () => {};
    const handleSelectAll = () => {};

    return (
        <div className="App">
            <h1>{error.message}</h1>
            <Search
                placeholder="Search by name, email or role"
                onChange={onSearch}
            />
            {userDetails.length !== 0 && (
                <Pagination
                    userDetails={userDetails}
                    rowLimit={config.ROW_LIMIT}
                    onDelete={handleDelete}
                    onSelect={handleSelect}
                    onSelectAll={handleSelectAll}
                />
            )}
        </div>
    );
}

export default App;
