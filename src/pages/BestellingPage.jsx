import { useSession } from "../contexts/AuthProvider";
import { useOrders } from "../contexts/OrdersProvider";
import { useHistory } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import LabelInput from "../components/LabelInput";
import { useEffect, useState, useCallback } from "react";
import { send } from "emailjs-com";
import config from "../config.json";
import swal from "@sweetalert/with-react";

import "../css/bestelling.css";

//Toont de bestelling van de gebruiker + formulier voor verdere gegevens

const validationRules = {
  adres: { required: "Dit veld is vereist" },
  gemeente: { required: "Dit veld is vereist" },
  postcode: {
    valueAsNumber: true,
    required: "Dit veld is vereist",
    min: { value: 1000, message: "Minimum 1000" },
    max: { value: 9999, message: "Maximum 9999" },
  },
};

const EMAIL_SERVICE_TOKEN = config.email_service_token;
const EMAIL_TEMPLATE_TOKEN = config.email_template_token;
const EMAIL_USER_TOKEN = config.email_user_token;

export default function BestellingPage() {
  const history = useHistory();
  const { user } = useSession();
  const { currentOrder, deleteOrder } = useOrders();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm();
  const [testMap, setMap] = useState(new Map());
  const [arrayUniqueById, setArr] = useState([]);

  const reduceOrders = useCallback(() => {
    //Per item mappen we hoeveel ervan besteld zijn

    const hulp = currentOrder.items;
    let testMap2 = new Map();
    if (hulp) {
      hulp.forEach((item) => {
        if (!testMap2.get(item.id)) {
          testMap2.set(item.id, 1);
        } else {
          testMap2.set(item.id, testMap2.get(item.id) + 1);
        }
      });
    }
    setMap(testMap2);
    //nieuwe map wordt weer omgezet naar een array om vervolgens
    //de array-methode map te kunnen gebruiken

    setArr([
      ...new Map(
        currentOrder?.items?.map((item) => [item["id"], item])
      ).values(),
    ]);
  }, [currentOrder]);

  const berekenTotaal = useCallback(() => {
    //Totaal bedrag van de bestelling berekenen

    if (currentOrder?.items) {
      const totaal = currentOrder.items.reduce(
        (acc, value) => acc + Number(value.price),
        0
      );
      return totaal.toFixed(2);
    } else {
      return 0;
    }
  }, [currentOrder]);

  const sendEmail = useCallback(() => {
    //Bevestigingsmail naar de user sturen

    send(
      EMAIL_SERVICE_TOKEN,
      EMAIL_TEMPLATE_TOKEN,
      {
        from_name: "Robbert Naessens",
        to_name: user.name,
        send_to: user.email,
        message:
          "Dit is een testmessage. De bestelling werd succesvol ontvangen",
        reply_to: "robbertnaessens@gmail.com",
      },
      EMAIL_USER_TOKEN
    )
      .then((response) => {
        console.log("SUCCESS!", response.status, response.text);
      })
      .catch((err) => {
        console.log("FAILED...", err);
      });
  }, [user]);

  const onSubmit = useCallback(() => {
    //Effectief bestellen

    swal({
      title: "Laatste check",
      text: "Zijn al uw gegevens correct?",
      icon: "warning",
      buttons: ["Annuleer", "Bestel!"],
    }).then(async (willOrder) => {
      if (willOrder) {
        try {
          swal({
            title: "Gelukt",
            content: (
              <div>
                <b>Uw bestelling werd goed ontvangen!</b>
                <br />U ontvangt binnen enkele minuten een mail met bevestiging
                en verdere instructies.
              </div>
            ),
            icon: "success",
          });
          //sendEmail();
          deleteOrder(currentOrder.id);
          history.replace("/");
        } catch (error) {
          console.error(error);
        }
      }
    });
  }, [history, user, currentOrder, deleteOrder]);

  useEffect(() => {
    reduceOrders();
    if (user) {
      //Naam en email van de gebruiker automatisch invullen in formulier

      setValue("naam", user.name);
      setValue("email", user.email);
    } else {
      reset();
    }
  }, [user, reset, setValue, reduceOrders]);

  return (
    <div id="bestelPage">
      <h1>Uw bestelde items</h1>
      <p>Totaal: €{berekenTotaal()}</p>
      <div className="table-wrapper">
        <table className="fl-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Amount</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody data-cy="bestelling_tabel">
            {arrayUniqueById?.map((value) => {
              return (
                <tr>
                  <td>{value.title}</td>
                  <td>x{testMap.get(value.id)}</td>
                  <td>€{testMap.get(value.id) * value.price}</td>
                  <td>
                    <button
                      onClick={() => {
                        return swal({
                          title: value.title,
                          content: (
                            <img alt={value.title} src={value.imagesrc}></img>
                          ),
                        });
                      }}
                    >
                      &#x1F50D;
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <h1>Uw gegevens</h1>
      <div className="form-wrapper">
        <FormProvider
          handleSubmit={handleSubmit}
          errors={errors}
          register={register}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <LabelInput
              label="naam"
              type="text"
              disabled
              data-cy="bestelling_naam"
            />
            <LabelInput
              label="email"
              type="text"
              disabled
              data-cy="bestelling_email"
            />
            <LabelInput
              label="adres"
              type="text"
              validation={validationRules.adres}
              data-cy="bestelling_adres"
            />
            <LabelInput
              label="postcode"
              type="number"
              validation={validationRules.postcode}
              data-cy="bestelling_postcode"
            />
            <LabelInput
              label="gemeente"
              type="text"
              validation={validationRules.gemeente}
              data-cy="bestelling_gemeente"
            />
            <button type="submit" data-cy="bestelling_submit">
              Bestel
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
