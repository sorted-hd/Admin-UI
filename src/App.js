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
    const [searchResult, setSearchResult] = useState([]);

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
            setUserDetails(responseReceived.data);
            setSearchResult(responseReceived.data);
        } catch (error) {
            const statusCode = error.response.status
                ? error.response.status
                : StatusCodes.BAD_REQUEST;
            setError({ statusCode, message: error.message });
        }
    };

    const onSearch = (event) => {
        const searchText = event.target.value;
        const nData = [...userDetails];
        const nUserDetails = nData.filter((data) => {
            if (data.name.toLowerCase().includes(searchText.toLowerCase())) {
                return true;
            }
            return false;
        });
        setSearchResult(nUserDetails);
    };

    return (
        <div className="App">
            <h1>{error.message}</h1>
            <Search
                placeholder="Search by name, email or role"
                onChange={onSearch}
            />
            {userDetails.length !== 0 && (
                <Pagination
                    userDetails={searchResult}
                    rowLimit={config.ROW_LIMIT}
                />
            )}
        </div>
    );
}

export default App;
