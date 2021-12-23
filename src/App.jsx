import { ItemsProvider } from "./contexts/ItemsProvider";
import { TypesProvider } from "./contexts/TypesProvider";
import { AuthProvider } from "./contexts/AuthProvider";
import { OrdersProvider } from "./contexts/OrdersProvider";
import { Navigate } from "./components/Navigatie";
import "./App.css";

function App() {
  return (
    <>
      <div id="main">
        <AuthProvider>
          <TypesProvider>
            <ItemsProvider>
              <OrdersProvider>
                <Navigate />
              </OrdersProvider>
            </ItemsProvider>
          </TypesProvider>
        </AuthProvider>
      </div>
      <div className="contact">
        <p className="contact-c">&copy;Robbert Naessens</p>
        <p className="contact-p">Contact:</p>
        <p className="contact-gegevens">
          &#x1F4DE;+32 497 99 40 73
          <br />
          &#9993;robbertnaessens@gmail.com
        </p>
      </div>
    </>
  );
}

export default App;
