import { IScore } from "./types";

export const prospectScore = {
  save: "Guardar",
  close: "Cerrar",
  notFount: (
    <>
      Después de una cuidadosa búsqueda, <strong>no</strong> encontramos ningún
      score de crédito.
    </>
  ),
};

export const mockFirstScore: IScore = {
  score: 450,
  date: "12/05/2023",
};

export const mockSecondScore: IScore = {
  score: 520,
  date: "12/06/2023",
};

export const urlMock = "https://www.test.co/";
