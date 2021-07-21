import styles from "./Modal.module.css";

const Backdrop = ({ onClose }) => (
  <div className={styles.backdrop} onClick={onClose} />
);

const ModalOverlay = ({ onClose, children }) => (
  <div className={styles.modal}>
    <span className={styles.close} onClick={onClose}>
      <i className="fa fa-times" />
    </span>
    <div className={styles.content}>{children}</div>
  </div>
);

const Modal = ({ onClose, children }) => (
  <>
    <Backdrop onClose={onClose} />
    <ModalOverlay onClose={onClose}>{children}</ModalOverlay>
  </>
);

export default Modal;
