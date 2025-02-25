import { confirmable, ConfirmDialog } from "react-confirm";

export interface Props {
  okLabel?: string;
  cancelLabel?: string;
  title?: string;
  confirmation?: string;
}

const Confirmation: ConfirmDialog<Props, boolean> = (props) => {
  return (
    <div
      data-dialog-backdrop="modal"
      data-dialog-backdrop-close="true"
      className={`fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 ${
        props.show ? "" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        data-dialog="modal"
        className="relative m-4 p-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white shadow-sm"
      >
        <div className="flex shrink-0 items-center pb-4 text-xl font-medium text-slate-800">
          {props.title}
        </div>
        <div className="relative border-t border-slate-200 py-4 leading-normal text-slate-600 font-light">
          {props.confirmation}
        </div>
        <div className="flex shrink-0 flex-wrap items-center pt-4 justify-end">
          <button
            data-dialog-close="true"
            className="rounded-md border border-transparent py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
            onClick={() => props.proceed(false)}
          >
            {props.cancelLabel || "Cancel"}
          </button>
          <button
            data-dialog-close="true"
            className="rounded-md bg-green-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
            type="button"
            onClick={() => props.proceed(true)}
          >
            {props.okLabel || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default confirmable(Confirmation);
