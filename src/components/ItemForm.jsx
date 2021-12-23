import React, { useCallback, useContext, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import LabelInput from "./LabelInput";
import LabelSelect from "./LabelSelect";
import { useItems } from "../contexts/ItemsProvider";
import { TypesContext } from "../contexts/TypesProvider.js";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router";
import { storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "../css/form.css";

//Formulier op nieuw item aan te maken. Er zijn ook al functies geschreven om items te veranderen,
//maar deze worden nog niet geïmplementeerd omdat ik nog niet zeker weet of de klant ze effectief nodig heeft

const validationRules = {
  title: { required: "Dit veld is vereist" },
  image: { required: "Dit veld is vereist" },
  type: { required: "Dit veld is vereist" },
  price: {
    valueAsNumber: true,
    required: "Dit veld is vereist",
    min: { value: 1, message: "Minimum €1" },
    max: { value: 5000, message: "Maximum €5000" },
  },
};

export default function ItemForm() {
  //const { id } = useParams();
  const history = useHistory();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm();
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState("");

  const { currentItem, setItemToUpdate, createOrUpdateItem } = useItems();

  const { types } = useContext(TypesContext);
  const optionTypes = types.map((t) => t.title);
  var laatsteUrl;

  useEffect(() => {
    //Functie om data van een te veranderen item in te laden

    if (
      // check on non-empty object
      currentItem &&
      (Object.keys(currentItem).length !== 0 ||
        currentItem.constructor !== Object)
    ) {
      setValue("title", currentItem.title);
      setValue("type", currentItem.type.title);
      setValue("image", currentItem.imagesrc);
      setValue("price", currentItem.price);
    } else {
      reset();
    }
  }, [currentItem, setValue, reset]);

  const onSubmit = useCallback(
    async (data) => {
      console.log(
        `Submit data = ${JSON.stringify(data)}, currentItem = ${JSON.stringify(
          currentItem
        )}`
      );
      try {
        await createOrUpdateItem({
          //momenteel worden enkel nieuwe items aangemaakt

          //id: currentItem ? currentItem.id : "",
          title: data.title,
          imagesrc: laatsteUrl ? laatsteUrl : "noSource",
          typeId: types.find((t) => t.title === data.type).id,
          description: data.description,
          price: data.price,
        });
        setItemToUpdate(null);
        history.push("/items");
      } catch (error) {
        console.error(error);
      }
    },
    [createOrUpdateItem, currentItem, setItemToUpdate, history, types]
  );

  const handleFileChange = (e) => {
    //Juiste image selecteren om up te loaden

    if (e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = useCallback(
    (image) => {
      //image uploaden naar Firebase

      const storageRef = ref(storage, `images/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.log(error);
        },
        () => {
          //image source link ophalen

          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            if (downloadURL) {
              setUrl(downloadURL);
              laatsteUrl = downloadURL;
              document.querySelector("[for=p]").value = 100;
            }
          });
        }
      );
    },
    [setUrl]
  );

  return (
    //formulier weergeven
    <>
      <div id="formId">
        <div className="form-wrapper">
          <FormProvider
            handleSubmit={handleSubmit}
            errors={errors}
            register={register}
          >
            <h1>Voeg een nieuw item toe</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              <LabelInput
                label="title"
                type="text"
                defaultValue=""
                validation={validationRules.title}
                data-cy="title_input"
              />
              <LabelSelect
                label="type"
                options={optionTypes}
                validation={validationRules.type}
                data-cy="type_input"
              />
              <LabelInput
                label="description"
                type="text"
                data-cy="description_input"
              />
              <LabelInput
                label="image"
                type="file"
                onChange={handleFileChange}
                validation={validationRules.image}
                data-cy="image_input"
              />
              <br />
              <div id="loader">
                <progress id="p" value={progress} max="100"></progress>
                <output for="p"></output>
              </div>
              <br />
              {url ? <img src={url} id="imgPreview" /> : ""}
              <LabelInput
                label="price"
                type="number"
                defaultValue="0"
                step="0.01"
                validation={validationRules.price}
                data-cy="price_input"
              />
              <button
                id="submitButton"
                type="submit"
                className="btn btn-primary"
                data-cy="submit_button"
              >
                Voeg toe
              </button>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
}
