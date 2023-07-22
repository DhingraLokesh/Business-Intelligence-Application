import Swal from "sweetalert2";

export const normalAlert = (title, text, icon) => {
  return Swal.fire({
    title,
    text,
    icon,
  });
};

export const confirmAlert = (
  title,
  text = "",
  icon,
  showCancelButton = false,
  confirmButtonText
) => {
  return Swal.fire({
    icon,
    title,
    text,
    showCancelButton,
    confirmButtonText,
  });
};
