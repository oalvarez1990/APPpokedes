import PokedexItem from "./PokedexItem.js";
import { useDarkMode, useNumItems } from "../../provider/AuthProvider.js";
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useProtectedRoute } from '../../provider/AuthProvider.js';
import axios from 'axios';
// import './Pokedex.css';
import Pagination from "../Pagination.js";
// import Footer from './Footer'
import { useSelector, useDispatch } from 'react-redux';


const Pokedex = () => {

    const { isDark } = useDarkMode();


    document.body.style = `background: ${isDark ? 'rgb(29, 27, 27)' : 'rgb(253, 253, 253)'}`;

    // Pokemon List
    const [pokemons, setPokemons] = useState([]);



    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [offset, setOffset] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const { itemsPerPage } = useNumItems();


    const handlePage = (page) => {
        setCurrentPage(page);
        setOffset(itemsPerPage * (page - 1));
        window.scrollTo({ top: 0, behavior: "smooth", });
    }



    // Search
    const [searchTerm, setSearchTerm] = useState('');
    const history = useHistory();

    const lowerCase = (str) => {
        str = str.trim().split("");
        str = str.map(letter => letter.toLowerCase());
        return str.join("");
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            history.push(`/pokedex/${lowerCase(searchTerm)}`);
        }
    };




    // switch of filter
    const [searchByPokemon, setSearchByPokemon] = useState(false);



    // Type
    const [typeList, setTypeList] = useState([]);
    const [type, setType] = useState('');

    // get TypeList
    useEffect(() => {
        const promise = axios(`https://pokeapi.co/api/v2/type`);
        promise.then(res => {
            setTypeList(res.data.results);
        });
    }, []);

    const handleType = (e) => {
        if (e.target.value !== type) {
            setType(e.target.value);
            setIsLoading(true);
            setCurrentPage(1);
            setOffset(0);
        }
    }
    const [newPokemonList, setNewPokemonList] = useState([])
    useEffect(() => {
        if (type) {
            const promise = axios(`https://pokeapi.co/api/v2/type/${type}`);
            promise.then(res => {
                setNewPokemonList(res.data.pokemon);
                setTotalItems(res.data.pokemon.length);
                setIsLoading(false);
            })
        }
    }, [type]);

    const indexOfLastPokemon = currentPage * itemsPerPage;
    const indexOfFirstPokemon = indexOfLastPokemon - itemsPerPage;
    const currentPokemonShowed = newPokemonList.slice(indexOfFirstPokemon, indexOfLastPokemon);



    const name = useSelector((state) => state.name);
    const dispatch = useDispatch();

    const { setAllowed } = useProtectedRoute()

    const logOut = () => {
        dispatch({
            type: 'SET_NAME',
            payload: ""
        })
        history.push('/');
        setAllowed(false);
    }



    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        if (!type) {
            const promise = axios(`https://pokeapi.co/api/v2/pokemon/?limit=${itemsPerPage}&offset=${offset}`);
            promise.then(res => {
                setPokemons(res.data.results);
                setTotalItems(res.data.count);
                setIsLoading(false)
            });
        }
    }, [itemsPerPage, offset, type]);




    return (
        <div>
            <div
                className="container"
                style={{ color: isDark ? 'white' : 'black' }}>

                <button className="log-out"
                    style={{ color: isDark ? 'white' : 'black' }}
                    onClick={() => logOut()}>
                    <i className="fas fa-sign-out-alt"></i>
                </button>

                <h2 className="title">Pokedex</h2>

                <p className="title pokedex">
                    Welcome {name}, here you can find your favorite pokemon
                </p>
                <div>
                    <div className="center check-container">
                        <span>type</span>
                        <input
                            type="checkbox"
                            onChange={() => setSearchByPokemon(!searchByPokemon)} />
                        <span>pokemon</span>
                    </div>
                    {searchByPokemon ?
                        <div className="center">
                            <input
                                type="checkbox"
                                id="check"
                            />
                            <div className={isDark ? "box dark" : "box"}>
                                <input
                                    type="text"
                                    placeholder="Search Here..."
                                    onKeyDown={handleKeyDown}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    value={searchTerm}
                                />
                                <label htmlFor="check"><i className="fas fa-search"></i></label>
                            </div>
                        </div>
                        : isLoading ? (
                            <select
                                className={isDark ? 'dark' : ''}
                                disabled>
                                <option>{type}</option>
                            </select>
                        ) : (
                            <select
                                onClick={handleType}
                                className={isDark ? 'dark' : ''}>
                                <option value=''>All pokemons</option>
                                {typeList.map((value) =>
                                    <option
                                        key={value.name}
                                        value={value.name}
                                        selected={value.name === type ? true : false}>
                                        {value.name}
                                    </option>
                                )}
                            </select>)
                    }
                </div>
                {isLoading ? <div className="loading-spinner"></div> : (
                    <>
                        <div className="row">
                            {type ?
                                currentPokemonShowed.map((value) => {
                                    return (
                                        <div className="col-sm-2 col-lg-3" key={value.pokemon.url.split('https://pokeapi.co/api/v2/pokemon/')[1]}>
                                            <PokedexItem url={value.pokemon.url} />
                                        </div>
                                    )
                                })
                                :
                                pokemons.map((value) => {
                                    return (
                                        <div className="col-sm-2 col-lg-3" key={value.url.split('https://pokeapi.co/api/v2/pokemon/')[1]}>
                                            <PokedexItem url={value.url} />
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            totalItems={totalItems}
                            changePage={handlePage} />
                    </>

                )}

            </div>

        </div>


    )
}

export default Pokedex