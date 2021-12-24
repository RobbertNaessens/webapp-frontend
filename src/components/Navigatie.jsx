import { useContext, useCallback } from "react";
import { Link, NavLink } from "react-router-dom";
import { TypesContext } from "../contexts/TypesProvider";
import ItemPage from "../pages/ItemPage";
import Welkom from "../pages/Welkom";
import ItemList from "./ItemList";
import ItemForm from "./ItemForm";
import NotFoundPage from "../pages/NotFoundPage";
import { Redirect, Route, Switch } from "react-router";
import "../css/navigatie.css";
import { FaShoppingCart } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import WinkelkarPage from "../pages/WinkelkarPage";
import LogInPage from "../pages/LogInPage";
import PrivateRoute from "./PrivateRoute";
import { useLogout, useSession } from "../contexts/AuthProvider";
import BestellingPage from "../pages/BestellingPage";

export const Navigate = () => {
  //Component die de navigatiebalk aanmaakt m.b.v. links
  //Alle routes worden hier gedefinieerd

  const { types } = useContext(TypesContext);
  const { user, isAuthed, hasRole } = useSession();
  const logout = useLogout();

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <>
      <div>
        <div className="balk">
          <div className="welkomUser">
            <p className="welkomParagraaf">Welkom {user ? user.name : ""}!</p>
          </div>
          {isAuthed ? ( //Iemand is ingelogd => uitlogbutton tonen
            <>
              <div className="linkLogin_Logout">
                <button onClick={handleLogout}>Uitloggen</button>
              </div>
            </>
          ) : (
            //Nog niemand ingelogd => loginbutton tonen
            <>
              <div className="linkLogin_Logout">
                <Link to={"/login"}>
                  {" "}
                  <button>Login</button>{" "}
                </Link>
              </div>
            </>
          )}
        </div>
        <div className="mx-auto w-1/5">
          <Link to={"/welkom"}>
            <img
              id="logoImg"
              src={
                "https://firebasestorage.googleapis.com/v0/b/mijnwebapp-40676.appspot.com/o/images%2FHome.jpg?alt=media&token=d3c9e350-ff7b-477c-af68-cdb5db44d4f4"
              }
              alt="Home"
            />
          </Link>
        </div>
        <div id="navLinks">
          <ul id="navigatie_ul">
            <li>
              <NavLink
                activeStyle={{ backgroundColor: "#c5eb9b" }}
                to="/welkom"
              >
                Welkom
              </NavLink>
            </li>
            {types.map((type) => {
              return (
                <li key={type.id}>
                  <NavLink
                    activeStyle={{ backgroundColor: "#c5eb9b" }}
                    to={`/items/type/${type.title}`}
                  >
                    {type.title}
                  </NavLink>
                </li>
              );
            })}
            <li>
              <NavLink
                activeStyle={{ backgroundColor: "#c5eb9b" }}
                to={`/winkelkar`}
              >
                &nbsp;
                <FaShoppingCart />
                &nbsp;
              </NavLink>
            </li>
            {hasRole("admin") ? (
              <>
                <li>
                  <NavLink
                    activeStyle={{ backgroundColor: "#c5eb9b" }}
                    to={`/items/add`}
                  >
                    &nbsp;
                    <GoPlus />
                    &nbsp;
                  </NavLink>
                </li>
                <li>
                  <NavLink to={`/items`}>Items</NavLink>
                </li>
              </>
            ) : (
              ""
            )}
          </ul>
        </div>
      </div>

      <Switch>
        {types.map((type) => {
          return (
            <Route exact path={`/items/type/${type.title}`} key={type.id}>
              <ItemPage />
            </Route>
          );
        })}
        <Route exact path="/welkom">
          <Welkom />
        </Route>
        <Route exact path="/login">
          <LogInPage />
        </Route>
        <Route path="/webapp-frontend">
          <Redirect to="/welkom" />
        </Route>
        <Route path="/" exact>
          <Redirect to="/welkom" />
        </Route>
        <PrivateRoute exact path="/items">
          <div className="grid grid-cols-4">
            <ItemList />
          </div>
        </PrivateRoute>
        <PrivateRoute exact path="/items/add">
          <ItemForm />
        </PrivateRoute>
        <PrivateRoute exact path="/winkelkar">
          <WinkelkarPage />
        </PrivateRoute>
        <PrivateRoute exact path="/bestelling">
          <BestellingPage />
        </PrivateRoute>
        <Route path="*">
          <NotFoundPage />
        </Route>
      </Switch>
    </>
  );
};
