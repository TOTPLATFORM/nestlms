import { format } from "date-fns";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export function getFromLocalStorage(key: string): string | null {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem(key);
  }
  return null;
}

export function getFromSessionStorage(key: string): string | null {
  if (typeof sessionStorage !== "undefined") {
    return sessionStorage.getItem(key);
  }
  return null;
}

export const errorToast = (message: string) => {
  toast.error(message, {
    position: "bottom-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};
export const successToast = (message: string) => {
  toast.success(message, {
    position: "bottom-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

export const processResponse = (response: any) => {
  if (response?.statusCode == 500) {
    errorToast(response?.message);
    return;
  }
  if (response?.statusCode == 400) {
    response?.message.map((message: string) => {
      errorToast(message);
    });
    return;
  }
  if (response?.success) {
    successToast(response?.message);
    return;
  }
  if (!response?.success) {
    errorToast(response?.message);
    return;
  }
};

export const itemDeleteHandler = (item: any, funcHandler: any) => {
  Swal.fire({
    title: "Do you want to Delete?",
    showCancelButton: true,
    confirmButtonText: "Delete",
    cancelButtonText: `Cancel`,
  }).then((result) => {
    if (result.isConfirmed) {
      funcHandler(item);
    } else if (result.isDenied) {
      Swal.fire("Changes are not saved", "", "info");
    }
  });
};

export const statusValueHandler = (data: any, options: any) => {
  let newData = options.find((item: any) => item.value == data);

  return newData;
};

export const dateFormater = (date: any) => {
  if (!date) return null;

  let newDate = format(new Date(date), "yyyy-MM-dd");

  return newDate;
};
