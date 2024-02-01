import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { setMovieData, setSearchInput } from "./store";
import { useEffect, useState } from "react";
import getAllMovieData, { fetchWithQuery } from "./api";

function App() {
  const currentRoute = useSelector((state) => state.currentRoute);
  return (
    <>
      {currentRoute === 0 && <Homepage />}
      <Footer />
    </>
  );
}

function Footer() {
  return (
    <>
      <div className="footer-container">
        <footer>
          <div className="footer-link"></div>
        </footer>
      </div>
    </>
  );
}
function Homepage() {
  const [currentItems, setCurrentItems] = useState([]);

  const dispatch = useDispatch();
  const searchInput = useSelector((state) => state.searchInput);
  const movieData = useSelector((state) => state.movieData);

  // Pagination variables
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [currentBtn, setCurrentBtn] = useState(-1);
  const [isBtnActive, setIsBtnActive] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandData, setExpandData] = useState({});

  const itemsPerPage = 10; // Change this to control the number of items per page

  // Pagination control handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleSearchInputChange = (event) => {
    dispatch(setSearchInput(event.target.value));
    if (event.target.value === "") {
      setCurrentPage(1);

      const currentItems = movieData.slice(0, 10);
      setCurrentItems(currentItems);
    }
  };

  const handleSearchSubmit = () => {
    if (searchInput == "") {
      setIsSearching(false);
    } else {
      setIsSearching(true);
    }
    const fetchSearchResults = async () => {
      const searchResults = await fetchWithQuery(searchInput);
      setCurrentItems(searchResults);
      setCurrentPage(1);
    };
    fetchSearchResults();
  };

  useEffect(() => {
    const fetchAllMovies = async () => {
      const moviesData = await getAllMovieData();
      dispatch(setMovieData(moviesData));
    };

    fetchAllMovies();
  }, [dispatch]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = movieData.slice(startIndex, endIndex);
    setCurrentItems(currentItems);
  }, [currentPage, itemsPerPage, movieData, dispatch]);

  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isExpanded]);
  return (
    <>
      <div
        className={"homepage-container"}
        style={
          isExpanded
            ? {
                overflow: "hidden",
              }
            : {}
        }
      >
        <div className="heading">
          Show <span>Me</span>
        </div>
        <div className="subheading">
          Discover Your Next Bing Worthy Show
          <div className="waves">
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
          </div>
        </div>

        <div className="movie-search-container">
          <input
            className="movie-search-input"
            placeholder="Search by Name / Genre / Language"
            value={searchInput}
            onChange={handleSearchInputChange}
          ></input>
          <div className="submit" onClick={handleSearchSubmit}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16.000pt"
              height="16.000pt"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"></path>
            </svg>
          </div>
        </div>

        <div
          className={"expand-cover " + (isExpanded ? " cover-expanded" : "")}
        >
          <div
            className={
              "content-container " + (isExpanded ? " " : "  fade-away")
            }
          >
            <div className="content-heading">
              <div className="content-title">
                {expandData?.name &&
                  (() => {
                    let words = expandData.name.split(" ");
                    let lastWord = words.pop();
                    let restOfTheWords = words.join(" ");
                    return (
                      <>
                        {restOfTheWords} <span>{lastWord}</span>
                      </>
                    );
                  })()}
              </div>
              <div
                className="close-button close-expanded"
                onClick={() => setIsExpanded(false)}
              ></div>
            </div>
            <div className="content-body">
              <section className="main-section">
                <div className="content-image me-1">
                  <img
                    src={expandData?.image?.original}
                    alt="movie-poster"
                    className="framed"
                  ></img>
                  <div className="links mt-3 d-flex justify-content-between">
                    <a
                      className="button-86"
                      href={
                        expandData?.officialSite
                          ? expandData?.officialSite
                          : expandData?.network?.officialSite
                      }
                    >
                      Official Site
                    </a>
                    <a className="button-86" href={expandData?.url}>
                      TV Maze
                    </a>
                  </div>
                </div>
                <section className="body-section">
                  <div className="content-desc">
                    <section className="content-section">
                      <div className="content-body-heading">Name</div>
                      <div className="content-name-title">
                        {expandData?.name}
                      </div>
                    </section>
                    <section className="content-section">
                      <div className="content-body-heading">Language</div>
                      <div className="content-name-title">
                        {expandData?.language}
                      </div>
                    </section>
                    <section className="content-section">
                      <div className="content-body-heading">Genres</div>
                      <div className="content-name-title">
                        {expandData?.genres?.join(", ")}
                      </div>
                    </section>
                    <div className="content-body-heading">Description</div>
                    <div
                      className="content-desc-body"
                      dangerouslySetInnerHTML={{ __html: expandData?.summary }}
                    ></div>
                  </div>
                  <div className="extra-details row">
                    <div
                      className={
                        "col-lg-6 extra-col" +
                        (window.innerWidth <= 700 && window.innerWidth >= 400
                          ? " col-6"
                          : " col-12")
                      }
                    >
                      <div className="info-block">
                        <div className="block-heading">Air Date</div>
                        <div className="block-content">
                          {expandData?.premiered ? expandData?.premiered : "?"}{" "}
                          to {expandData?.ended ? expandData.ended : "?"}
                        </div>
                      </div>
                      <div className="info-block">
                        <div className="block-heading">Avg Runtime</div>
                        <div className="block-content">
                          {expandData?.averageRuntime
                            ? expandData.averageRuntime
                            : "?"}
                        </div>
                      </div>
                      <div className="info-block">
                        <div className="block-heading">Status</div>
                        <div className="block-content">
                          {expandData?.status ? expandData.status : "?"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "col-lg-6 extra-col" +
                        (window.innerWidth <= 700 && window.innerWidth >= 400
                          ? " col-6"
                          : " col-12")
                      }
                    >
                      <div className="info-block">
                        <div className="block-heading">Weight</div>
                        <div className="block-content">
                          {expandData?.weight ? expandData.weight : "?"}
                        </div>
                      </div>
                      <div className="info-block">
                        <div className="block-heading">Type</div>
                        <div className="block-content">
                          {expandData?.type ? expandData.type : "?"}
                        </div>
                      </div>
                      <div className="info-block">
                        <div className="block-heading">Schedule</div>
                        <div className="block-content">
                          {expandData?.schedule
                            ? `${expandData.schedule?.time}, ${
                                expandData.schedule?.days.length === 1
                                  ? expandData.schedule?.days[0]
                                  : `${expandData.schedule?.days[0]} - ${
                                      expandData.schedule?.days[
                                        expandData.schedule?.days.length - 1
                                      ]
                                    }`
                              }`
                            : "?"}
                        </div>
                      </div>
                      <div className="info-block">
                        <div className="block-heading">Rating</div>
                        <div className="block-content">
                          {expandData?.rating
                            ? expandData.rating?.average
                            : "?"}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </section>
              <section className="extra-detail-section"></section>
            </div>
          </div>
        </div>

        <div className="movies-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Genre</th>
                <th>Premiered</th>
                <th>Ended</th>
                <th>Site</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((movie, index) => (
                <tr
                  key={index}
                  onMouseEnter={() => {
                    setCurrentBtn(index);
                    setIsBtnActive(true);
                  }}
                  onMouseLeave={() => {
                    setIsBtnActive(false);
                  }}
                >
                  <td>
                    <div
                      className={
                        "expand-btn-container " +
                        (isBtnActive && currentBtn == index
                          ? " active-btn-container"
                          : "")
                      }
                    >
                      <button
                        className="button-86"
                        onClick={() => {
                          setIsExpanded(true);
                          setExpandData(movie);
                        }}
                      >
                        Expand
                      </button>
                    </div>
                    <div className="movie-name">
                      {movie.name}{" "}
                      <span className="movie-rating">{movie.weight}</span>
                    </div>
                  </td>
                  <td className="movie-type">{movie.type}</td>
                  <td className="movie-genre">{movie.genres.join(", ")}</td>
                  <td className="date">{movie.premiered}</td>
                  <td className="date">{movie.ended}</td>
                  <td className="ext-link">
                    <a
                      href={
                        movie.officialSite
                          ? movie.officialSite
                          : movie.network.officialSite
                      }
                    >
                      {movie.network ? movie.network.name : "~~~"}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-controls">
          <div className="results-range">
            <span className="showresult">Showing results</span>{" "}
            <span>{(currentPage - 1) * itemsPerPage + 1}</span> -{" "}
            <span>
              {currentPage * itemsPerPage > movieData.length
                ? movieData.length
                : currentPage * itemsPerPage}
            </span>{" "}
            out of{" "}
            <span>{isSearching ? currentItems.length : movieData.length}</span>
          </div>
          <div className="navigate-btns">
            <div
              className={`navigate-btn previous-page ${
                currentPage === 1 ? " navigation-disabled" : ""
              }`}
              onClick={handlePreviousPage}
            >
              <img src="/down.png" alt="previous-page"></img>
            </div>
            <div
              className={`navigate-btn next-page ${
                currentPage ===
                (isSearching ? currentItems.length : movieData.length) /
                  itemsPerPage
                  ? " navigation-disabled"
                  : ""
              }`}
              onClick={handleNextPage}
            >
              <img src="/down.png" alt="next-page"></img>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
