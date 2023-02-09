import * as yup from "yup";

export const schema = yup.object().shape({
  title: yup.string().required("此選項必填"),
  about: yup.string().required("此選項必填"),
  destination: yup.string().required("此選項必填"),
  category: yup.string().required("此選項必填"),
});
