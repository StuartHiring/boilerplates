import { RequestHandler } from "express";
import axios from "axios";

export default (): RequestHandler => (req, res, next) => {
  axios
    .get(
      "https://openlibrary.org/api/books?bibkeys=ISBN:0201558025&format=json"
    )
    .then((response) => {
      res.locals.openLibraryResponse = response.data["ISBN:0201558025"];
      next();
    })
    .catch(() => next());
};
