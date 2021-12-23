import { FaTrash, FaShoppingCart } from "react-icons/fa";
import { ItemsContext } from "../contexts/ItemsProvider";
import { useOrders } from "../contexts/OrdersProvider";
import { useContext, useCallback } from "react";
import { useLocation } from "react-router";
import { useSession } from "../contexts/AuthProvider";
import "../css/item.css";
import { getItemWithId } from "../api/items";
import swal from "sweetalert";

//Geeft een visuele voorstelling van het item.

export default function Item({
  id,
  title,
  imagesrc,
  type,
  description,
  price,
}) {
  const { deleteItem } = useContext(ItemsContext);

  const { createOrUpdateOrder, getOrderWithUserId, itemsInOrder } = useOrders();

  const { pathname } = useLocation();

  const { isAuthed, user } = useSession();

  let winkelkarItems = itemsInOrder;

  const handleRemove = useCallback(async () => {
    //Items verwijderen (adminrechten nodig)

    swal({
      title: "Ben je zeker?",
      text: "Dit item zal definitief verwijderd worden!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          await deleteItem(id);
          swal("Item is succesvol verwijderd", {
            icon: "success",
          });
        } catch (error) {
          console.error(error);
        }
      }
    });
  }, [deleteItem, id]);

  const addToCart = useCallback(async () => {
    //Item toevoegen aan de winkelwagen

    if (isAuthed) {
      try {
        swal("Toegevoegd!", "Item is toegevoegd aan uw winkelkar", "success");
        const winkelkarItem = await getItemWithId(id);
        winkelkarItems.push(winkelkarItem);
        const cartOrder = await getOrderWithUserId(user.id);
        await createOrUpdateOrder({
          id: cartOrder?.id,
          userId: user.id,
          items: JSON.stringify(winkelkarItems),
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      swal(
        "Waarschuwing",
        "U moet ingelogd zijn om items toe te voegen aan uw winkelkar.",
        "warning"
      );
    }
  }, [isAuthed, getItemWithId, createOrUpdateOrder]);
  return (
    //html om item te tonen
    <>
      <div id="itemData" data-cy="item">
        <img
          className="card-img-top image-thumbnail itemImage"
          src={imagesrc}
          alt={title}
          id="itemImage"
        />

        <div className="card-body">
          <div id="category">{type.title}</div>
          <div className="card-title" id="itemName">
            <h3 data-cy="item_title">{title}</h3>
          </div>
          <div className="card-text" id="itemDescription">
            <p data-cy="item_description">{description}</p>
          </div>
        </div>
        <div className="card-footer">
          <div className="wcf-left">
            {pathname !== "/items" ? (
              <button onClick={addToCart} data-cy="add_cartitem_button">
                <FaShoppingCart />
              </button>
            ) : (
              ""
            )}
            {pathname === "/items" ? (
              <button onClick={handleRemove} data-cy="item_remove_button">
                <FaTrash />
              </button>
            ) : (
              ""
            )}
          </div>
          <div className="wcf-right">
            <div className="price-tag">€{price}</div>
          </div>
        </div>
      </div>
    </>
  );
}
