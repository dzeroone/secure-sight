import { ReactNode } from "react";

interface ModalProps {
  show: boolean
  title: string
  children: ReactNode
  footer?: ReactNode
}

const Modal = (props: ModalProps) => {
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
          {props.children}
        </div>
        {props.footer && (
          <div className="flex shrink-0 flex-wrap items-center pt-4 justify-end">
            {props.footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal