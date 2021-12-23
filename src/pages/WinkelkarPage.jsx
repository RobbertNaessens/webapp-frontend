import { useCallback, useEffect, useState } from "react";
import { useSession } from "../contexts/AuthProvider";
import { useOrders } from "../contexts/OrdersProvider";
import { Link } from "react-router-dom";

import "../css/winkelkar.css";

//Winkelkar van de gebruiker
//van hieruit kunnen bestelde items terug verwijderd worden
//of besteld worden

export default function WinkelkarPage() {
  const { user } = useSession();
  const { getOrderWithUserId, createOrUpdateOrder } = useOrders();
  const [items, setItems] = useState([]);
  const [aantal, setAantal] = useState(0);

  const retrieveItems = async () => {
    //Bestelde items ophalen

    const data = await getOrderWithUserId(user.id);
    if (data) {
      setItems(data.items);
      setAantal(data.items.length);
    }
  };

  useEffect(() => {
    if (user) {
      retrieveItems();
    }
  }, [user]);

  const VerwijderItem = useCallback(
    async (index) => {
      const data = await getOrderWithUserId(user.id);
      const items = data.items;
      setItems(data.items);
      items.splice(index, 1);
      setAantal(items.length);
      await createOrUpdateOrder({
        id: data?.id,
        userId: user.id,
        items: JSON.stringify(items),
      });
    },
    [setAantal, createOrUpdateOrder]
  );

  const berekenTotaal = useCallback(() => {
    if (items) {
      const totaal = items.reduce((acc, value) => acc + Number(value.price), 0);
      return totaal.toFixed(2);
    } else {
      return 0;
    }
  }, [items]);

  if (items.length === 0) return <h1>Uw winkelkar is momenteel nog leeg.</h1>;

  return (
    <>
      <div id="winkelkarPage">
        <h1>Huidige bestelling: {aantal} item(s)</h1>
        <p>Totaal: €{berekenTotaal()}</p>
        <div>
          <Link to={"/bestelling"}>
            <button id="bestelBtn" data-cy="bestel_btn">
              Bestellen
            </button>
          </Link>
        </div>
        <div className="containerWinkelwagen">
          {items
            ? items.map((item, index) => {
                return (
                  <>
                    <div className="gridItem" data-cy="winkelkar_item">
                      <h2>{item.title}</h2>
                      <img src={item.imagesrc} alt={item.title} />
                      <div className="itemFooter">
                        <p>
                          Prijs: €{item.price}
                          <br />
                          <button
                            onClick={() => {
                              VerwijderItem(index);
                            }}
                          >
                            Verwijder
                          </button>
                        </p>
                      </div>
                    </div>
                  </>
                );
              })
            : ""}
        </div>
      </div>
    </>
  );
}
