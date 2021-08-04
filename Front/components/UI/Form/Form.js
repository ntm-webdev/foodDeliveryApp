import { useFormik } from "formik";
import * as Yup from 'yup';

import useHttp from "../../../hooks/use-http";
import Spinner from "../Spinner/Spinner";
const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/png"
];

const Form = ({ initialValues, fields, url, finalFunction = null, submitButtonText, extraData = null }) => {
  const { sendRequest, message, spinner, errors } = useHttp();

  const formik = useFormik({
    initialValues: initialValues,
    validate: (values) => {
      const keys = Object.keys(values);
      const errors = {};
      keys.forEach((key) => {
        if (!values[key] && key !== "feedbackId") {
          errors[key] = "Required";
        } else {
          if (key == "image" || key == "logo") {
            if (values[key] && values[key].type !== 'image/jpeg' && values[key].type !== "image/png" && values[key].type !== "image/jpg") {
              formik.touched[key] = true;
              errors[key] = "Invalid image";
            }
          }
        }
      });
      return errors;
    },
    onSubmit: async (values) => {
      const data = new FormData();
      const keys = Object.keys(values);
      keys.forEach((key) => {
        data.append(key, values[key]);
      });
      let res;
      if (extraData) {
        res = await sendRequest(url, "post", {...values, order: extraData.order});
      } else {
        res = await sendRequest(url, "post", data);
      }
      if (res != null) {
        finalFunction();
      }
    },
  });

  let input;
  const getInputForm = (el) => {
    switch (el.type) {
      case "textarea":
        input = (
          <textarea
            className="form-control"
            id={el.label}
            name={el.label}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values[el.label]}
          ></textarea>
        );
        break;
      case "number":
        input = (
          <input
            type="number"
            className="form-control"
            id={el.label}
            name={el.label}
            min={el.min}
            max={el.max}
            step={el.step}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values[el.label]}
          />
        );
        break;
      case "text":
        input = (
          <input
            type="text"
            className="form-control"
            id={el.label}
            name={el.label}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values[el.label]}
          />
        );
        break;
      case "email":
        input = (
          <input
            type="email"
            className="form-control"
            id={el.label}
            name={el.label}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values[el.label]}
          />
        );
        break;
      case "password":
        input = (
          <input
            type="password"
            className="form-control"
            id={el.label}
            name={el.label}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values[el.label]}
          />
        );
        break;
      case "file":
        input = (
          <input
            type="file"
            className="form-control-file"
            id={el.label}
            name={el.label}
            onChange={(event) => formik.setFieldValue(el.label, event.target.files[0])}
          />
        );
        break;
      case "hidden":
        input = (
          <input
            type="hidden"
            className="form-control"
            id={el.label}
            name={el.label}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values[el.label]}
          />
        );
        break;
      case "select":
        input = (
          <select
            className="form-control"
            id={el.label}
            name={el.label}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          >
            {Object.keys(el.options).map((key, i) => (
              <option key={i} value={key}>
                {el.options[key]}
              </option>
            ))}
          </select>
        );
        break;
      default:
        input = null;
    }
    return input;
  };

  return (
    <form
      className="form-group"
      onSubmit={formik.handleSubmit}
      encType="multipart/form-data"
    >
      {message.msg && (
        <div
          className={`alert ${message.success ? "alert-success" : "alert-danger"}`}
          role="alert"
        >
          {message.msg}
        </div>
      )}
      {fields.map((el, i) => (
        <div className="form-group" key={i}>
          {el.type !== "hidden" && (
            <label className="capitalized" htmlFor={el.label}>
              {el.label}
            </label>
          )}
          {getInputForm(el)}
          {formik.errors[el.label] && formik.touched[el.label] && (
            <div className="validation-error">{formik.errors[el.label]}</div>
          )}
          {errors.length > 0 && errors[i].msg != null && (
            <p className="validation-error">{errors[i].msg}</p>
          )}
        </div>
      ))}
      <button type="submit" className="btn btn-success">
        {submitButtonText || "Save"}
      </button>
      {spinner && <Spinner />}
    </form>
  );
};

export default Form;
