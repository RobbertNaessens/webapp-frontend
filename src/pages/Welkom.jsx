import "../css/welkom.css";

//Homepage

export default function Welkom() {
  return (
    <>
      <h1>
        Van harte welkom iedereen
        <br />
        Hier worden alle kleine dingen gemaakt: sieraden, beelden, kaarsen,
        geschenken, ...
      </h1>
      <img
        src={
          "https://firebasestorage.googleapis.com/v0/b/mijnwebapp-40676.appspot.com/o/images%2FWelkom.jpg?alt=media&token=815f055b-aefd-4863-b919-b894673a1d43"
        }
        alt={"Welkom"}
      />
      <p>
        Geniet van alle kleine dingen in het leven, meer hebben we niet nodig.
      </p>
    </>
  );
}
