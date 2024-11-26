import toast from 'react-hot-toast';

function notify(message: string) {
  toast(message, {
    position: 'top-right',
  });
}
function showSuccessToast(message: string) {
  toast.success(message, {
    position: 'top-right',
  });
}

function showErrorToast(message: string) {
  toast.error(message, {
    position: 'top-right',
  });
}

export { notify, showSuccessToast, showErrorToast };
